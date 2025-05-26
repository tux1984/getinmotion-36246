
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== OpenAI Chat Function Called ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify method
  if (req.method !== 'POST') {
    console.error('Invalid method:', req.method);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get request body
    const requestBody = await req.json();
    console.log('Request body received:', JSON.stringify(requestBody, null, 2));
    
    const { messages, systemPrompt } = requestBody;

    // Validate API key first
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('OpenAI API key found, length:', OPENAI_API_KEY.length);

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return new Response(JSON.stringify({ error: 'Invalid messages format - must be an array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare the complete message array
    const completeMessages = [];
    
    // Add system prompt if provided
    if (systemPrompt && systemPrompt.trim()) {
      completeMessages.push({
        role: 'system',
        content: systemPrompt.trim()
      });
      console.log('Added system prompt, length:', systemPrompt.length);
    }
    
    // Add user messages with proper formatting
    for (const msg of messages) {
      if (msg && (msg.content || msg.message)) {
        completeMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: (msg.content || msg.message || '').trim()
        });
      }
    }

    console.log('Complete messages prepared:', JSON.stringify(completeMessages, null, 2));

    if (completeMessages.length === 0) {
      console.error('No valid messages to send to OpenAI');
      return new Response(JSON.stringify({ error: 'No valid messages provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare OpenAI request
    const openAIRequestBody = {
      model: 'gpt-4o-mini',
      messages: completeMessages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    console.log('Calling OpenAI API with body:', JSON.stringify(openAIRequestBody, null, 2));

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openAIRequestBody),
    });

    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      
      let errorMessage = 'Error comunicándose con el servicio de IA';
      if (response.status === 401) {
        errorMessage = 'Clave API de OpenAI inválida';
        console.error('Invalid OpenAI API key - check your configuration');
      } else if (response.status === 429) {
        errorMessage = 'Límite de velocidad excedido';
      } else if (response.status === 400) {
        errorMessage = 'Solicitud inválida a OpenAI';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage, 
        details: errorText,
        status: response.status 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('OpenAI success response:', JSON.stringify(data, null, 2));

    // Verify response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      return new Response(JSON.stringify({ error: 'Respuesta inválida de OpenAI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return successful response
    console.log('Returning successful response to client');
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== ERROR in openai-chat function ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor', 
      details: error.message || 'Error desconocido',
      type: error.name || 'UnknownError'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
