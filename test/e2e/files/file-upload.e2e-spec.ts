import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';
import { App } from 'supertest/types';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

import { AppModule } from '../../../src/app.module';

describe('AuthModule Private (e2e)', () => {
  let app: INestApplication<App>;

  const testImagePath = join(__dirname, 'nestjs.png');

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

  it('should throw 400 error if no file selected', async () => {
    const response = await request(app.getHttpServer()).post('/files/product');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Make sure that the file is an image',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it("should throw 400 error if file selected isn't an image", async () => {
    const response = await request(app.getHttpServer())
      .post('/files/product')
      .attach('file', Buffer.from('not an image'), 'not-an-image.txt');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Only image files are allowed!',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('should upload image successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/files/product')
      .attach('file', testImagePath, 'nestjs.png');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('secureUrl');
    expect(response.body).toHaveProperty('fileName');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.secureUrl).toContain('/files/product');

    const filePath = join(
      __dirname,
      '../../../',
      'static',
      'uploads',
      'products',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      response.body.fileName,
    );
    const fileExists = existsSync(filePath);
    expect(fileExists).toBeTruthy();
    unlinkSync(filePath);
  });

  it('should throw error if requested file not found', async () => {
    const response = await request(app.getHttpServer()).get(
      '/files/product/image-not-exists.jpg',
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Not product found with image image-not-exists.jpg',
      error: 'Bad Request',
      statusCode: 400,
    });
  });
});
