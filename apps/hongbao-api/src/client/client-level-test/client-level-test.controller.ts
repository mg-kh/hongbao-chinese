import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ClientLevelTestService } from './client-level-test.service';

@ApiTags('# Client - Level Test')
@ApiBearerAuth('access-token')
@Controller()
export class ClientLevelTestController {
  constructor(
    private readonly clientLevelTestService: ClientLevelTestService,
  ) {}

  @Public()
  @Get('all-level-tests')
  @ApiQuery({ name: 'categoryId', required: false })
  getAllLevelTests(@Query('categoryId') categoryId?: string) {
    return this.clientLevelTestService.getAllLevelTests(categoryId);
  }

  @Public()
  @Get('level-test-detail/:id')
  getLevelTestDetail(@Param('id') id: string) {
    return this.clientLevelTestService.getLevelTestDetail(id);
  }
}
