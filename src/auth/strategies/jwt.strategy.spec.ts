import { JwtStrategy } from './jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  // Creamos mock testing module
  let strategy: JwtStrategy;
  let userRepository: Repository<User>; // Simulamos el repositorio de usuarios

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    // jwtService = module.get(JwtStrategy); // Simulamos el servicio de JWT
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return a user if exists and active', async () => {
    // simulamos el flujo de jwtStrategy.validate
    const payload: JwtPayload = { id: 'some-uuid' };
    const mockUser = { id: 'some-uuid', isActive: true } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); // Simulamos findOne
    const result = await strategy.validate(payload);

    expect(result).toEqual(mockUser);
  });

  it('should Throw an exception if the user is not found', async () => {
    // simulamos el flujo de jwtStrategy.validate
    const payload: JwtPayload = { id: 'some-uuid' };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // Simulamos findOne

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate(payload)).rejects.toThrow('Token no valido');
  });

  it('should Throw an exception if the user is inactive', async () => {
    // simulamos el flujo de jwtStrategy.validate
    const payload: JwtPayload = { id: 'some-uuid' };
    const mockUser = { id: 'some-uuid', isActive: false } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser); // Simulamos findOne
    const result = strategy.validate(payload);

    await expect(result).rejects.toThrow(UnauthorizedException);
    await expect(result).rejects.toThrow('Usuario inactivo');
  });
});
