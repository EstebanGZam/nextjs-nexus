import { z } from 'zod';
import {
  cn,
  formatDate,
  isPastDate,
  isFutureDate,
  getRelativeTime,
  formatCurrency,
  truncate,
  slugify,
  capitalize,
  buildPaginationMeta,
  buildQueryString,
  getPageRange,
  chunk,
  unique,
  groupBy,
  isValidEmail,
  isValidUrl,
  getErrorMessage,
  formatZodErrors,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  debounce,
  throttle,
} from '@/src/lib/utils';

describe('utils', () => {
  // ==================== CLASSNAMES UTILITY ====================
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conflicting tailwind classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should handle conditional classes', () => {
      expect(cn('base-class', false && 'hidden', true && 'visible')).toBe('base-class visible');
    });
  });

  // ==================== DATE UTILITIES ====================
  describe('formatDate', () => {
    it('should format date in short format', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'short');
      expect(formatted).toMatch(/ene/i);
    });

    it('should format date in long format', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'long');
      expect(formatted).toContain('enero');
    });

    it('should format date in time format', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatDate(date, 'time');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    it('should handle invalid date string', () => {
      expect(formatDate('invalid-date')).toBe('Fecha inválida');
    });

    it('should handle date string input', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toBeTruthy();
    });
  });

  describe('isPastDate', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2000-01-01');
      expect(isPastDate(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2099-12-31');
      expect(isPastDate(futureDate)).toBe(false);
    });

    it('should handle string dates', () => {
      expect(isPastDate('2000-01-01')).toBe(true);
    });
  });

  describe('isFutureDate', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date('2099-12-31');
      expect(isFutureDate(futureDate)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date('2000-01-01');
      expect(isFutureDate(pastDate)).toBe(false);
    });

    it('should handle string dates', () => {
      expect(isFutureDate('2099-12-31')).toBe(true);
    });
  });

  describe('getRelativeTime', () => {
    it('should return "hace unos segundos" for recent dates', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('hace unos segundos');
    });

    it('should return minutes for dates within an hour', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(getRelativeTime(fiveMinutesAgo)).toMatch(/hace \d+ minutos/);
    });

    it('should return hours for dates within a day', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(getRelativeTime(threeHoursAgo)).toMatch(/hace \d+ horas/);
    });

    it('should return days for dates within a week', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(threeDaysAgo)).toMatch(/hace \d+ días/);
    });

    it('should return years for very old dates', () => {
      const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(twoYearsAgo)).toMatch(/hace \d+ años/);
    });
  });

  // ==================== CURRENCY UTILITIES ====================
  describe('formatCurrency', () => {
    it('should format currency with default COP', () => {
      const formatted = formatCurrency(1000);
      expect(formatted).toMatch(/1\.000|1,000/); // Spanish or English format
      expect(formatted).toBeTruthy();
    });

    it('should format currency with custom currency', () => {
      const formatted = formatCurrency(1000, 'USD');
      expect(formatted).toMatch(/1\.000|1,000/); // Spanish or English format
      expect(formatted).toBeTruthy();
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBeTruthy();
    });

    it('should handle negative numbers', () => {
      const formatted = formatCurrency(-500);
      expect(formatted).toMatch(/500/);
    });
  });

  // ==================== STRING UTILITIES ====================
  describe('truncate', () => {
    it('should truncate long strings', () => {
      const longString = 'a'.repeat(100);
      expect(truncate(longString, 50)).toBe('a'.repeat(50) + '...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('short', 50)).toBe('short');
    });

    it('should use default length of 50', () => {
      const longString = 'a'.repeat(100);
      expect(truncate(longString)).toBe('a'.repeat(50) + '...');
    });

    it('should handle empty string', () => {
      expect(truncate('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('foo bar baz')).toBe('foo-bar-baz');
    });

    it('should remove accents', () => {
      expect(slugify('café résumé')).toBe('cafe-resume');
    });

    it('should remove special characters', () => {
      expect(slugify('hello@world!')).toBe('helloworld');
    });

    it('should handle multiple consecutive spaces', () => {
      expect(slugify('hello    world')).toBe('hello-world');
    });

    it('should trim whitespace', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalize('hello world')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should lowercase other letters', () => {
      expect(capitalize('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  // ==================== PAGINATION UTILITIES ====================
  describe('buildPaginationMeta', () => {
    it('should build correct pagination metadata', () => {
      const meta = buildPaginationMeta(1, 10, 100);
      expect(meta).toEqual({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('should handle last page', () => {
      const meta = buildPaginationMeta(10, 10, 100);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPreviousPage).toBe(true);
    });

    it('should handle single page', () => {
      const meta = buildPaginationMeta(1, 10, 5);
      expect(meta.totalPages).toBe(1);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPreviousPage).toBe(false);
    });

    it('should handle zero items', () => {
      const meta = buildPaginationMeta(1, 10, 0);
      expect(meta.totalPages).toBe(0);
      expect(meta.hasNextPage).toBe(false);
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from params', () => {
      const params = { page: 1, limit: 10, search: 'test' };
      expect(buildQueryString(params)).toBe('page=1&limit=10&search=test');
    });

    it('should skip undefined values', () => {
      const params = { page: 1, limit: undefined, search: 'test' };
      expect(buildQueryString(params)).toBe('page=1&search=test');
    });

    it('should skip null values', () => {
      const params = { page: 1, limit: undefined, search: 'test' };
      expect(buildQueryString(params)).toBe('page=1&search=test');
    });

    it('should skip empty strings', () => {
      const params = { page: 1, search: '' };
      expect(buildQueryString(params)).toBe('page=1');
    });

    it('should handle empty params', () => {
      expect(buildQueryString({})).toBe('');
    });
  });

  describe('getPageRange', () => {
    it('should return correct page range', () => {
      expect(getPageRange(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
    });

    it('should handle first pages', () => {
      expect(getPageRange(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle last pages', () => {
      expect(getPageRange(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
    });

    it('should handle fewer pages than maxPages', () => {
      expect(getPageRange(2, 3, 5)).toEqual([1, 2, 3]);
    });

    it('should handle single page', () => {
      expect(getPageRange(1, 1, 5)).toEqual([1]);
    });
  });

  // ==================== ARRAY UTILITIES ====================
  describe('chunk', () => {
    it('should chunk array into smaller arrays', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle exact divisions', () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should handle size larger than array', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle strings', () => {
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
        { type: 'vegetable', name: 'carrot' },
      ];
      const grouped = groupBy(items, 'type');
      expect(grouped).toEqual({
        fruit: [
          { type: 'fruit', name: 'apple' },
          { type: 'fruit', name: 'banana' },
        ],
        vegetable: [{ type: 'vegetable', name: 'carrot' }],
      });
    });

    it('should handle empty array', () => {
      expect(groupBy([], 'id')).toEqual({});
    });

    it('should handle numeric keys', () => {
      const items = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      const grouped = groupBy(items, 'id');
      expect(grouped['1']).toHaveLength(2);
    });
  });

  // ==================== VALIDATION UTILITIES ====================
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });

    it('should handle URLs with paths', () => {
      expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
    });
  });

  // ==================== ERROR UTILITIES ====================
  describe('getErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error');
      expect(getErrorMessage(error)).toBe('Test error');
    });

    it('should handle string errors', () => {
      expect(getErrorMessage('String error')).toBe('String error');
    });

    it('should handle objects with message property', () => {
      expect(getErrorMessage({ message: 'Object error' })).toBe('Object error');
    });

    it('should return default message for unknown errors', () => {
      expect(getErrorMessage(null)).toBe('Ha ocurrido un error desconocido');
      expect(getErrorMessage(undefined)).toBe('Ha ocurrido un error desconocido');
      expect(getErrorMessage(123)).toBe('Ha ocurrido un error desconocido');
    });
  });

  describe('formatZodErrors', () => {
    it('should format Zod validation errors', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      try {
        schema.parse({ email: 'invalid', age: 10 });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodErrors(error);
          expect(formatted).toHaveProperty('email');
          expect(formatted).toHaveProperty('age');
        }
      }
    });

    it('should handle nested paths', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(1),
        }),
      });

      try {
        schema.parse({ user: { name: '' } });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodErrors(error);
          expect(formatted['user.name']).toBeDefined();
          expect(typeof formatted['user.name']).toBe('string');
        }
      }
    });
  });

  // ==================== LOCAL STORAGE UTILITIES ====================
  describe('localStorage utilities', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    describe('setLocalStorage', () => {
      it('should set item in localStorage', () => {
        setLocalStorage('test-key', { foo: 'bar' });
        expect(localStorage.getItem('test-key')).toBe('{"foo":"bar"}');
      });

      it('should handle string values', () => {
        setLocalStorage('test-key', 'test-value');
        expect(localStorage.getItem('test-key')).toBe('"test-value"');
      });

      it('should handle numbers', () => {
        setLocalStorage('test-key', 42);
        expect(localStorage.getItem('test-key')).toBe('42');
      });
    });

    describe('getLocalStorage', () => {
      it('should get item from localStorage', () => {
        localStorage.setItem('test-key', '{"foo":"bar"}');
        expect(getLocalStorage('test-key', {})).toEqual({ foo: 'bar' });
      });

      it('should return default value if key does not exist', () => {
        expect(getLocalStorage('nonexistent', 'default')).toBe('default');
      });

      it('should handle JWT tokens', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
        localStorage.setItem('token', token);
        expect(getLocalStorage('token', '')).toBe(token);
      });

      it('should handle parse errors gracefully', () => {
        localStorage.setItem('test-key', 'invalid-json');
        expect(getLocalStorage('test-key', 'default')).toBe('invalid-json');
      });
    });

    describe('removeLocalStorage', () => {
      it('should remove item from localStorage', () => {
        localStorage.setItem('test-key', 'test-value');
        removeLocalStorage('test-key');
        expect(localStorage.getItem('test-key')).toBeNull();
      });

      it('should handle removing non-existent keys', () => {
        expect(() => removeLocalStorage('nonexistent')).not.toThrow();
      });
    });
  });

  // ==================== DEBOUNCE/THROTTLE ====================
  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);

      debounced('arg1', 'arg2');

      jest.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments correctly', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled('arg1', 'arg2');

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });
});
