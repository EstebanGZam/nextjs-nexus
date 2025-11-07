import {
  decodeJwt,
  isTokenExpired,
  isTokenExpiringSoon,
  getTokenRemainingTime,
} from '@/src/lib/jwtUtils';

// Helper function to create a mock JWT token
function createMockToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = 'mock-signature';
  return `${header}.${payloadStr}.${signature}`;
}

describe('jwtUtils', () => {
  describe('decodeJwt', () => {
    it('should decode a valid JWT token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        roles: ['BUYER'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const token = createMockToken(payload);
      const decoded = decodeJwt(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe('user123');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.roles).toEqual(['BUYER']);
    });

    it('should return null for invalid token format', () => {
      expect(decodeJwt('invalid-token')).toBeNull();
      expect(decodeJwt('only.two')).toBeNull();
      expect(decodeJwt('too.many.parts.here')).toBeNull();
    });

    it('should return null for malformed base64', () => {
      const token = 'header.!!!invalid-base64!!!.signature';
      expect(decodeJwt(token)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(decodeJwt('')).toBeNull();
    });

    it('should handle tokens with URL-safe base64 encoding', () => {
      const payload = { sub: 'user123' };
      // Create token with URL-safe characters
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const payloadStr = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_');
      const token = `${header}.${payloadStr}.signature`;

      const decoded = decodeJwt(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe('user123');
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      };
      const token = createMockToken(payload);

      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      };
      const token = createMockToken(payload);

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const payload = {
        sub: 'user123',
        // No exp field
      };
      const token = createMockToken(payload);

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
    });

    it('should return true for token that just expired', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) - 1, // Expired 1 second ago
      };
      const token = createMockToken(payload);

      expect(isTokenExpired(token)).toBe(true);
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('should return false for token expiring far in the future', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      };
      const token = createMockToken(payload);

      expect(isTokenExpiringSoon(token, 5)).toBe(false);
    });

    it('should return true for token expiring within threshold', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 120, // Expires in 2 minutes
      };
      const token = createMockToken(payload);

      expect(isTokenExpiringSoon(token, 5)).toBe(true);
    });

    it('should return true for already expired token', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) - 3600,
      };
      const token = createMockToken(payload);

      expect(isTokenExpiringSoon(token, 5)).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const payload = {
        sub: 'user123',
      };
      const token = createMockToken(payload);

      expect(isTokenExpiringSoon(token, 5)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpiringSoon('invalid-token', 5)).toBe(true);
    });

    it('should use default threshold of 5 minutes', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 120, // Expires in 2 minutes
      };
      const token = createMockToken(payload);

      expect(isTokenExpiringSoon(token)).toBe(true);
    });

    it('should handle custom threshold', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 600, // Expires in 10 minutes
      };
      const token = createMockToken(payload);

      expect(isTokenExpiringSoon(token, 15)).toBe(true); // 15 min threshold
      expect(isTokenExpiringSoon(token, 5)).toBe(false); // 5 min threshold
    });
  });

  describe('getTokenRemainingTime', () => {
    it('should return remaining time in seconds', () => {
      const futureTime = 3600; // 1 hour from now
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + futureTime,
      };
      const token = createMockToken(payload);

      const remaining = getTokenRemainingTime(token);
      expect(remaining).toBeGreaterThan(3500);
      expect(remaining).toBeLessThanOrEqual(3600);
    });

    it('should return 0 for expired token', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) - 3600,
      };
      const token = createMockToken(payload);

      expect(getTokenRemainingTime(token)).toBe(0);
    });

    it('should return 0 for token without exp claim', () => {
      const payload = {
        sub: 'user123',
      };
      const token = createMockToken(payload);

      expect(getTokenRemainingTime(token)).toBe(0);
    });

    it('should return 0 for invalid token', () => {
      expect(getTokenRemainingTime('invalid-token')).toBe(0);
    });

    it('should return 0 for token that just expired', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) - 1,
      };
      const token = createMockToken(payload);

      expect(getTokenRemainingTime(token)).toBe(0);
    });

    it('should handle tokens expiring very soon', () => {
      const payload = {
        sub: 'user123',
        exp: Math.floor(Date.now() / 1000) + 10, // 10 seconds
      };
      const token = createMockToken(payload);

      const remaining = getTokenRemainingTime(token);
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(10);
    });
  });
});
