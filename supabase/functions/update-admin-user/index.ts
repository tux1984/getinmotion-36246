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
    
    if (adminError) {
      console.error('Admin check error:', adminError);
      return new Response(
        JSON.stringify({ error: 'Authorization check failed' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Admin access required.' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create admin client for user updates
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

    const { userId, email, password } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Updating admin user:', userId)

    // Log admin action for audit trail
    console.log('AUDIT: Admin user update initiated', JSON.stringify({
      timestamp: new Date().toISOString(),
      initiatedBy: user.email,
      targetUserId: userId,
      targetEmail: email,
      action: 'update_admin_user',
      ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    }));

    // Get the current user from admin_users table to get auth user id
    const { data: adminUser, error: findError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (findError || !adminUser) {
      console.error('Error finding admin user:', findError);
      return new Response(
        JSON.stringify({ error: 'Admin user not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Find the auth user by email
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing auth users:', authError);
      return new Response(
        JSON.stringify({ error: 'Failed to find user in auth system' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const authUser = authUsers.users.find(u => u.email === adminUser.email);
    
    if (!authUser) {
      console.error('Auth user not found for email:', adminUser.email);
      return new Response(
        JSON.stringify({ error: 'User not found in auth system' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare update data
    const updateData: any = {};
    
    if (email && email !== adminUser.email) {
      updateData.email = email;
    }
    
    if (password) {
      updateData.password = password;
    }

    // Update user in auth system if there are auth-related changes
    if (Object.keys(updateData).length > 0) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        updateData
      );

      if (authUpdateError) {
        console.error('Error updating auth user:', authUpdateError);
        return new Response(
          JSON.stringify({ error: authUpdateError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Auth user updated successfully');
    }

    // Update admin_users table if email changed
    if (email && email !== adminUser.email) {
      const { error: adminUpdateError } = await supabaseAdmin
        .from('admin_users')
        .update({
          email: email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (adminUpdateError) {
        console.error('Error updating admin_users:', adminUpdateError);
        return new Response(
          JSON.stringify({ error: adminUpdateError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Admin user updated in admin_users table');
    }

    // Log successful admin user update
    console.log('AUDIT: Admin user update completed successfully', JSON.stringify({
      timestamp: new Date().toISOString(),
      initiatedBy: user.email,
      targetUserId: userId,
      targetEmail: email,
      action: 'update_admin_user_success',
      changes: Object.keys(updateData),
      ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user updated successfully',
        email: email || adminUser.email
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