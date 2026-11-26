import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RevenueQueryDto } from './dto/revenue-query.dto';
import { RevenueService } from './revenue.service';

@ApiTags('Dashboard - Revenue')
@ApiBearerAuth('access-token')
@Controller('dashboard/revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  getRevenue(@Query() query: RevenueQueryDto) {
    return this.revenueService.getRevenue(query);
  }
}
