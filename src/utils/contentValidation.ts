// ============= FASE 3.1: VALIDACIÓN ROBUSTA DE CONTENIDO AI =============

import { logger } from './logger';
import { InputValidator } from './inputValidation';

export interface AIContentValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedContent?: any;
  confidence: number;
  metadata?: {
    originalLength: number;
    sanitizedLength: number;
    patternsDetected: string[];
  };
}

export interface TaskValidationResult extends AIContentValidationResult {
  validatedTask?: {
    title: string;
    description: string;
    steps: any[];
    metadata: any;
  };
}

export class AIContentValidator {
  private static readonly MIN_CONFIDENCE = 0.7;
  private static readonly MAX_TITLE_LENGTH = 200;
  private static readonly MAX_DESCRIPTION_LENGTH = 2000;
  private static readonly MAX_STEPS = 20;
  
  // Patrones sospechosos en contenido AI
  private static readonly SUSPICIOUS_PATTERNS = [
    /(?:I'm|I am|as an AI|AI language model)/gi,
    /(?:sorry|can't|cannot|unable to)/gi,
    /(?:\[PLACEHOLDER\]|\[TODO\]|\[INSERT\])/gi,
    /<script[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /\{\{.*?\}\}/g, // Template variables no resueltas
  ];

  // Validar respuesta JSON de OpenAI
  static validateOpenAIResponse(content: string): AIContentValidationResult {
    const errors: string[] = [];
    let confidence = 1.0;
    const patternsDetected: string[] = [];

    // Validar que no esté vacío
    if (!content || content.trim() === '') {
      return {
        isValid: false,
        errors: ['Contenido vacío recibido de AI'],
        confidence: 0,
        metadata: { originalLength: 0, sanitizedLength: 0, patternsDetected: [] }
      };
    }

    let sanitizedContent = content.trim();
    const originalLength = sanitizedContent.length;

    // Detectar y remover patrones sospechosos
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(sanitizedContent)) {
        const patternName = this.getPatternName(pattern);
        patternsDetected.push(patternName);
        sanitizedContent = sanitizedContent.replace(pattern, '');
        confidence -= 0.1;
        
        logger.security.suspiciousActivity('Suspicious AI content pattern detected', {
          pattern: patternName,
          content: content.substring(0, 100)
        });
      }
    }

    // Validar que después de sanitización siga teniendo contenido útil
    if (sanitizedContent.trim().length < originalLength * 0.5) {
      errors.push('Contenido AI parece estar corrupto o mayormente inválido');
      confidence = 0.3;
    }

    // Verificar si parece ser JSON válido
    try {
      JSON.parse(sanitizedContent);
    } catch (parseError) {
      // Si no es JSON válido, intentar limpiar y reparar
      sanitizedContent = this.repairJSONContent(sanitizedContent);
      confidence -= 0.2;
    }

    const isValid = errors.length === 0 && confidence >= this.MIN_CONFIDENCE;

    return {
      isValid,
      errors,
      sanitizedContent: isValid ? sanitizedContent : undefined,
      confidence,
      metadata: {
        originalLength,
        sanitizedLength: sanitizedContent.length,
        patternsDetected
      }
    };
  }

  // Validar estructura específica de tareas
  static validateTaskStructure(taskData: any): TaskValidationResult {
    const errors: string[] = [];
    let confidence = 1.0;

    if (!taskData || typeof taskData !== 'object') {
      return {
        isValid: false,
        errors: ['Estructura de tarea inválida'],
        confidence: 0,
        metadata: { originalLength: 0, sanitizedLength: 0, patternsDetected: [] }
      };
    }

    // Validar título
    const titleValidation = InputValidator.sanitizeText(taskData.title, this.MAX_TITLE_LENGTH);
    if (!titleValidation.isValid) {
      errors.push(...titleValidation.errors);
      confidence -= 0.3;
    }

    // Validar descripción
    const descValidation = InputValidator.sanitizeText(taskData.description, this.MAX_DESCRIPTION_LENGTH);
    if (!descValidation.isValid) {
      errors.push(...descValidation.errors);
      confidence -= 0.2;
    }

    // Validar pasos
    if (Array.isArray(taskData.steps)) {
      if (taskData.steps.length > this.MAX_STEPS) {
        errors.push(`Demasiados pasos: ${taskData.steps.length}. Máximo permitido: ${this.MAX_STEPS}`);
        confidence -= 0.4;
      }

      // Validar cada paso
      taskData.steps.forEach((step: any, index: number) => {
        if (!step.title || !step.description) {
          errors.push(`Paso ${index + 1} tiene estructura incompleta`);
          confidence -= 0.1;
        }
      });
    } else {
      errors.push('Estructura de pasos inválida o faltante');
      confidence -= 0.5;
    }

    const isValid = errors.length === 0 && confidence >= this.MIN_CONFIDENCE;

    const validatedTask = isValid ? {
      title: titleValidation.sanitizedValue || '',
      description: descValidation.sanitizedValue || '',
      steps: taskData.steps || [],
      metadata: {
        confidence,
        validatedAt: new Date().toISOString(),
        ...taskData.metadata
      }
    } : undefined;

    return {
      isValid,
      errors,
      validatedTask,
      confidence,
      metadata: {
        originalLength: JSON.stringify(taskData).length,
        sanitizedLength: validatedTask ? JSON.stringify(validatedTask).length : 0,
        patternsDetected: []
      }
    };
  }

  // Reparar contenido JSON corrupto
  private static repairJSONContent(content: string): string {
    let repaired = content;

    // Remover caracteres de control
    repaired = repaired.replace(/[\x00-\x1F\x7F]/g, '');

    // Arreglar comillas mal formateadas
    repaired = repaired.replace(/'/g, '"');
    
    // Remover comas colgantes
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
    
    // Intentar balancear llaves y corchetes
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;

    // Agregar llaves/corchetes faltantes al final
    if (openBraces > closeBraces) {
      repaired += '}'.repeat(openBraces - closeBraces);
    }
    if (openBrackets > closeBrackets) {
      repaired += ']'.repeat(openBrackets - closeBrackets);
    }

    return repaired;
  }

  // Obtener nombre descriptivo del patrón
  private static getPatternName(pattern: RegExp): string {
    const patternStr = pattern.toString();
    if (patternStr.includes('AI')) return 'AI_REFERENCE';
    if (patternStr.includes('sorry')) return 'APOLOGY_PATTERN';
    if (patternStr.includes('PLACEHOLDER')) return 'PLACEHOLDER_TEXT';
    if (patternStr.includes('script')) return 'SCRIPT_INJECTION';
    if (patternStr.includes('javascript')) return 'JAVASCRIPT_PROTOCOL';
    if (patternStr.includes('data:text')) return 'DATA_URL';
    if (patternStr.includes('{{')) return 'UNRESOLVED_TEMPLATE';
    return 'UNKNOWN_PATTERN';
  }

  // Validar y sanitizar input del usuario antes de enviar a AI
  static validateUserInput(input: string, maxLength: number = 1000): AIContentValidationResult {
    const inputValidation = InputValidator.sanitizeText(input, maxLength);
    
    return {
      isValid: inputValidation.isValid,
      errors: inputValidation.errors,
      sanitizedContent: inputValidation.sanitizedValue,
      confidence: inputValidation.isValid ? 1.0 : 0.5,
      metadata: {
        originalLength: input.length,
        sanitizedLength: inputValidation.sanitizedValue?.length || 0,
        patternsDetected: []
      }
    };
  }
}

// Fallbacks para contenido malformado
export class ContentFallbacks {
  static createFallbackTask(originalInput?: string): any {
    return {
      title: 'Tarea generada automáticamente',
      description: originalInput 
        ? `Basada en: ${originalInput.substring(0, 200)}...`
        : 'Tarea creada debido a error en generación AI',
      steps: [
        {
          title: 'Revisar y definir objetivos',
          description: 'Define claramente qué quieres lograr con esta tarea'
        },
        {
          title: 'Crear plan de acción',
          description: 'Desarrolla un plan paso a paso para completar la tarea'
        },
        {
          title: 'Ejecutar y revisar',
          description: 'Implementa el plan y revisa el progreso regularmente'
        }
      ],
      metadata: {
        isFallback: true,
        generatedAt: new Date().toISOString(),
        reason: 'AI_CONTENT_VALIDATION_FAILED'
      }
    };
  }

  static createErrorMessage(error: string, context?: string): string {
    const baseMessage = 'No se pudo procesar la solicitud correctamente.';
    
    if (context) {
      return `${baseMessage} Contexto: ${context}. Error: ${error}`;
    }
    
    return `${baseMessage} ${error}`;
  }
}