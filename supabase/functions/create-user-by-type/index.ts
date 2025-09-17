import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with the user's token for admin verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated and is an admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabaseClient.rpc('is_admin');
    
    if (adminError || !isAdmin) {
      console.error('Admin check error:', adminError);
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Admin access required.' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create admin client for user creation
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, fullName, userType, additionalData } = await req.json()

    if (!email || !password || !userType) {
      console.error('Missing required fields:', { hasEmail: !!email, hasPassword: !!password, hasUserType: !!userType })
      return new Response(
        JSON.stringify({ error: 'Email, password, and user type are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email)
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate password
    if (password.length < 8 || 
        !/[A-Z]/.test(password) || 
        !/[a-z]/.test(password) || 
        !/\d/.test(password)) {
      console.error('Password does not meet requirements')
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters and include uppercase, lowercase, and number' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate user type
    if (!['admin', 'shop_owner', 'regular'].includes(userType)) {
      console.error('Invalid user type:', userType)
      return new Response(
        JSON.stringify({ error: 'Invalid user type' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Creating user:', email, 'of type:', userType)

    // Create new user in auth
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || 'User',
        user_type: userType
      }
    })

    if (createUserError) {
      console.error('Error creating user:', createUserError)
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('User created successfully:', userData.user?.email)

    const userId = userData.user?.id;
    if (!userId) {
      throw new Error('User ID not found after creation');
    }

    // Create user profile with user type
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: userId,
        full_name: fullName || 'User',
        user_type: userType
      }, {
        onConflict: 'user_id'
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      // Continue anyway, profile might be created by trigger
    }

    // Handle specific user type setup
    if (userType === 'admin') {
      // Add to admin_users table
      const { error: insertAdminError } = await supabaseAdmin
        .from('admin_users')
        .upsert({
          email: email,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })

      if (insertAdminError) {
        console.error('Error adding to admin_users:', insertAdminError)
        return new Response(
          JSON.stringify({ error: insertAdminError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      console.log('Admin user added to admin_users table')
    } else if (userType === 'shop_owner') {
      // Prepare shop data from additional data
      const shopData = additionalData?.shopData || {};
      
      const { error: insertShopError } = await supabaseAdmin
        .from('artisan_shops')
        .insert({
          user_id: userId,
          shop_name: shopData.shopName || `${fullName || 'User'}'s Shop`,
          shop_slug: (shopData.shopName || `${fullName || 'user'}s-shop`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: shopData.description || 'New artisan shop',
          craft_type: shopData.craftType || 'general',
          region: shopData.region || '',
          privacy_level: 'public',
          creation_status: 'incomplete',
          creation_step: 0,
          active: false,
          featured: false
        })

      if (insertShopError) {
        console.error('Error creating artisan shop:', insertShopError)
        return new Response(
          JSON.stringify({ error: insertShopError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      console.log('Artisan shop created successfully')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} user created successfully`,
        email: email,
        userType: userType,
        userId: userId
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})