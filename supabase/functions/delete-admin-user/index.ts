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

    // Create admin client for user deletion
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

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Deleting admin user:', userId)

    // Get the current user from admin_users table
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

    // Prevent self-deletion
    if (adminUser.email === user.email) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete your own admin account' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if this is the last active admin
    const { data: activeAdmins, error: countError } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('is_active', true)
      .neq('id', userId);

    if (countError) {
      console.error('Error counting active admins:', countError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify admin count' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!activeAdmins || activeAdmins.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete the last active admin user' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log admin action for audit trail
    console.log('AUDIT: Admin user deletion initiated', JSON.stringify({
      timestamp: new Date().toISOString(),
      initiatedBy: user.email,
      targetUserId: userId,
      targetEmail: adminUser.email,
      action: 'delete_admin_user',
      ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    }));

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

    // Delete from admin_users table first
    const { error: adminDeleteError } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', userId);

    if (adminDeleteError) {
      console.error('Error deleting from admin_users:', adminDeleteError);
      return new Response(
        JSON.stringify({ error: adminDeleteError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Admin user deleted from admin_users table');

    // Delete from auth system if auth user exists
    if (authUser) {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(authUser.id);

      if (authDeleteError) {
        console.error('Error deleting auth user:', authDeleteError);
        // Note: We don't return error here because admin_users deletion was successful
        // This prevents orphaned records
        console.warn('Auth user deletion failed, but admin_users record was removed');
      } else {
        console.log('Auth user deleted successfully');
      }
    }

    // Log successful admin user deletion
    console.log('AUDIT: Admin user deletion completed successfully', JSON.stringify({
      timestamp: new Date().toISOString(),
      initiatedBy: user.email,
      targetUserId: userId,
      targetEmail: adminUser.email,
      action: 'delete_admin_user_success',
      ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user deleted successfully',
        email: adminUser.email
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