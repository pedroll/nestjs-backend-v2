import { Injectable } from '@nestjs/common';
import { CreateGptDto } from './dto/create-gpt.dto';
import { ortographyUseCase } from './use-case';

@Injectable()
export class GptService {
  async orthographyCheck(createGptDto: CreateGptDto): any {
    await ortographyUseCase();
  }
}
