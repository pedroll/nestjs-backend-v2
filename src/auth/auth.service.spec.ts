import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Test123!',
      fullName: 'Test User',
    };

    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const userId = '123';
      const token = 'jwt-token';

      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);
      mockUserRepository.create.mockReturnValue({
        ...createUserDto,
        id: userId,
        password: hashedPassword,
      });
      mockUserRepository.save.mockResolvedValue({
        ...createUserDto,
        id: userId,
        password: hashedPassword,
      });
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        user: {
          email: createUserDto.email,
          fullName: createUserDto.fullName,
          id: userId,
        },
        token,
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: userId });
    });

    it('should handle database errors', async () => {
      const dbError = { code: '23505', detail: 'Email already exists' };
      mockUserRepository.save.mockRejectedValue(dbError);

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'Test123!',
    };

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      password: 'hashedPassword',
      fullName: 'Test User',
      isActive: true,
      roles: ['user'],
    };

    it('should login successfully with valid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginUserDto);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          fullName: mockUser.fullName,
          isActive: mockUser.isActive,
          roles: mockUser.roles,
        },
        token: 'jwt-token',
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('checkAuthStatus', () => {
    it('should return user and new token', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
      };
      const token = 'new-jwt-token';

      mockJwtService.sign.mockReturnValue(token);

      const result = await service.checkAuthStatus(mockUser as User);

      expect(result).toEqual({
        user: mockUser,
        token,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
    });
  });
});
