import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

/**
 * Custom decorator to apply role-based authorization and guards to a route handler.
 *
 * @param roles - A list of valid roles that are allowed to access the route.
 * @returns A combined decorator that applies role protection and guards.
 */
export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles), // Apply role-based protection
    UseGuards(AuthGuard(), UserRoleGuard), // Apply authentication and role guards
  );
}
