import { UserRoleGuard } from './user-role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('UserRoleGuard', () => {
  let guard: UserRoleGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;
  beforeEach(() => {
    reflector = new Reflector();
    guard = new UserRoleGuard(reflector);
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  });

  // it('should return true if the role is in the request headers', () => {
  //   const result = guard.canActivate(mockExecutionContext);
  //
  //   expect(result).toBe(true);
  // });
  // it('should initialize with a Reflector instance', () => {
  //   expect(guard.reflector).toBe(reflector);
  // });
  it('should returm true if no role required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([]);
    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('should returm true if no role are present', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('should throw NotFoundException if no user is found', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({ user: undefined });
    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('return true has valid role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({
        user: { roles: ['admin'] },
      });

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('return false if no has valid role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue({
        user: { roles: ['user'] },
      });

    const result = () => guard.canActivate(mockExecutionContext);

    expect(result).toThrow(ForbiddenException);
  });
});
