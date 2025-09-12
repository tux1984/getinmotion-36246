
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests FIRST, before any processing
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request received');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log('Processing request:', req.method, req.url);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create admin client first for more reliable auth
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

    // Create client with user's token for verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    console.log('User verification:', { userId: user?.id, email: user?.email, error: userError });
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid session' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Alternative admin check using direct database query instead of RPC
    console.log('Checking admin status for:', user.email);
    const { data: adminCheck, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('is_active')
      .eq('email', user.email)
      .eq('is_active', true)
      .single();
    
    console.log('Admin check result:', { adminCheck, adminError });
    
    if (adminError || !adminCheck) {
      console.error('Admin check failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Admin access required.' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // We already have supabaseAdmin from above

    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Creating admin user:', email)

    // Log admin action for audit trail
    console.log('AUDIT: Admin user creation initiated', JSON.stringify({
      timestamp: new Date().toISOString(),
      initiatedBy: user.email,
      targetEmail: email,
      action: 'create_admin_user',
      ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    }));

    // Create new admin user
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User'
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

    // Add to admin_users table
    const { error: adminError } = await supabaseAdmin
      .from('admin_users')
      .upsert({
        email: email,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })

    if (adminError) {
      console.error('Error adding to admin_users:', adminError)
      return new Response(
        JSON.stringify({ error: adminError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Admin user added to admin_users table')

    // Log successful admin user creation
    console.log('AUDIT: Admin user creation completed successfully', JSON.stringify({
      timestamp: new Date().toISOString(),
      initiatedBy: user.email,
      targetEmail: email,
      action: 'create_admin_user_success',
      ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        email: email
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
