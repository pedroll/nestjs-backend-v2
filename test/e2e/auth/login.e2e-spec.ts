import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { LoginUserDto } from '../../../src/auth/dto';

interface ResponseBody {
  message?: string[];
  error?: string;
  statusCode?: number;
}

describe('Login (e2e)', () => {
  let app: INestApplication<App>;

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
  });

  afterAll(async () => {
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
      password: 'Wrongpassword1!',
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
      email: 'pedro@gmail.com',
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
      email: 'pedro@gmail.com',
      password: '123456Aa$',
    } as LoginUserDto;

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto);
    const body = response.body as ResponseBody;

    expect(response.status).toBe(201);
    expect(body).toEqual({
      user: {
        id: expect.any(String) as string,
        email: 'pedro@gmail.com',
        fullName: 'pedro',
        isActive: true,
        roles: ['user'],
      },
      token: expect.any(String) as string,
    });
  });
});
