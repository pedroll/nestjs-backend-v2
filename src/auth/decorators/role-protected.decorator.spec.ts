import { META_ROLES, RoleProtected } from './role-protected.decorator';
import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
// import { SetMetadata } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  // SetMetadata: jest.fn().mockImplementation((key, value) => ({
  // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // key,
  // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // value,
  // })),
  SetMetadata: jest.fn(),
}));
describe('RoleProtected', () => {
  it('should set metadata', () => {
    const roles: ValidRoles[] = [ValidRoles.ADMIN, ValidRoles.SUPER_USER];
    //const result = RoleProtected(...roles);
    RoleProtected(...roles);

    // expect(result).toEqual({ key: META_ROLES, value: roles });
    expect(SetMetadata).toHaveBeenCalled();
    expect(SetMetadata).toHaveBeenCalledWith(META_ROLES, roles);
  });
});
