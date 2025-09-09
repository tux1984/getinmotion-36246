import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.5"

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
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const { code } = await req.json();
    
    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Access code is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Query for the access code
    const { data: accessCode, error } = await supabaseClient
      .from('access_codes')
      .select('*')
      .eq('code', code.trim())
      .eq('is_active', true)
      .single()

    if (error || !accessCode) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Invalid access code' 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if code has expired
    if (accessCode.expires_at && new Date(accessCode.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Access code has expired' 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if code has reached max usage limit
    if (accessCode.max_uses && accessCode.current_uses >= accessCode.max_uses) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Access code usage limit reached' 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Code is valid - increment usage count if max_uses is set
    if (accessCode.max_uses !== null) {
      await supabaseClient
        .from('access_codes')
        .update({ 
          current_uses: accessCode.current_uses + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', accessCode.id)
    }

    return new Response(
      JSON.stringify({ 
        valid: true, 
        message: 'Valid access code',
        codeInfo: {
          description: accessCode.description
        }
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