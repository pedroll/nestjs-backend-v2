import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController; // Simulamos el controlador de autenticación
  let authService: AuthService; // Simulamos el servicio de autenticación
  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
      create: jest.fn(),
      login: jest.fn(),
      checkAuthStatus: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      private: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should create a new user', async () => {
    const user: CreateUserDto = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'John Doe',
    };
    await authController.create(user);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.create).toHaveBeenCalledWith(user);
  });

  it('should login a user', async () => {
    const user: LoginUserDto = {
      email: 'test@example.com',
      password: 'Password123',
    };
    await authController.login(user);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.login).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.login).toHaveBeenCalledWith(user);
  });

  it('should check auth status', async () => {
    const user: Partial<User> = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'John Doe',
    };

    await authController.checkAuthStatus(user as User);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.checkAuthStatus).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authService.checkAuthStatus).toHaveBeenCalledWith(user as User);
  });

  it('should return private route data', () => {
    const user = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'John Doe',
    } as User;
    const rawHeaders = ['Authorization', 'Bearer token'];
    const headers = {};

    const result = authController.private(
      user,
      user.email,
      rawHeaders,
      headers,
    );

    expect(result).toEqual({
      ok: true,
      message: 'This is a private route',
      user: {
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'John Doe',
      },
      userEmail: 'test@example.com',
      headers: {},
      rawHeaders: ['Authorization', 'Bearer token'],
    });
  });
});
