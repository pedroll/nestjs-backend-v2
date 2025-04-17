import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { Auth } from './auth.decorator';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

// Mock applyDecorators function
jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn(),
  UseGuards: jest.fn(),
}));

// Mock passport guard
jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn(() => 'MockAuthGuard'),
}));

// Mock user-role guard
jest.mock('../guards/user-role.guard', () => ({
  UserRoleGuard: jest.fn(() => 'UserRoleGuard'),
}));

// Mock role-protected decorator
jest.mock('./role-protected.decorator', () => ({
  RoleProtected: jest.fn(() => 'RoleProtected'),
}));

describe('Auth Decorator', () => {
  it('should call applyDecorators with RoleProtected and UseGuards', () => {
    const roles: ValidRoles[] = [ValidRoles.ADMIN, ValidRoles.USER];

    Auth(...roles);
    // expect(decorator).toBeDefined();
    expect(applyDecorators).toHaveBeenCalledWith(
      RoleProtected(...roles),
      UseGuards(AuthGuard(), UserRoleGuard),
    );
  });
});
