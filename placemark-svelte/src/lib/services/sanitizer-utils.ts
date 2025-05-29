export class InputSanitizer {
 
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') 
      .substring(0, 255); 
  }


  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = email.trim().toLowerCase();
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  static sanitizeNumber(input: any, min?: number, max?: number): number | null {
    const num = parseFloat(input);
    if (isNaN(num)) return null;
    
    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;
    
    return num;
  }

  static sanitizeCoordinate(value: any, type: 'lat' | 'lng'): number | null {
    const coord = this.sanitizeNumber(value);
    if (coord === null) return null;

    if (type === 'lat') {
      return coord >= -90 && coord <= 90 ? coord : null;
    } else {
      return coord >= -180 && coord <= 180 ? coord : null;
    }
  }

  static sanitizeForDatabase(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/['";\\]/g, '')
      .trim()
      .substring(0, 1000);
  }
}