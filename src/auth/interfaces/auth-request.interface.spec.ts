import { AuthRequest } from './auth-request.interface';
import { User } from '../entities/user.entity';

describe('AuthRequest Interface', () => {
  it('should accept a valid request with user', () => {
    const mockUser: Partial<User> = {
      id: '123',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      roles: ['user'],
    };

    const mockRequest: AuthRequest = {
      user: mockUser as User,
      rawHeaders: ['Authorization', 'Bearer token'],
      // other Request properties would be here in a real request
    } as AuthRequest;

    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.rawHeaders).toBeDefined();
    expect(Array.isArray(mockRequest.rawHeaders)).toBeTruthy();
  });

  it('should accept a request without user', () => {
    const mockRequest: AuthRequest = {
      rawHeaders: ['Content-Type', 'application/json'],
      // other Request properties would be here in a real request
    } as AuthRequest;

    expect(mockRequest.user).toBeUndefined();
    expect(mockRequest.rawHeaders).toHaveLength(2);
  });

  it('should require rawHeaders as string array', () => {
    const mockRequest: AuthRequest = {
      rawHeaders: ['Header1', 'Value1', 'Header2', 'Value2'],
    } as AuthRequest;

    expect(Array.isArray(mockRequest.rawHeaders)).toBeTruthy();
    expect(
      mockRequest.rawHeaders.every((header) => typeof header === 'string'),
    ).toBeTruthy();
  });

  it('should maintain user properties when present', () => {
    const mockUser: Partial<User> = {
      id: '123',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      roles: ['user'],
    };

    const mockRequest: AuthRequest = {
      user: mockUser as User,
      rawHeaders: [] as string[],
    } as AuthRequest;

    expect(mockRequest.user?.id).toBe('123');
    expect(mockRequest.user?.email).toBe('test@example.com');
    expect(mockRequest.user?.fullName).toBe('Test User');
    expect(mockRequest.user?.isActive).toBeTruthy();
    expect(mockRequest.user?.roles).toContain('user');
  });

  it('should handle empty rawHeaders array', () => {
    const mockRequest: AuthRequest = {
      rawHeaders: [] as string[],
    } as AuthRequest;

    expect(mockRequest.rawHeaders).toBeDefined();
    expect(mockRequest.rawHeaders).toHaveLength(0);
  });
});
