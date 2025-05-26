
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== OpenAI Chat Function Called ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
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
    // Get OpenAI API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    console.log('OpenAI API key check:', OPENAI_API_KEY ? `Found (${OPENAI_API_KEY.substring(0, 10)}...)` : 'NOT FOUND');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable not found');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured in edge function secrets' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body received:', JSON.stringify(requestBody, null, 2));
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { messages, systemPrompt } = requestBody;

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build complete messages array
    const completeMessages = [];
    
    // Add system prompt if provided
    if (systemPrompt && systemPrompt.trim()) {
      completeMessages.push({
        role: 'system',
        content: systemPrompt.trim()
      });
    }
    
    // Add user messages
    for (const msg of messages) {
      if (msg && (msg.content || msg.message)) {
        completeMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: (msg.content || msg.message || '').trim()
        });
      }
    }

    console.log('Complete messages for OpenAI:', JSON.stringify(completeMessages, null, 2));

    if (completeMessages.length === 0) {
      console.error('No valid messages to send');
      return new Response(JSON.stringify({ error: 'No valid messages provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare OpenAI request
    const openAIBody = {
      model: 'gpt-4o-mini',
      messages: completeMessages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    console.log('Calling OpenAI API...');
    console.log('OpenAI request body:', JSON.stringify(openAIBody, null, 2));

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openAIBody),
    });

    console.log('OpenAI response status:', openAIResponse.status);
    console.log('OpenAI response headers:', Object.fromEntries(openAIResponse.headers.entries()));

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      
      let errorMessage = 'Error calling OpenAI API';
      if (openAIResponse.status === 401) {
        errorMessage = 'Invalid OpenAI API key';
      } else if (openAIResponse.status === 429) {
        errorMessage = 'OpenAI rate limit exceeded';
      } else if (openAIResponse.status === 400) {
        errorMessage = 'Invalid request to OpenAI';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage, 
        details: errorText,
        status: openAIResponse.status 
      }), {
        status: openAIResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response data:', JSON.stringify(data, null, 2));

    // Validate OpenAI response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      return new Response(JSON.stringify({ 
        error: 'Invalid response from OpenAI',
        details: 'Missing choices or message in response'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return successful response
    console.log('Returning successful response');
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error in edge function', 
      details: error.message,
      type: error.name
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
