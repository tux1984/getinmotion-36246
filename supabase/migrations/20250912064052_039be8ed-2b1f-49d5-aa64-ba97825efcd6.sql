-- ============= FASE 3.3: VALIDACIONES ADICIONALES DE BASE DE DATOS =============

-- Función para validar formato de email mejorado
CREATE OR REPLACE FUNCTION validate_email_format(email_input text)
RETURNS boolean AS $$
BEGIN
    -- Validación básica de formato email
    IF email_input !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
        RETURN false;
    END IF;
    
    -- Validaciones adicionales de seguridad
    IF length(email_input) > 254 THEN
        RETURN false;
    END IF;
    
    -- No permitir emails con doble punto
    IF email_input LIKE '%..%' THEN
        RETURN false;
    END IF;
    
    -- No permitir algunos caracteres peligrosos
    IF email_input ~ '[<>"\\'']' THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para validar rangos de fechas
CREATE OR REPLACE FUNCTION validate_date_range(start_date timestamp with time zone, end_date timestamp with time zone)
RETURNS boolean AS $$
BEGIN
    -- Verificar que las fechas no sean null
    IF start_date IS NULL OR end_date IS NULL THEN
        RETURN false;
    END IF;
    
    -- Verificar que start_date sea anterior a end_date
    IF start_date >= end_date THEN
        RETURN false;
    END IF;
    
    -- Verificar que las fechas no sean muy antiguas (más de 100 años)
    IF start_date < (now() - interval '100 years') THEN
        RETURN false;
    END IF;
    
    -- Verificar que las fechas no sean muy en el futuro (más de 10 años)
    IF end_date > (now() + interval '10 years') THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para validar JSON structure
CREATE OR REPLACE FUNCTION validate_json_structure(json_input jsonb, required_keys text[])
RETURNS boolean AS $$
DECLARE
    key text;
BEGIN
    -- Verificar que sea un objeto JSON válido
    IF json_input IS NULL OR jsonb_typeof(json_input) != 'object' THEN
        RETURN false;
    END IF;
    
    -- Verificar que contenga todas las claves requeridas
    FOREACH key IN ARRAY required_keys
    LOOP
        IF NOT json_input ? key THEN
            RETURN false;
        END IF;
    END LOOP;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para limpiar y validar texto de entrada
CREATE OR REPLACE FUNCTION sanitize_text_input(text_input text, max_length integer DEFAULT 1000)
RETURNS text AS $$
DECLARE
    cleaned_text text;
BEGIN
    -- Retornar null si input es null
    IF text_input IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Limpiar el texto
    cleaned_text := trim(text_input);
    
    -- Remover caracteres de control peligrosos
    cleaned_text := regexp_replace(cleaned_text, '[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', 'g');
    
    -- Remover scripts y contenido peligroso
    cleaned_text := regexp_replace(cleaned_text, '<script[^>]*>.*?</script>', '', 'gi');
    cleaned_text := regexp_replace(cleaned_text, '<iframe[^>]*>.*?</iframe>', '', 'gi');
    cleaned_text := regexp_replace(cleaned_text, 'javascript:', '', 'gi');
    cleaned_text := regexp_replace(cleaned_text, 'data:text/html', '', 'gi');
    
    -- Truncar si excede la longitud máxima
    IF length(cleaned_text) > max_length THEN
        cleaned_text := substring(cleaned_text, 1, max_length);
    END IF;
    
    RETURN cleaned_text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger para validar y limpiar datos en agent_tasks
