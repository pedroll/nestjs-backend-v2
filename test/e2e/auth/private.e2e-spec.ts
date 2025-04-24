import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { validate } from 'uuid';
import { AppModule } from '../../../src/app.module';
import { CreateUserDto } from '../../../src/auth/dto';
import { User } from '../../../src/auth/entities/user.entity';

interface ResponseBody {
  message?: string[];
  error?: string;
  statusCode?: number;
  user?: User;
  token?: string;
}

const testingPrivateUser = {
  email: 'testing.private@gmail.com',
  password: '123456Aa$',
  fullName: 'Testing User',
} as CreateUserDto;

const testingPrivateAdmin = {
  email: 'testing.admin@gmail.com',
  password: '123456Aa$',
  fullName: 'Testing Admin',
} as CreateUserDto;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

describe('AuthModule Private (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;

  let token: string;
  let adminToken: string;

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

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.delete({ email: testingPrivateUser.email });
    await userRepository.delete({ email: testingPrivateAdmin.email });

    const responseUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingPrivateUser);
    const bodyUser = responseUser.body as ResponseBody;
    token = bodyUser.token!;

    const responseAdmin = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingPrivateAdmin);
    const bodyAdmin = responseAdmin.body as ResponseBody;
    adminToken = bodyAdmin.token!;
    await userRepository.update(
      { email: testingPrivateAdmin.email },
      { roles: ['admin', 'super-user'] },
    );
  });

  afterEach(async () => {
    // delete testing users
    await userRepository.delete({ email: testingPrivateUser.email });
    await userRepository.delete({ email: testingPrivateAdmin.email });

    await app.close();
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/private')
      .send();

    expect(response.status).toBe(401);
  });

  it('should return new token and user if token is provided (checkStatus)', async () => {
    //delay between requests
    await delay(1000);

    // Validar que el id es un uuid válido
    const response = await request(app.getHttpServer())
      .get('/auth/check-auth-status')
      .set('Authorization', `Bearer ${token}`);
    const responseBody = response.body as ResponseBody;
    const newToken = responseBody.token!;

    expect(response.status).toBe(200);
    expect(newToken).not.toBe(token);
  });

  it('should return custom object if token is valid', async () => {
    // Validar la respuesta
    const response = await request(app.getHttpServer())
      .get('/auth/private')
      .set('Authorization', `Bearer ${token}`);
    const responseBody = response.body as ResponseBody;

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      ok: true,
      message: 'This is a private route',
      user: {
        id: expect.any(String) as string,
        email: 'testing.private@gmail.com',
        fullName: 'Testing User',
        isActive: true,
        roles: ['user'],
      },
      userEmail: 'testing.private@gmail.com',
      headers: expect.any(Object) as object,
      rawHeaders: expect.any(Array) as [],
    });
  });

  it('should return 403 if NO admin token is provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/private3')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it('should return user with uuid if admin token is provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/private3')
      .set('Authorization', `Bearer ${adminToken}`);
    const responseBody = response.body as ResponseBody;
    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      ok: true,
      message: 'This is a private route',
      user: {
        id: expect.any(String) as string,
        email: 'testing.admin@gmail.com',
        fullName: 'Testing Admin',
        isActive: true,
        roles: ['admin', 'super-user'],
      },
    });
    expect(validate(responseBody.user!.id)).toBe(true);
  });
});
