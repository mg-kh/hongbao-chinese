import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ClientMockTestService } from './client-mock-test.service';

@ApiTags('# Client - Mock Test')
@ApiBearerAuth('access-token')
@Controller()
export class ClientMockTestController {
  constructor(
    private readonly clientMockTestService: ClientMockTestService,
  ) {}

  @Public()
  @Get('all-mock-tests')
  @ApiQuery({ name: 'categoryId', required: false })
  getAllMockTests(@Query('categoryId') categoryId?: string) {
    return this.clientMockTestService.getAllMockTests(categoryId);
  }

  @Public()
  @Get('mock-test-detail/:id')
  getMockTestDetail(@Param('id') id: string) {
    return this.clientMockTestService.getMockTestDetail(id);
  }
}
