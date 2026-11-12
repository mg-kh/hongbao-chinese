import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PurchaseApproveDto } from './dto/purchase-approve.dto';
import { PurchasePaginationDto } from './dto/purchase-pagination.dto';
import { PurchasesService } from './purchases.service';

@ApiTags('Dashboard - Purchases')
@ApiBearerAuth('access-token')
@Controller('dashboard/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('list')
  getPurchaseList() {
    return this.purchasesService.getPurchaseList();
  }

  @Get('pending-approved')
  getAllPendingApprovedCourse(@Query() query: PurchasePaginationDto) {
    return this.purchasesService.getAllPendingApprovedCourse(query);
  }

  @Post('purchase-approve')
  purchaseApprove(@Body() data: PurchaseApproveDto) {
    return this.purchasesService.purchaseApprove(data);
  }

  @Get('approved')
  getAllApprovedCourse(@Query() query: PurchasePaginationDto) {
    return this.purchasesService.getAllApprovedCourse(query);
  }
}
