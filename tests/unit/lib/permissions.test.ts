import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  PERMISSIONS,
} from '@/src/lib/permissions';
import type { User } from '@/src/lib/types';

describe('permissions', () => {
  // Mock users for testing
  const userWithPermissions: User = {
    id: '1',
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
    roleIds: ['role1'],
    isBlocked: false,
    twoFactorEnabled: false,
    roles: [
      {
        id: 'role1',
        name: 'ADMINISTRATOR',
        description: 'Admin role',
        permissions: [
          { id: 'perm1', name: 'CREATE_USER' },
          { id: 'perm2', name: 'VIEW_USERS' },
          { id: 'perm3', name: 'UPDATE_USER' },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const userWithMultipleRoles: User = {
    id: '2',
    email: 'multi@test.com',
    firstName: 'Multi',
    lastName: 'Role',
    roleIds: ['role1', 'role2'],
    isBlocked: false,
    twoFactorEnabled: false,
    roles: [
      {
        id: 'role1',
        name: 'ADMINISTRATOR',
        description: 'Admin role',
        permissions: [
          { id: 'perm1', name: 'CREATE_USER' },
          { id: 'perm2', name: 'VIEW_USERS' },
        ],
      },
      {
        id: 'role2',
        name: 'ORGANIZER',
        description: 'Organizer role',
        permissions: [
          { id: 'perm3', name: 'CREATE_EVENT' },
          { id: 'perm4', name: 'VIEW_EVENTS' },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const userWithoutPermissions: User = {
    id: '3',
    email: 'noPerms@test.com',
    firstName: 'No',
    lastName: 'Perms',
    roleIds: ['role3'],
    isBlocked: false,
    twoFactorEnabled: false,
    roles: [
      {
        id: 'role3',
        name: 'BUYER',
        description: 'Buyer role',
        permissions: [],
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const userWithNoRoles: User = {
    id: '4',
    email: 'noRoles@test.com',
    firstName: 'No',
    lastName: 'Roles',
    roleIds: [],
    isBlocked: false,
    twoFactorEnabled: false,
    roles: [],
    createdAt: new Date().toISOString(),
  };

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      expect(hasPermission(userWithPermissions, 'CREATE_USER')).toBe(true);
      expect(hasPermission(userWithPermissions, 'VIEW_USERS')).toBe(true);
      expect(hasPermission(userWithPermissions, 'UPDATE_USER')).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      expect(hasPermission(userWithPermissions, 'DELETE_USER')).toBe(false);
      expect(hasPermission(userWithPermissions, 'CREATE_EVENT')).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(hasPermission(null, 'CREATE_USER')).toBe(false);
    });

    it('should return false when user has no roles', () => {
      expect(hasPermission(userWithNoRoles, 'CREATE_USER')).toBe(false);
    });

    it('should return false when user has roles but no permissions', () => {
      expect(hasPermission(userWithoutPermissions, 'CREATE_USER')).toBe(false);
    });

    it('should check permissions across multiple roles', () => {
      expect(hasPermission(userWithMultipleRoles, 'CREATE_USER')).toBe(true);
      expect(hasPermission(userWithMultipleRoles, 'CREATE_EVENT')).toBe(true);
    });

    it('should handle non-existent permissions', () => {
      expect(hasPermission(userWithPermissions, 'NON_EXISTENT_PERMISSION')).toBe(false);
    });

    it('should be case-sensitive for permission names', () => {
      expect(hasPermission(userWithPermissions, 'create_user')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one permission', () => {
      expect(hasAnyPermission(userWithPermissions, ['CREATE_USER', 'DELETE_USER'])).toBe(true);
      expect(hasAnyPermission(userWithPermissions, ['DELETE_USER', 'VIEW_USERS'])).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      expect(hasAnyPermission(userWithPermissions, ['DELETE_USER', 'CREATE_EVENT'])).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(hasAnyPermission(null, ['CREATE_USER', 'VIEW_USERS'])).toBe(false);
    });

    it('should return false when user has no roles', () => {
      expect(hasAnyPermission(userWithNoRoles, ['CREATE_USER'])).toBe(false);
    });

    it('should return false with empty permissions array', () => {
      expect(hasAnyPermission(userWithPermissions, [])).toBe(false);
    });

    it('should check permissions across multiple roles', () => {
      expect(hasAnyPermission(userWithMultipleRoles, ['CREATE_USER', 'CREATE_EVENT'])).toBe(true);
      expect(hasAnyPermission(userWithMultipleRoles, ['DELETE_USER', 'CREATE_EVENT'])).toBe(true);
    });

    it('should handle user with no permissions in roles', () => {
      expect(hasAnyPermission(userWithoutPermissions, ['CREATE_USER', 'VIEW_USERS'])).toBe(false);
    });

    it('should return true if any permission matches', () => {
      const permissions = ['NON_EXISTENT', 'ANOTHER_NON_EXISTENT', 'CREATE_USER'];
      expect(hasAnyPermission(userWithPermissions, permissions)).toBe(true);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all permissions', () => {
      expect(hasAllPermissions(userWithPermissions, ['CREATE_USER', 'VIEW_USERS'])).toBe(true);
      expect(
        hasAllPermissions(userWithPermissions, ['CREATE_USER', 'VIEW_USERS', 'UPDATE_USER'])
      ).toBe(true);
    });

    it('should return false when user is missing at least one permission', () => {
      expect(hasAllPermissions(userWithPermissions, ['CREATE_USER', 'DELETE_USER'])).toBe(false);
      expect(hasAllPermissions(userWithPermissions, ['CREATE_USER', 'CREATE_EVENT'])).toBe(false);
    });

    it('should return false when user is null', () => {
      expect(hasAllPermissions(null, ['CREATE_USER', 'VIEW_USERS'])).toBe(false);
    });

    it('should return false when user has no roles', () => {
      expect(hasAllPermissions(userWithNoRoles, ['CREATE_USER'])).toBe(false);
    });

    it('should return true with empty permissions array', () => {
      // Every element of empty array satisfies the condition (vacuous truth)
      expect(hasAllPermissions(userWithPermissions, [])).toBe(true);
    });

    it('should check permissions across multiple roles', () => {
      expect(hasAllPermissions(userWithMultipleRoles, ['CREATE_USER', 'CREATE_EVENT'])).toBe(true);
      expect(
        hasAllPermissions(userWithMultipleRoles, ['CREATE_USER', 'VIEW_USERS', 'CREATE_EVENT'])
      ).toBe(true);
    });

    it('should return false if missing any permission', () => {
      expect(
        hasAllPermissions(userWithMultipleRoles, ['CREATE_USER', 'CREATE_EVENT', 'DELETE_USER'])
      ).toBe(false);
    });

    it('should handle user with no permissions in roles', () => {
      expect(hasAllPermissions(userWithoutPermissions, ['CREATE_USER'])).toBe(false);
    });

    it('should handle single permission check', () => {
      expect(hasAllPermissions(userWithPermissions, ['CREATE_USER'])).toBe(true);
      expect(hasAllPermissions(userWithPermissions, ['DELETE_USER'])).toBe(false);
    });
  });

  describe('PERMISSIONS constant', () => {
    it('should contain expected permission constants', () => {
      expect(PERMISSIONS.CREATE_USER).toBe('CREATE_USER');
      expect(PERMISSIONS.VIEW_USERS).toBe('VIEW_USERS');
      expect(PERMISSIONS.UPDATE_USER).toBe('UPDATE_USER');
      expect(PERMISSIONS.DELETE_USER).toBe('DELETE_USER');
      expect(PERMISSIONS.CREATE_EVENT).toBe('CREATE_EVENT');
      expect(PERMISSIONS.VIEW_EVENTS).toBe('VIEW_EVENTS');
      expect(PERMISSIONS.UPDATE_EVENT).toBe('UPDATE_EVENT');
      expect(PERMISSIONS.DELETE_EVENT).toBe('DELETE_EVENT');
    });

    it('should be an object with string values', () => {
      expect(typeof PERMISSIONS).toBe('object');
      Object.values(PERMISSIONS).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle user with undefined roles', () => {
      const userWithUndefinedRoles = {
        ...userWithPermissions,
        roles: undefined as unknown as User['roles'],
      };
      expect(hasPermission(userWithUndefinedRoles, 'CREATE_USER')).toBe(false);
    });

    it('should handle role with undefined permissions', () => {
      const userWithUndefinedPerms: User = {
        ...userWithPermissions,
        roles: [
          {
            id: 'role1',
            name: 'TEST_ROLE',
            description: 'Test',
            permissions: undefined as unknown as Array<{ id: string; name: string }>,
          },
        ],
      };
      expect(hasPermission(userWithUndefinedPerms, 'CREATE_USER')).toBe(false);
    });

    it('should handle empty permission name', () => {
      expect(hasPermission(userWithPermissions, '')).toBe(false);
    });

    it('should handle whitespace permission name', () => {
      expect(hasPermission(userWithPermissions, '   ')).toBe(false);
    });
  });
});
