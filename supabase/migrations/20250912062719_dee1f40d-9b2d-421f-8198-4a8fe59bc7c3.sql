-- FASE 2: Limpiar Estados de Tareas

-- 1. Función para limpiar tareas obsoletas
CREATE OR REPLACE FUNCTION public.cleanup_obsolete_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Archivar tareas canceladas más antiguas de 30 días
    UPDATE agent_tasks 
    SET is_archived = true, updated_at = now()
    WHERE status = 'cancelled' 
    AND created_at < now() - interval '30 days'
    AND is_archived = false;
    
    -- Archivar tareas completadas más antiguas de 90 días
    UPDATE agent_tasks 
    SET is_archived = true, updated_at = now()
    WHERE status = 'completed' 
    AND created_at < now() - interval '90 days'
    AND is_archived = false;
    
    RAISE NOTICE 'Cleanup completed successfully';
END;
$$;

-- 2. Función para sincronizar límites de tareas activas
CREATE OR REPLACE FUNCTION public.sync_active_task_limits()
RETURNS TABLE(user_id uuid, active_count bigint, action_taken text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            at.user_id,
            COUNT(*) as active_tasks
        FROM agent_tasks at
        WHERE at.status IN ('pending', 'in_progress') 
        AND at.is_archived = false
        GROUP BY at.user_id
        HAVING COUNT(*) > 15
    ),
    updates AS (
        UPDATE agent_tasks 
        SET status = 'cancelled', 
            updated_at = now(),
            notes = COALESCE(notes, '') || ' [AUTO-CANCELLED: Exceeds limit]'
        WHERE id IN (
            SELECT at.id 
            FROM agent_tasks at
            INNER JOIN user_stats us ON at.user_id = us.user_id
            WHERE at.status = 'pending' 
            AND at.is_archived = false
            ORDER BY at.created_at DESC
            OFFSET 15
        )
        RETURNING agent_tasks.user_id
    )
    SELECT 
        us.user_id,
        us.active_tasks,
        'AUTO-CANCELLED excess tasks'::text
    FROM user_stats us;
END;
$$;

-- 3. Mejorar el trigger de límite de tareas
DROP TRIGGER IF EXISTS trigger_check_active_tasks_limit ON agent_tasks;

CREATE OR REPLACE FUNCTION public.check_active_tasks_limit_enhanced()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    active_count integer;
BEGIN
    -- Solo verificar en INSERT y UPDATE que cambie el status a activo
    IF (TG_OP = 'INSERT' AND NEW.status IN ('pending', 'in_progress')) OR 
       (TG_OP = 'UPDATE' AND NEW.status IN ('pending', 'in_progress') AND OLD.status NOT IN ('pending', 'in_progress')) THEN
        
        -- Contar tareas activas actuales del usuario (excluyendo la actual si es UPDATE)
        SELECT COUNT(*) INTO active_count
        FROM agent_tasks 
        WHERE user_id = NEW.user_id 
        AND status IN ('pending', 'in_progress')
        AND is_archived = false
        AND (TG_OP = 'INSERT' OR id != NEW.id);
        
        -- Verificar límite
        IF active_count >= 15 THEN
            RAISE EXCEPTION 'TASK_LIMIT_EXCEEDED: No puedes tener más de 15 tareas activas (tienes: %). Completa algunas tareas pendientes primero.', active_count;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Recrear el trigger
CREATE TRIGGER trigger_check_active_tasks_limit_enhanced
    BEFORE INSERT OR UPDATE ON agent_tasks
    FOR EACH ROW
    EXECUTE FUNCTION check_active_tasks_limit_enhanced();

-- 4. Arreglar políticas RLS para user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Ejecutar limpieza inicial
SELECT public.cleanup_obsolete_tasks();
SELECT * FROM public.sync_active_task_limits();