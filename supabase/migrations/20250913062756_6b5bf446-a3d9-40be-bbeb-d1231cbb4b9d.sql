-- PASO 2: LIMPIEZA TOTAL DE DATOS
-- Actualizar brand_name de "Chaquetas de cuero a mano" a "TriMedias" en user_profiles
UPDATE user_profiles 
SET brand_name = 'TriMedias',
    business_description = 'Empresa especializada en medias de alta calidad y comfort',
    updated_at = now()
WHERE user_id = 'a26938e6-000a-4f4f-bbdd-0dd867ac25b5';

-- Actualizar business_profile en user_master_context para mantener consistencia
UPDATE user_master_context 
SET business_profile = jsonb_set(
      COALESCE(business_profile, '{}'),
      '{brand_name}', 
      '"TriMedias"'
    ),
    business_profile = jsonb_set(
      business_profile,
      '{business_description}', 
      '"Empresa especializada en medias de alta calidad y comfort"'
    ),
    last_updated = now(),
    context_version = context_version + 1
WHERE user_id = 'a26938e6-000a-4f4f-bbdd-0dd867ac25b5';

-- Eliminar tareas obsoletas del usuario que podrían estar causando conflictos
UPDATE agent_tasks 
SET is_archived = true, 
    updated_at = now(),
    notes = COALESCE(notes, '') || ' [ARCHIVED: System cleanup - old leather jacket tasks]'
WHERE user_id = 'a26938e6-000a-4f4f-bbdd-0dd867ac25b5' 
AND is_archived = false 
AND (title ILIKE '%cuero%' OR title ILIKE '%chaqueta%' OR description ILIKE '%cuero%' OR description ILIKE '%chaqueta%');