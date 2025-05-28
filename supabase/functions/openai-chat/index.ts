
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== OpenAI Chat Function Started ===');
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
    console.log('OpenAI API key check:', OPENAI_API_KEY ? 'Found' : 'NOT FOUND');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable not found');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please contact support.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body received:', {
        hasSystemPrompt: !!requestBody.systemPrompt,
        messagesCount: requestBody.messages?.length || 0,
        systemPromptLength: requestBody.systemPrompt?.length || 0
      });
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
      if (msg && msg.content && msg.content.trim()) {
        completeMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content.trim()
        });
      }
    }

    console.log('Complete messages for OpenAI:', {
      totalMessages: completeMessages.length,
      hasSystemMessage: completeMessages[0]?.role === 'system',
      lastUserMessage: completeMessages[completeMessages.length - 1]?.content?.substring(0, 50) + '...'
    });

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
      max_tokens: 1500,
    };

    console.log('Calling OpenAI API with model:', openAIBody.model);

    // Call OpenAI API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openAIBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('OpenAI response status:', openAIResponse.status);
      console.log('OpenAI response headers:', Object.fromEntries(openAIResponse.headers.entries()));

      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text();
        console.error('OpenAI API error response:', errorText);
        
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
          status: openAIResponse.status >= 500 ? 500 : openAIResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await openAIResponse.json();
      console.log('OpenAI response received successfully');
      console.log('Response data structure:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length || 0,
        firstChoiceHasMessage: !!data.choices?.[0]?.message,
        firstChoiceRole: data.choices?.[0]?.message?.role,
        contentLength: data.choices?.[0]?.message?.content?.length || 0
      });

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
      console.log('Returning successful response to client');
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('OpenAI API request timed out');
        return new Response(JSON.stringify({ 
          error: 'Request timed out',
          details: 'OpenAI API request took too long'
        }), {
          status: 408,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.error('Fetch error calling OpenAI:', fetchError);
      return new Response(JSON.stringify({ 
        error: 'Network error calling OpenAI',
        details: fetchError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message,
      type: error.name
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
