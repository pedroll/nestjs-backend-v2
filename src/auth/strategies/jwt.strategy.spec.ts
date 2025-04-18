import { JwtStrategy } from './jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  // Creamos mock testing module
  let strategy: JwtStrategy;
  let userRepository: Repository<User>; // Simulamos el repositorio de usuarios
  let jwtService: JwtStrategy; // Simulamos el servicio de JWT

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
    // userRepository = module.get(getRepositoryToken(User));
    // jwtService = module.get(JwtStrategy); // Simulamos el servicio de JWT
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});