CREATE OR REPLACE FUNCTION validate_and_clean_agent_task()
RETURNS trigger AS $$
BEGIN
    -- Validar y limpiar título
    NEW.title := sanitize_text_input(NEW.title, 200);
    IF NEW.title IS NULL OR length(trim(NEW.title)) = 0 THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: El título de la tarea no puede estar vacío';
    END IF;
    
    -- Validar y limpiar descripción
    NEW.description := sanitize_text_input(NEW.description, 2000);
    
    -- Validar prioridad
    IF NEW.priority < 1 OR NEW.priority > 5 THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: La prioridad debe estar entre 1 y 5';
    END IF;
    
    -- Validar porcentaje de progreso
    IF NEW.progress_percentage < 0 OR NEW.progress_percentage > 100 THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: El porcentaje de progreso debe estar entre 0 y 100';
    END IF;
    
    -- Validar fecha de vencimiento
    IF NEW.due_date IS NOT NULL AND NEW.due_date < now() - interval '1 day' THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: La fecha de vencimiento no puede ser más de 1 día en el pasado';
    END IF;
    
    -- Validar que subtasks sea un array válido
    IF NEW.subtasks IS NOT NULL AND jsonb_typeof(NEW.subtasks) != 'array' THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: Subtasks debe ser un array JSON válido';
    END IF;
    
    -- Validar que resources sea un array válido
    IF NEW.resources IS NOT NULL AND jsonb_typeof(NEW.resources) != 'array' THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: Resources debe ser un array JSON válido';
    END IF;
    
    -- Validar tiempo invertido
    IF NEW.time_spent < 0 THEN
        NEW.time_spent := 0;
    END IF;
    
    -- Limpiar notas
    NEW.notes := sanitize_text_input(NEW.notes, 5000);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a agent_tasks
DROP TRIGGER IF EXISTS validate_and_clean_agent_task_trigger ON agent_tasks;
CREATE TRIGGER validate_and_clean_agent_task_trigger
    BEFORE INSERT OR UPDATE ON agent_tasks
    FOR EACH ROW
    EXECUTE FUNCTION validate_and_clean_agent_task();

-- Función para auditoría automática de inconsistencias
CREATE OR REPLACE FUNCTION audit_data_inconsistencies()
RETURNS TABLE(
    table_name text,
    issue_type text,
    issue_description text,
    affected_count bigint,
    severity text
) AS $$
BEGIN
    -- Tareas con fechas inconsistentes
    RETURN QUERY
    SELECT 
        'agent_tasks'::text,
        'date_inconsistency'::text,
        'Tareas completadas sin fecha de finalización'::text,
        COUNT(*)::bigint,
        'medium'::text
    FROM agent_tasks 
    WHERE status = 'completed' AND completed_at IS NULL
    HAVING COUNT(*) > 0;
    
    -- Tareas con progreso inconsistente
    RETURN QUERY
    SELECT 
        'agent_tasks'::text,
        'progress_inconsistency'::text,
        'Tareas completadas con progreso menor a 100%'::text,
        COUNT(*)::bigint,
        'low'::text
    FROM agent_tasks 
    WHERE status = 'completed' AND progress_percentage < 100
    HAVING COUNT(*) > 0;
    
    -- Usuarios con demasiadas tareas activas
    RETURN QUERY
    SELECT 
        'agent_tasks'::text,
        'active_tasks_limit'::text,
        'Usuarios con más de 15 tareas activas'::text,
        COUNT(DISTINCT user_id)::bigint,
        'high'::text
    FROM agent_tasks 
    WHERE status IN ('pending', 'in_progress') 
    AND is_archived = false
    GROUP BY user_id
    HAVING COUNT(*) > 15;
    
    -- Tareas huérfanas (sin usuario válido)
    RETURN QUERY
    SELECT 
        'agent_tasks'::text,
        'orphaned_tasks'::text,
        'Tareas sin usuario válido'::text,
        COUNT(*)::bigint,
        'critical'::text
    FROM agent_tasks 
    WHERE user_id IS NULL
    HAVING COUNT(*) > 0;
    
    -- Perfiles sin usuario correspondiente
    RETURN QUERY
    SELECT 
        'user_profiles'::text,
        'orphaned_profiles'::text,
        'Perfiles sin usuario correspondiente en auth'::text,
        COUNT(*)::bigint,
        'medium'::text
    FROM user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    WHERE au.id IS NULL
    HAVING COUNT(*) > 0;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para reparar inconsistencias automáticamente
