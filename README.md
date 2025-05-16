
# Instrucciones para configurar Supabase

## Tablas necesarias

### Tabla `waitlist`

Crea una tabla `waitlist` con la siguiente estructura:

```sql
create table public.waitlist (
  id uuid not null default uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  role text,
  city text,
  country text,
  sector text,
  description text,
  copilots_interest text[],
  problem_to_solve text,
  language text,
  
  constraint waitlist_pkey primary key (id),
  constraint waitlist_email_key unique (email)
);

-- Configurar acceso a la tabla
alter table public.waitlist enable row level security;

-- Política que permite la inserción para todos
create policy "Allow public access for insert" on public.waitlist
  for insert
  to anon
  with check (true);
```

## Funciones Edge

### Función `openai-chat`

1. Ve a Supabase Dashboard > Edge Functions
2. Crea una nueva función llamada `openai-chat`
3. Sube el contenido del archivo `supabase/functions/openai-chat/index.ts` creado
4. En los secretos de la función, agrega:
   - `OPENAI_API_KEY`: Tu clave de API de OpenAI

## Secretos

1. Ve a Project Settings > API > Edge Function Secrets
2. Añade la variable secreta `OPENAI_API_KEY` con tu clave de API de OpenAI
