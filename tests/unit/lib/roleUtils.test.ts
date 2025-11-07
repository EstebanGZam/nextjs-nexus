import {
  isGenericRole,
  filterGenericRoles,
  getHighestPriorityRole,
  getRedirectByRole,
  getLayoutByRole,
  suggestRoleByRoute,
  GENERIC_ROLES,
} from '@/src/lib/roleUtils';

describe('roleUtils', () => {
  describe('isGenericRole', () => {
    it('should return true for valid generic roles', () => {
      expect(isGenericRole('ADMINISTRATOR')).toBe(true);
      expect(isGenericRole('ORGANIZER')).toBe(true);
      expect(isGenericRole('BUYER')).toBe(true);
      expect(isGenericRole('STAFF')).toBe(true);
    });

    it('should handle lowercase role names', () => {
      expect(isGenericRole('administrator')).toBe(true);
      expect(isGenericRole('organizer')).toBe(true);
    });

    it('should handle mixed case role names', () => {
      expect(isGenericRole('AdMiNiStRaToR')).toBe(true);
    });

    it('should return false for invalid roles', () => {
      expect(isGenericRole('CUSTOM_ROLE')).toBe(false);
      expect(isGenericRole('INVALID')).toBe(false);
      expect(isGenericRole('')).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isGenericRole('  ADMINISTRATOR  ')).toBe(true);
    });
  });

  describe('filterGenericRoles', () => {
    it('should filter generic roles from string array', () => {
      const roles = ['ADMINISTRATOR', 'CUSTOM_ROLE', 'BUYER', 'INVALID'];
      const filtered = filterGenericRoles(roles);
      expect(filtered).toEqual(['ADMINISTRATOR', 'BUYER']);
    });

    it('should filter generic roles from object array', () => {
      const roles = [{ name: 'ADMINISTRATOR' }, { name: 'CUSTOM_ROLE' }, { name: 'ORGANIZER' }];
      const filtered = filterGenericRoles(roles);
      expect(filtered).toEqual(['ADMINISTRATOR', 'ORGANIZER']);
    });

    it('should handle empty array', () => {
      expect(filterGenericRoles([])).toEqual([]);
    });

    it('should handle array with no generic roles', () => {
      const roles = ['CUSTOM_ROLE', 'ANOTHER_ROLE'];
      expect(filterGenericRoles(roles)).toEqual([]);
    });

    it('should normalize role names to uppercase', () => {
      const roles = ['administrator', 'Buyer', 'ORGANIZER'];
      const filtered = filterGenericRoles(roles);
      expect(filtered).toEqual(['ADMINISTRATOR', 'BUYER', 'ORGANIZER']);
    });

    it('should handle duplicate roles', () => {
      const roles = ['BUYER', 'BUYER', 'ADMINISTRATOR'];
      const filtered = filterGenericRoles(roles);
      expect(filtered).toHaveLength(3); // Includes duplicates
    });
  });

  describe('getHighestPriorityRole', () => {
    it('should return highest priority role', () => {
      const roles = ['BUYER', 'ADMINISTRATOR', 'ORGANIZER'];
      expect(getHighestPriorityRole(roles)).toBe('ADMINISTRATOR');
    });

    it('should handle single role', () => {
      expect(getHighestPriorityRole(['BUYER'])).toBe('BUYER');
    });

    it('should return null for empty array', () => {
      expect(getHighestPriorityRole([])).toBeNull();
    });

    it('should return null for array with no generic roles', () => {
      const roles = ['CUSTOM_ROLE', 'INVALID_ROLE'];
      expect(getHighestPriorityRole(roles)).toBeNull();
    });

    it('should prioritize ADMINISTRATOR over others', () => {
      const roles = ['STAFF', 'BUYER', 'ORGANIZER', 'ADMINISTRATOR'];
      expect(getHighestPriorityRole(roles)).toBe('ADMINISTRATOR');
    });

    it('should prioritize ORGANIZER over BUYER and STAFF', () => {
      const roles = ['STAFF', 'BUYER', 'ORGANIZER'];
      expect(getHighestPriorityRole(roles)).toBe('ORGANIZER');
    });

    it('should prioritize BUYER over STAFF', () => {
      const roles = ['STAFF', 'BUYER'];
      expect(getHighestPriorityRole(roles)).toBe('BUYER');
    });

    it('should handle lowercase roles', () => {
      const roles = ['buyer', 'administrator'];
      expect(getHighestPriorityRole(roles)).toBe('ADMINISTRATOR');
    });
  });

  describe('getRedirectByRole', () => {
    it('should return correct redirect for ADMINISTRATOR', () => {
      expect(getRedirectByRole('ADMINISTRATOR')).toBe('/admin');
    });

    it('should return correct redirect for ORGANIZER', () => {
      expect(getRedirectByRole('ORGANIZER')).toBe('/organizer/events');
    });

    it('should return correct redirect for BUYER', () => {
      expect(getRedirectByRole('BUYER')).toBe('/events');
    });

    it('should return correct redirect for STAFF', () => {
      expect(getRedirectByRole('STAFF')).toBe('/tickets/validate');
    });

    it('should handle lowercase roles', () => {
      expect(getRedirectByRole('administrator')).toBe('/admin');
    });

    it('should return /events for null role', () => {
      expect(getRedirectByRole(null)).toBe('/events');
    });

    it('should return /events for invalid role', () => {
      expect(getRedirectByRole('INVALID_ROLE')).toBe('/events');
    });

    it('should return /events for empty string', () => {
      expect(getRedirectByRole('')).toBe('/events');
    });
  });

  describe('getLayoutByRole', () => {
    it('should return admin layout for ADMINISTRATOR', () => {
      expect(getLayoutByRole('ADMINISTRATOR')).toBe('admin');
    });

    it('should return organizer layout for ORGANIZER', () => {
      expect(getLayoutByRole('ORGANIZER')).toBe('organizer');
    });

    it('should return buyer layout for BUYER', () => {
      expect(getLayoutByRole('BUYER')).toBe('buyer');
    });

    it('should return staff layout for STAFF', () => {
      expect(getLayoutByRole('STAFF')).toBe('staff');
    });

    it('should handle lowercase roles', () => {
      expect(getLayoutByRole('administrator')).toBe('admin');
    });

    it('should return buyer layout for null role', () => {
      expect(getLayoutByRole(null)).toBe('buyer');
    });

    it('should return buyer layout for invalid role', () => {
      expect(getLayoutByRole('INVALID_ROLE')).toBe('buyer');
    });

    it('should return buyer layout as default', () => {
      expect(getLayoutByRole('')).toBe('buyer');
    });
  });

  describe('suggestRoleByRoute', () => {
    it('should suggest ADMINISTRATOR for admin routes', () => {
      const userRoles = ['ADMINISTRATOR', 'BUYER'];
      expect(suggestRoleByRoute('/admin', userRoles)).toBe('ADMINISTRATOR');
      expect(suggestRoleByRoute('/admin/users', userRoles)).toBe('ADMINISTRATOR');
    });

    it('should return null if user does not have ADMINISTRATOR role', () => {
      const userRoles = ['BUYER', 'ORGANIZER'];
      expect(suggestRoleByRoute('/admin', userRoles)).toBeNull();
    });

    it('should suggest ORGANIZER for organizer routes', () => {
      const userRoles = ['ORGANIZER', 'BUYER'];
      expect(suggestRoleByRoute('/organizer', userRoles)).toBe('ORGANIZER');
      expect(suggestRoleByRoute('/organizer/events', userRoles)).toBe('ORGANIZER');
    });

    it('should return null if user does not have ORGANIZER role', () => {
      const userRoles = ['BUYER', 'STAFF'];
      expect(suggestRoleByRoute('/organizer', userRoles)).toBeNull();
    });

    it('should suggest STAFF for ticket validation routes', () => {
      const userRoles = ['STAFF', 'BUYER'];
      expect(suggestRoleByRoute('/tickets/validate', userRoles)).toBe('STAFF');
    });

    it('should return null if user does not have STAFF role', () => {
      const userRoles = ['BUYER', 'ORGANIZER'];
      expect(suggestRoleByRoute('/tickets/validate', userRoles)).toBeNull();
    });

    it('should suggest BUYER for purchases routes', () => {
      const userRoles = ['BUYER', 'STAFF'];
      expect(suggestRoleByRoute('/purchases', userRoles)).toBe('BUYER');
      expect(suggestRoleByRoute('/purchases/123', userRoles)).toBe('BUYER');
    });

    it('should suggest BUYER for cart routes', () => {
      const userRoles = ['BUYER', 'STAFF'];
      expect(suggestRoleByRoute('/cart', userRoles)).toBe('BUYER');
    });

    it('should return null if user does not have BUYER role', () => {
      const userRoles = ['STAFF', 'ORGANIZER'];
      expect(suggestRoleByRoute('/purchases', userRoles)).toBeNull();
    });

    it('should return null for public routes', () => {
      const userRoles = ['BUYER', 'ADMINISTRATOR'];
      expect(suggestRoleByRoute('/events', userRoles)).toBeNull();
      expect(suggestRoleByRoute('/login', userRoles)).toBeNull();
      expect(suggestRoleByRoute('/', userRoles)).toBeNull();
    });

    it('should handle empty user roles', () => {
      expect(suggestRoleByRoute('/admin', [])).toBeNull();
    });

    it('should handle routes with custom roles only', () => {
      const userRoles = ['CUSTOM_ROLE', 'ANOTHER_ROLE'];
      expect(suggestRoleByRoute('/admin', userRoles)).toBeNull();
    });

    it('should handle mixed case roles', () => {
      const userRoles = ['administrator', 'buyer'];
      expect(suggestRoleByRoute('/admin', userRoles)).toBe('ADMINISTRATOR');
    });
  });

  describe('GENERIC_ROLES constant', () => {
    it('should contain all expected generic roles', () => {
      expect(GENERIC_ROLES).toContain('ADMINISTRATOR');
      expect(GENERIC_ROLES).toContain('ORGANIZER');
      expect(GENERIC_ROLES).toContain('BUYER');
      expect(GENERIC_ROLES).toContain('STAFF');
      expect(GENERIC_ROLES).toHaveLength(4);
    });
  });
});