CREATE OR REPLACE FUNCTION repair_data_inconsistencies()
RETURNS TABLE(
    action_taken text,
    records_affected bigint,
    details text
) AS $$
DECLARE
    affected_count bigint;
BEGIN
    -- Actualizar fechas de finalización para tareas completadas
    UPDATE agent_tasks 
    SET completed_at = updated_at 
    WHERE status = 'completed' AND completed_at IS NULL;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    IF affected_count > 0 THEN
        RETURN QUERY SELECT 
            'updated_completion_dates'::text,
            affected_count,
            'Actualizadas fechas de finalización para tareas completadas'::text;
    END IF;
    
    -- Actualizar progreso para tareas completadas
    UPDATE agent_tasks 
    SET progress_percentage = 100 
    WHERE status = 'completed' AND progress_percentage < 100;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    IF affected_count > 0 THEN
        RETURN QUERY SELECT 
            'updated_progress'::text,
            affected_count,
            'Actualizado progreso a 100% para tareas completadas'::text;
    END IF;
    
    -- Archivar tareas canceladas antiguas
    UPDATE agent_tasks 
    SET is_archived = true, updated_at = now()
    WHERE status = 'cancelled' 
    AND created_at < now() - interval '30 days'
    AND is_archived = false;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    IF affected_count > 0 THEN
        RETURN QUERY SELECT 
            'archived_old_cancelled_tasks'::text,
            affected_count,
            'Archivadas tareas canceladas antiguas (>30 días)'::text;
    END IF;
    
    -- Reparar tareas con user_id nulo (eliminar si no se pueden recuperar)
    DELETE FROM agent_tasks WHERE user_id IS NULL;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    IF affected_count > 0 THEN
        RETURN QUERY SELECT 
            'deleted_orphaned_tasks'::text,
            affected_count,
            'Eliminadas tareas huérfanas sin user_id'::text;
    END IF;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear índices para mejorar rendimiento de validaciones
CREATE INDEX IF NOT EXISTS idx_agent_tasks_validation_check 
ON agent_tasks(user_id, status, is_archived) 
WHERE status IN ('pending', 'in_progress') AND is_archived = false;

CREATE INDEX IF NOT EXISTS idx_agent_tasks_cleanup 
ON agent_tasks(status, created_at, is_archived)
WHERE is_archived = false;

-- Función para estadísticas de validación
CREATE OR REPLACE FUNCTION get_validation_stats()
RETURNS jsonb AS $$
DECLARE
    stats jsonb;
BEGIN
    SELECT jsonb_build_object(
        'total_tasks', (SELECT COUNT(*) FROM agent_tasks),
        'active_tasks', (SELECT COUNT(*) FROM agent_tasks WHERE status IN ('pending', 'in_progress') AND is_archived = false),
        'completed_tasks', (SELECT COUNT(*) FROM agent_tasks WHERE status = 'completed'),
        'archived_tasks', (SELECT COUNT(*) FROM agent_tasks WHERE is_archived = true),
        'users_with_tasks', (SELECT COUNT(DISTINCT user_id) FROM agent_tasks),
        'avg_tasks_per_user', (SELECT ROUND(AVG(task_count), 2) FROM (
            SELECT COUNT(*) as task_count 
            FROM agent_tasks 
            WHERE status IN ('pending', 'in_progress') AND is_archived = false
            GROUP BY user_id
        ) subquery),
        'tasks_over_limit', (SELECT COUNT(*) FROM (
            SELECT user_id, COUNT(*) as task_count 
            FROM agent_tasks 
            WHERE status IN ('pending', 'in_progress') AND is_archived = false
            GROUP BY user_id
            HAVING COUNT(*) > 15
        ) over_limit),
        'validation_timestamp', now()
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;