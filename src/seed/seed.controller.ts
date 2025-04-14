import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Destruye y crea una nueva base de datos',
    description:
      'Destruye y crea la base de datos de productos y usuarios, esto invalida también tokens existentes y usuarios creados.',
  })
  @ApiResponse({
    status: 200,
    description: 'The seed process has been successfully executed.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
