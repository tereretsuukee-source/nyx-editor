/**
 * Input Validation & Sanitization
 * 
 * SECURITY: Replaces regex blocklists with structural validation.
 * No user input ever reaches eval() or new Function().
 */

export const INPUT_LIMITS = {
  MAX_EXPRESSION_LENGTH: 10000,
  MAX_PARENTHESIS_DEPTH: 100,
  MAX_FILE_NAME_LENGTH: 255,
  MAX_COMMAND_LENGTH: 500,
} as const;

export class InputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InputValidationError';
  }
}

export function validateCodeInput(input: string): void {
  if (typeof input !== 'string') {
    throw new InputValidationError('Input must be a string');
  }
  if (input.length > INPUT_LIMITS.MAX_EXPRESSION_LENGTH) {
    throw new InputValidationError(
      `Input exceeds maximum length of ${INPUT_LIMITS.MAX_EXPRESSION_LENGTH} characters`
    );
  }
  if (input.includes('\0')) {
    throw new InputValidationError('Input contains invalid null characters');
  }
}

export function validateParenthesisDepth(input: string): void {
  let depth = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '(' || char === '[' || char === '{') {
      depth++;
      if (depth > INPUT_LIMITS.MAX_PARENTHESIS_DEPTH) {
        throw new InputValidationError(
          `Nesting depth exceeds maximum of ${INPUT_LIMITS.MAX_PARENTHESIS_DEPTH}`
        );
      }
    } else if (char === ')' || char === ']' || char === '}') {
      depth--;
      if (depth < 0) {
        throw new InputValidationError('Mismatched brackets detected');
      }
    }
  }
  if (depth !== 0) {
    throw new InputValidationError('Unclosed brackets detected');
  }
}

export function validateCommandInput(input: string): void {
  if (typeof input !== 'string') {
    throw new InputValidationError('Command must be a string');
  }
  if (input.length > INPUT_LIMITS.MAX_COMMAND_LENGTH) {
    throw new InputValidationError('Command too long');
  }
  const validCommandPattern = /^[a-zA-Z0-9\s\-:.]+$/;
  if (!validCommandPattern.test(input)) {
    throw new InputValidationError('Command contains invalid characters');
  }
}

export function sanitizeFileName(name: string): string {
  if (typeof name !== 'string') return 'unnamed';
  return name
    .replace(/[\\/]/g, '_')
    .replace(/\.\./g, '_')
    .slice(0, INPUT_LIMITS.MAX_FILE_NAME_LENGTH);
}
