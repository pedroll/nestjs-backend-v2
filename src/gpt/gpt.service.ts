import { Injectable } from '@nestjs/common';
import { OrthographyDto } from './dto';
import { orthographyUseCase } from './use-case';

@Injectable()
export class GptService {
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyUseCase(orthographyDto);
  }
}
