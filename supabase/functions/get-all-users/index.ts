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
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verify the user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'No autorizado' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: isAdminData, error: adminError } = await supabaseClient.rpc('is_admin')
    if (adminError || !isAdminData) {
      console.error('Admin check error:', adminError)
      return new Response(
        JSON.stringify({ error: 'Acceso denegado - se requieren permisos de administrador' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Fetching all users with admin privileges')

    // Get all users from auth.users with their profiles and admin status
    const { data: authUsers, error: authUsersError } = await supabaseClient.auth.admin.listUsers()
    
    if (authUsersError) {
      console.error('Error fetching auth users:', authUsersError)
      return new Response(
        JSON.stringify({ error: 'Error al obtener usuarios de autenticación' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get admin users
    const { data: adminUsers, error: adminUsersError } = await supabaseClient
      .from('admin_users')
      .select('email, is_active, created_at')

    if (adminUsersError) {
      console.error('Error fetching admin users:', adminUsersError)
    }

    // Get user profiles
    const { data: userProfiles, error: profilesError } = await supabaseClient
      .from('user_profiles')
      .select('user_id, full_name, user_type, created_at')

    if (profilesError) {
      console.error('Error fetching user profiles:', profilesError)
    }

    // Get shop owners
    const { data: shopOwners, error: shopsError } = await supabaseClient
      .from('artisan_shops')
      .select('user_id, shop_name, created_at')

    if (shopsError) {
      console.error('Error fetching shop owners:', shopsError)
    }

    // Combine all data
    const allUsers = authUsers.users.map(authUser => {
      const adminUser = adminUsers?.find(admin => admin.email === authUser.email)
      const profile = userProfiles?.find(p => p.user_id === authUser.id)
      const shop = shopOwners?.find(s => s.user_id === authUser.id)
      
      let userType = 'unclassified'
      let isActive = true
      let fullName = authUser.user_metadata?.full_name || authUser.email

      if (adminUser) {
        userType = 'admin'
        isActive = adminUser.is_active
      } else if (shop) {
        userType = 'shop_owner'
      } else if (profile?.user_type) {
        userType = profile.user_type
      }

      if (profile?.full_name) {
        fullName = profile.full_name
      }

      return {
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        user_type: userType,
        is_active: isActive,
        created_at: authUser.created_at,
        last_sign_in: authUser.last_sign_in_at,
        shop_name: shop?.shop_name || null,
        confirmed_at: authUser.confirmed_at,
        email_confirmed_at: authUser.email_confirmed_at
      }
    })

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