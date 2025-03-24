import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Execute the seed process' })
  @ApiResponse({
    status: 200,
    description: 'The seed process has been successfully executed.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
