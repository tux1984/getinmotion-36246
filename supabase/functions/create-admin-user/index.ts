
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
    console.log('=== CREATE ADMIN USER REQUEST START ===');
    console.log('Processing request:', req.method, req.url);
    console.log('All headers:', Object.fromEntries(req.headers.entries()));

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    console.log('Auth header preview:', authHeader ? `${authHeader.substring(0, 20)}...` : 'none');
    
    if (!authHeader) {
      console.error('CRITICAL: Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401,
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

    // Verify the user is authenticated with comprehensive logging
    console.log('🔍 Starting user verification...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    console.log('User verification result:', { 
      userId: user?.id, 
      email: user?.email, 
      hasError: !!userError,
      errorMessage: userError?.message,
      userAud: user?.aud,
      userRole: user?.role
    });
    
    if (userError || !user) {
      console.error('CRITICAL: Authentication verification failed');
      console.error('User error details:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized - invalid session',
          details: userError?.message || 'No user found'
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ User authenticated successfully:', user.email);

    // Step 2: Admin Authorization Check (BYPASS RPC - Direct Table Validation)
    console.log('🔑 Checking admin authorization via direct table lookup...');
    
    try {
      // Extract email from the authenticated user instead of relying on auth.uid()
      const userEmail = user?.email;
      
      if (!userEmail) {
        console.error('❌ No email found in authenticated user');
        return new Response(
          JSON.stringify({ 
            error: 'Invalid authentication',
            details: 'User email not found in token'
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`🔍 Checking admin status for email: ${userEmail}`);

      // Direct table query to admin_users instead of using is_admin RPC
      const { data: adminCheck, error: adminError } = await supabaseAdmin
        .from('admin_users')
        .select('email, is_active')
        .eq('email', userEmail)
        .eq('is_active', true)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('❌ Admin table query failed:', adminError);
        return new Response(
          JSON.stringify({ 
            error: `Admin verification failed: ${adminError.message}`,
            details: 'Could not query admin users table'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!adminCheck) {
        console.log('🚫 User is not an active admin');
        return new Response(
          JSON.stringify({ 
            error: 'Insufficient privileges',
            details: 'Active admin access required'
          }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('✅ Admin authorization confirmed via direct table lookup');
    } catch (authCheckError) {
      console.error('💥 Exception during admin check:', authCheckError);
      return new Response(
        JSON.stringify({ 
          error: 'Authorization system error',
          details: authCheckError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body with improved error handling
    console.log('📥 Starting request body parsing...');
    const contentType = req.headers.get('Content-Type');
    const contentLength = req.headers.get('Content-Length');
    console.log('Content details:', {
      method: req.method,
      contentType,
      contentLength,
      hasBody: !!req.body
    });

    let email, password;
    let parsedBody;
    
    try {
      console.log('📖 Reading request body...');
      
      // Check if body exists and has content
      if (!req.body) {
        console.error('CRITICAL: Request body is null/undefined');
        return new Response(
          JSON.stringify({ 
            error: 'Request body is required',
            details: 'No request body provided' 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Check content length
      if (contentLength === '0') {
        console.error('CRITICAL: Request body is empty (Content-Length: 0)');
        return new Response(
          JSON.stringify({ 
            error: 'Request body cannot be empty',
            details: 'Content-Length is 0' 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Parse JSON with error handling
      parsedBody = await req.json();
      console.log('✅ Successfully parsed JSON body');
      console.log('Parsed body structure:', Object.keys(parsedBody || {}));
      console.log('Parsed body content:', { 
        hasEmail: !!parsedBody?.email, 
        hasPassword: !!parsedBody?.password,
        emailType: typeof parsedBody?.email,
        passwordType: typeof parsedBody?.password
      });

    } catch (parseError) {
      console.error('CRITICAL: JSON parsing failed:', parseError);
      console.error('Parse error details:', {
        name: parseError.name,
        message: parseError.message,
        stack: parseError.stack
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate parsed body
    if (!parsedBody) {
      console.error('CRITICAL: Request body is empty after parsing');
      return new Response(
        JSON.stringify({ error: 'Request body cannot be empty' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    email = parsedBody.email;
    password = parsedBody.password;

    // Validate required fields with detailed logging
    console.log('✅ Validating required fields...');
    if (!email || !password) {
      console.error('CRITICAL: Missing required fields');
      console.error('Field validation:', { 
        email: email || 'MISSING', 
        hasPassword: !!password,
        emailLength: email?.length || 0,
        passwordLength: password?.length || 0
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Email and password are required',
          missing: {
            email: !email,
            password: !password
          }
        }),
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
