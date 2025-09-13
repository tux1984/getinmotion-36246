-- LIMPIEZA COMPLETA DEL SISTEMA
-- Eliminar todos los usuarios excepto el principal
DELETE FROM admin_users WHERE email != 'rodolforodolf17@gmail.com';

-- Insertar usuario principal como super admin si no existe
INSERT INTO admin_users (email, is_active, created_by)
VALUES ('rodolforodolf17@gmail.com', true, null)
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- Limpiar todas las tablas de datos de usuario (mantener estructura)
DELETE FROM agent_tasks;
DELETE FROM agent_conversations;
DELETE FROM agent_messages;
DELETE FROM agent_deliverables;
DELETE FROM user_agents;
DELETE FROM user_maturity_scores;
DELETE FROM user_profiles;
DELETE FROM user_master_context;
DELETE FROM task_generation_history;
DELETE FROM agent_usage_metrics;
DELETE FROM step_validations;
DELETE FROM task_steps;

-- Crear función mejorada para creación segura de usuarios
CREATE OR REPLACE FUNCTION create_secure_admin_user(
    user_email text,
    invited_by_admin_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    inviter_exists boolean;
BEGIN
    -- Validar que el invitador es un admin activo
    SELECT EXISTS(
        SELECT 1 FROM admin_users 
        WHERE email = invited_by_admin_email AND is_active = true
    ) INTO inviter_exists;
    
    IF NOT inviter_exists THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Invitador no autorizado'
        );
    END IF;
    
    -- Validar formato de email
    IF NOT validate_email_format(user_email) THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Formato de email inválido'
        );
    END IF;
    
    -- Crear nuevo admin
    INSERT INTO admin_users (email, is_active, created_by)
    VALUES (
        user_email, 
        true, 
        (SELECT id FROM admin_users WHERE email = invited_by_admin_email LIMIT 1)
    );
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Usuario admin creado exitosamente'
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'El usuario ya existe'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Error interno del sistema'
        );
END;
$$;