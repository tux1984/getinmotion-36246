import { logger } from './logger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

export class InputValidator {
  // Email validation with additional security checks
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    } else if (email.length > 254) {
      errors.push('Email is too long');
    } else if (email.includes('..')) {
      errors.push('Email contains consecutive dots');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /script/i,
      /<.*>/,
      /javascript:/i,
      /data:/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(email)) {
        errors.push('Email contains suspicious content');
        logger.security.suspiciousActivity('Suspicious email pattern detected', {
          email,
          pattern: pattern.toString()
        });
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: email.trim().toLowerCase()
    };
  }

  // Password validation with security requirements
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (password.length > 128) {
        errors.push('Password is too long');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }
      
      // Check for common weak passwords
      const commonPasswords = [
        'password', '123456', 'qwerty', 'admin', 'letmein',
        'welcome', 'monkey', '1234567890'
      ];
      
      if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // General text input sanitization
  static sanitizeText(input: string, maxLength: number = 1000): ValidationResult {
    const errors: string[] = [];
    
    if (!input) {
      return {
        isValid: true,
        errors: [],
        sanitizedValue: ''
      };
    }

    // Remove potentially dangerous characters
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/data:text\/html/gi, '') // Remove data URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();

    if (sanitized.length > maxLength) {
      errors.push(`Text is too long. Maximum ${maxLength} characters allowed`);
      sanitized = sanitized.substring(0, maxLength);
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /data:text\/html/i,
      /on\w+\s*=/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(input)) {
        logger.security.suspiciousActivity('Suspicious input pattern detected', {
          input: input.substring(0, 100), // Log first 100 chars only
          pattern: pattern.toString()
        });
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitized
    };
  }

  // URL validation
  static validateUrl(url: string): ValidationResult {
    const errors: string[] = [];
    
    if (!url) {
      return {
        isValid: true,
        errors: [],
        sanitizedValue: ''
      };
    }

    try {
      const urlObj = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('Invalid URL protocol. Only HTTP and HTTPS are allowed');
      }
      
      // Check for suspicious patterns
      if (urlObj.href.includes('javascript:') || urlObj.href.includes('data:')) {
        errors.push('Suspicious URL detected');
        logger.security.suspiciousActivity('Suspicious URL pattern detected', {
          url: url.substring(0, 100)
        });
      }
      
    } catch (error) {
      errors.push('Invalid URL format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: url.trim()
    };
  }
}