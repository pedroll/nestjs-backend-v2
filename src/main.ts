import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina los atributos que no esten en el dto
      forbidNonWhitelisted: true, // devuelve error si hay atributos que no esten en el dto
      // transform: true, // transforma los datos a los tipos que se especifican en el dto
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
    }),
  );
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? 'api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
