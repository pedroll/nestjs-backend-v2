import { ValidRoles } from './valid-roles.interface';

describe('ValidRoles Enum', () => {
  it('should have exactly three roles defined', () => {
    const roleCount = Object.keys(ValidRoles).length;

    expect(roleCount).toBe(3);
  });

  it('should contain all expected keys', () => {
    const expectedKeys = ['ADMIN', 'USER', 'SUPER_USER'];
    const actualKeys = Object.keys(ValidRoles);

    expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
  });

  it('should have correct role values', () => {
    expect(ValidRoles.ADMIN).toBe('admin');
    expect(ValidRoles.USER).toBe('user');
    expect(ValidRoles.SUPER_USER).toBe('super-user');
  });
});
