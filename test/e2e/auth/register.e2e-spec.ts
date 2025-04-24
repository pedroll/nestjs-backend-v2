import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../../src/app.module';
import { CreateUserDto } from '../../../src/auth/dto';
import { User } from '../../../src/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

interface ResponseBody {
  message?: string[];
  error?: string;
  statusCode?: number;
}

const testingExistingUser = {
  email: 'testing.existing@gmail.com',
  password: '123456Aa$',
  fullName: 'Testing User',
} as CreateUserDto;

const testingRegisterUser = {
  email: 'testing.register@gmail.com',
  password: '123456Aa$',
  fullName: 'Testing Admin',
} as CreateUserDto;

describe('Register (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
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

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingExistingUser);
  });

  afterEach(async () => {
    // delete testing users
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    await userRepository.delete({ email: testingExistingUser.email });
    await userRepository.delete({ email: testingRegisterUser.email });

    await app.close();
  });

  it('/auth/register (POST) - no body should throw 400 Bad Request', async () => {
    // Evaluar errores esperados
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
      'fullName must be shorter than or equal to 50 characters',
      'fullName must be longer than or equal to 3 characters',
      'fullName must be a string',
    ];

    const response = await request(app.getHttpServer()).post('/auth/register');
    const body = response.body as ResponseBody;

    expect(response.status).toBe(400);
    errorMessages.forEach((error) => {
      expect(body.message).toContain(error);
    });
  });

  it('/auth/register (POST) - same email', async () => {
    const dto = {
      ...testingRegisterUser,
      email: testingExistingUser.email,
    } as CreateUserDto;

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto);
    const body = response.body as ResponseBody;

    expect(response.status).toBe(400);
    expect(body).toEqual({
      message: `Key (email)=(${testingExistingUser.email}) already exists.`,
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/auth/register (POST) - unsafe password', async () => {
    const dto = {
      ...testingRegisterUser,
      password: 'wrongpassword',
    } as CreateUserDto;

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto);
    const body = response.body as ResponseBody;

    expect(response.status).toBe(400);
    expect(body).toEqual({
      message: [
        'The password must have a Uppercase, lowercase letter and a number (?=.*\\d)(?:(?=.*\\W+))?(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/auth/register (POST) - valid credentials', async () => {
    const dto = {
      ...testingRegisterUser,
    } as CreateUserDto;

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto);
    const body = response.body as ResponseBody;

    expect(response.status).toBe(201);
    expect(body).toEqual({
      user: {
        email: testingRegisterUser.email,
        fullName: testingRegisterUser.fullName,
        createdAt: expect.any(String) as string,
        updatedAt: null,
        id: expect.any(String) as string,
        isActive: true,
        roles: ['user'],
      },
      token: expect.any(String) as string,
    });
  });

  it.todo('/auth/register (POST) - faltan parametros');
});
