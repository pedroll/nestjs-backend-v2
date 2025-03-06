import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from '../config/app.config';
import { joiValidationSchema } from '../config/joiValidationSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: joiValidationSchema,
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
