import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { AuthRequest } from '../interfaces';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    readonly reflector: Reflector, // Reflector is used to retrieve metadata
  ) {}

  /**
   * Determines if the current user has the required roles to access the route.
   * @param context - The execution context which provides details about the current request.
   * @returns A boolean, Promise, or Observable indicating if the user can activate the route.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve the required roles from the route's metadata
    const validRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );
    if (!validRoles) return true; // if no roles are required, allow access
    if (validRoles.length === 0) return true;
    // console.log(validRoles);

    // Get the request object from the execution context
    const request: AuthRequest = context.switchToHttp().getRequest();

    // Check if the user is present in the request
    if (!request.user) {
      throw new ForbiddenException('User not found');
    }

    const user: User = request.user;

    // Check if the user has any of the valid roles
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    // Throw an exception if the user does not have the required roles
    throw new ForbiddenException(
      `User ${user.fullName} does not have the required roles [${validRoles.join(', ')}]`,
    );
  }
}
