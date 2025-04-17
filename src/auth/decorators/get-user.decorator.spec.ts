import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { getUser } from './get-user.decorator';

describe('GetUser Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to create a mock user (Partial for override)
  const createMockUser = (overrides: Partial<User> = {}): Partial<User> => ({
    id: 'test-uuid',
    email: 'test@example.com',
    fullName: 'Test User',
    isActive: true,
    roles: ['user'],
    password: 'Password123!',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  // Helper to create mock execution context with user injected
  const createMockExecutionContext = (
    user: Partial<User> | undefined,
  ): ExecutionContext =>
    ({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    }) as unknown as ExecutionContext;

  it('should return the entire user object when data parameter is undefined', () => {
    // Arrange
    const mockUser = createMockUser();
    const mockExecutionContext = createMockExecutionContext(mockUser);

    // Act
    const result = getUser(undefined, mockExecutionContext);

    // Assert
    expect(result).toEqual(mockUser);
  });

  it('should return user property value when data parameter is defined', () => {
    // Arrange
    const mockUser = createMockUser();
    const mockExecutionContext = createMockExecutionContext(mockUser);

    // Act
    const result = getUser('email', mockExecutionContext);

    // Assert
    expect(result).toBe(mockUser.email);
  });

  it('should throw InternalServerErrorException when user is not found in request', async () => {
    // Arrange
    const mockExecutionContext = createMockExecutionContext(undefined);

    // Act
    const result = () => getUser(undefined, mockExecutionContext);

    // Assert
    expect(result).toThrow(InternalServerErrorException);
    expect(result).toThrow('User not found (request)');
  });
});
