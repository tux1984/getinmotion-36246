// OpenAI API Utility Functions with Robust Error Handling
// Phase 1: Repair OpenAI API Integration

interface OpenAIRequest {
  model: string;
  messages: any[];
  max_completion_tokens?: number;
  temperature?: number;
  response_format?: { type: string };
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export class OpenAIError extends Error {
  constructor(message: string, public statusCode?: number, public details?: any) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export async function callOpenAIWithRetry(
  apiKey: string,
  request: OpenAIRequest,
  options: RetryOptions = {}
): Promise<any> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`OpenAI API attempt ${attempt + 1}/${maxRetries + 1}`);
      
      // Validate API key
      if (!apiKey || apiKey.trim() === '') {
        throw new OpenAIError('OpenAI API key is missing or empty');
      }

      // Validate request
      validateOpenAIRequest(request);

      // Make the API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        let errorDetails;
        
        try {
          errorDetails = JSON.parse(errorText);
        } catch {
          errorDetails = { message: errorText };
        }

        console.error(`OpenAI API HTTP error: ${response.status}`, errorDetails);

        // Rate limit - wait and retry
        if (response.status === 429) {
          if (attempt < maxRetries) {
            const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
            console.log(`Rate limited, waiting ${delay}ms before retry`);
            await sleep(delay);
            continue;
          }
        }

        // Server errors - retry
        if (response.status >= 500 && attempt < maxRetries) {
          const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
          console.log(`Server error, waiting ${delay}ms before retry`);
          await sleep(delay);
          continue;
        }

        throw new OpenAIError(
          `OpenAI API error: ${response.status} ${response.statusText}`,
          response.status,
          errorDetails
        );
      }

      // Parse and validate response
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new OpenAIError('OpenAI API returned empty response');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', responseText);
        throw new OpenAIError(
          'OpenAI API returned invalid JSON',
          200,
          { response: responseText, parseError: parseError.message }
        );
      }

      // Validate response structure
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new OpenAIError(
          'OpenAI API returned invalid response structure',
          200,
          { response: data }
        );
      }

      const choice = data.choices[0];
      if (!choice.message || !choice.message.content) {
        throw new OpenAIError(
          'OpenAI API returned choice without message content',
          200,
          { choice }
        );
      }

      // Additional validation for empty content
      const content = choice.message.content.trim();
      if (content === '') {
        throw new OpenAIError('OpenAI API returned empty message content');
      }

      console.log('OpenAI API call successful');
      return data;

    } catch (error) {
      lastError = error;
      console.error(`OpenAI API attempt ${attempt + 1} failed:`, error);

      // Don't retry on validation errors or certain API errors
      if (error instanceof OpenAIError && 
          (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403)) {
        break;
      }

      // If this is the last attempt, break
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retry
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
      console.log(`Waiting ${delay}ms before retry`);
      await sleep(delay);
    }
  }

  throw lastError || new OpenAIError('All OpenAI API attempts failed');
}

export function validateOpenAIRequest(request: OpenAIRequest): void {
  if (!request.model) {
    throw new OpenAIError('Model is required');
  }

  if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
    throw new OpenAIError('Messages array is required and cannot be empty');
  }

  // Validate messages format
  for (const message of request.messages) {
    if (!message.role || !message.content) {
      throw new OpenAIError('Each message must have role and content');
    }
    
    if (typeof message.content !== 'string') {
      throw new OpenAIError('Message content must be a string');
    }

    if (message.content.length === 0) {
      throw new OpenAIError('Message content cannot be empty');
    }

    if (message.content.length > 50000) {
      throw new OpenAIError('Message content is too long');
    }
  }

  // Validate token limits
  if (request.max_completion_tokens && request.max_completion_tokens > 4000) {
    throw new OpenAIError('max_completion_tokens exceeds reasonable limit');
  }
}

export async function parseJSONResponse(content: string): Promise<any> {
  if (!content || content.trim() === '') {
    throw new OpenAIError('Cannot parse empty content as JSON');
  }

  // Clean up common JSON formatting issues
  let cleanContent = content.trim();
  
  // Remove code block markers
  cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Remove leading/trailing whitespace
  cleanContent = cleanContent.trim();
  
  if (cleanContent === '') {
    throw new OpenAIError('Content is empty after cleaning');
  }

  try {
    const parsed = JSON.parse(cleanContent);
    
    // Validate that we got a valid object/array
    if (parsed === null || parsed === undefined) {
      throw new OpenAIError('Parsed JSON is null or undefined');
    }
    
    return parsed;
  } catch (error) {
    console.error('JSON parsing failed:', {
      originalContent: content,
      cleanedContent: cleanContent,
      error: error.message
    });
    
    throw new OpenAIError(
      `Failed to parse JSON response: ${error.message}`,
      200,
      { content: cleanContent }
    );
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createFallbackResponse(errorMessage: string, fallbackData: any) {
  console.log(`Using fallback response due to: ${errorMessage}`);
  return {
    success: false,
    error: errorMessage,
    data: fallbackData,
    isFallback: true
  };
}

// Specific model configurations
export const MODEL_CONFIGS = {
  'gpt-5-2025-08-07': {
    useMaxCompletionTokens: true,
    supportsTemperature: false,
    maxTokens: 4000
  },
  'gpt-5-mini-2025-08-07': {
    useMaxCompletionTokens: true,
    supportsTemperature: false,
    maxTokens: 4000
  },
  'gpt-4o-mini': {
    useMaxCompletionTokens: false,
    supportsTemperature: true,
    maxTokens: 4000
  },
  'gpt-4o': {
    useMaxCompletionTokens: false,
    supportsTemperature: true,
    maxTokens: 4000
  }
};

export function prepareRequestForModel(baseRequest: any, model: string): OpenAIRequest {
  const config = MODEL_CONFIGS[model] || MODEL_CONFIGS['gpt-5-2025-08-07'];
  
  const request: OpenAIRequest = {
    model,
    messages: baseRequest.messages
  };

  // Handle token limits
  if (config.useMaxCompletionTokens) {
    request.max_completion_tokens = baseRequest.max_tokens || baseRequest.max_completion_tokens || 1000;
  } else {
    (request as any).max_tokens = baseRequest.max_tokens || baseRequest.max_completion_tokens || 1000;
  }

  // Handle temperature
  if (config.supportsTemperature && baseRequest.temperature !== undefined) {
    request.temperature = baseRequest.temperature;
  }

  // Handle response format
  if (baseRequest.response_format) {
    request.response_format = baseRequest.response_format;
  }

  return request;
}