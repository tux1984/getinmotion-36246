import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        auth: { persistSession: false },
        global: { headers: { Authorization: req.headers.get('Authorization')! } } 
      }
    )

    console.log('Fetching all users using SQL function')

    // Call the SQL function that combines all user data
    const { data: allUsers, error: usersError } = await supabaseClient.rpc('get_all_users_combined')
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      
      // Check if it's an authentication/authorization error
      if (usersError.message.includes('admin permissions required') || usersError.message.includes('Access denied')) {
        return new Response(
          JSON.stringify({ error: 'Acceso denegado - se requieren permisos de administrador' }), 
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: 'Error al obtener usuarios' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Retrieved ${allUsers.length} users total`)
    console.log('Users by type:', {
      admin: allUsers.filter(u => u.user_type === 'admin').length,
      shop_owner: allUsers.filter(u => u.user_type === 'shop_owner').length,
      regular: allUsers.filter(u => u.user_type === 'regular').length,
      unclassified: allUsers.filter(u => u.user_type === 'unclassified').length
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        users: allUsers,
        total: allUsers.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})