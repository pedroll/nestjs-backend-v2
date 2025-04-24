import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../../src/app.module';
import { CreateUserDto, LoginUserDto } from '../../../src/auth/dto';
import { User } from '../../../src/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

interface ResponseBody {
  message?: string[];
  error?: string;
  statusCode?: number;
}

const testingUser = {
  email: 'testing.user@gmail.com',
  password: '123456Aa$',
  fullName: 'Testing User',
} as CreateUserDto;

const testingAdminUser = {
  email: 'testing.admin@gmail.com',
  password: '123456Aa$',
  fullName: 'Testing Admin',
} as CreateUserDto;

describe('Login (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // elimina los atributos que no esten en el dto
        forbidNonWhitelisted: true, // devuelve error si hay atributos que no esten en el dto
        // transform: true, // transforma los datos a los tipos que se especifican en el dto
        // transformOptions: {
        //   enableImplicitConversion: true,
        // },
        forbidUnknownValues: true,
      }),
    );

    await app.init();

    await request(app.getHttpServer()).post('/auth/register').send(testingUser);
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingAdminUser);

    // add testing users
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.update(
      { email: testingAdminUser.email },
      { roles: ['admin'] },
    );
  });

  afterAll(async () => {
    // delete testing users
    await userRepository.delete({ email: testingUser.email });
    await userRepository.delete({ email: testingAdminUser.email });

    await app.close();
  });

  it('/auth/login (POST) - no body should throw 400 Bad Request', async () => {
    const errorMessages = [
      'email should not be empty',
      'email must be shorter than or equal to 50 characters',
      'email must be longer than or equal to 6 characters',
      'email must be a string',
      'email must be an email',
      'The password must have a Uppercase, lowercase letter and a number (?=.*\\d)(?:(?=.*\\W+))?(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
      'password must be shorter than or equal to 50 characters',
      'password must be longer than or equal to 6 characters',
      'password must be a string',
    ];

    const response = await request(app.getHttpServer()).post('/auth/login');

    const body = response.body as ResponseBody;

    // console.log(response.body);

    expect(response.status).toBe(400);
    errorMessages.forEach((error) => {
      expect(body.message).toContain(error);
    });
  });

  it('/auth/login (POST) - wrong credentials email', async () => {
    const dto = {
      email: 'wrongemail@example.com',
      password: testingUser.password,
    } as LoginUserDto;

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto);
    const body = response.body as ResponseBody;

    expect(response.status).toBe(401);
    expect(body).toEqual({
      message: 'Invalid credentials email',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/auth/login (POST) - wrong credentials password', async () => {
    const dto = {
      email: testingUser.email,
      password: 'Wrongpassword1!',
    } as LoginUserDto;

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto);
    const body = response.body as ResponseBody;

    expect(response.status).toBe(401);
    expect(body).toEqual({
      message: 'Invalid credentials password',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/auth/login (POST) - valid credentials', async () => {
    const dto = {
      email: testingUser.email,
      password: testingUser.password,
    } as LoginUserDto;

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto);
    const body = response.body as ResponseBody;

    expect(response.status).toBe(201);
    expect(body).toEqual({
      user: {
        id: expect.any(String) as string,
        email: testingUser.email,
        fullName: testingUser.fullName,
        isActive: true,
        roles: ['user'],
      },
      token: expect.any(String) as string,
    });
  });
});
