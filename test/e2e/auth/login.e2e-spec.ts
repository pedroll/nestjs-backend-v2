import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';

interface ResponseBody {
  message?: string[];
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

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .expect(400);

    const body = response.body as ResponseBody;

    console.log(response.body);
    //return request(app.getHttpServer()).get('/').expect(404);
    expect(response.status).toBe(400);
    errorMessages.forEach((error) => {
      expect(body.message).toContain(error);
    });
  });
});
