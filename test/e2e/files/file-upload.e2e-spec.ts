import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { User } from '../../../src/auth/entities/user.entity';

interface ResponseBody {
  message?: string[];
  error?: string;
  statusCode?: number;
  user?: User;
  token?: string;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

describe('AuthModule Private (e2e)', () => {
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

  afterEach(async () => {
    // delete testing users
    await app.close();
  });

  it('should throw error if no file selected', async () => {
    const response = await request(app.getHttpServer()).post('/files/product');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Make sure that the file is an image',
      error: 'Bad Request',
      statusCode: 400,
    });
  });
});
