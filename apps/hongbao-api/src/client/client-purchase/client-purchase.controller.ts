import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { type User } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ClientPurchaseService } from './client-purchase.service';
import { CreateClientPurchaseDto } from './dto/create-client-purchase.dto';
import { FilterClientEnrollmentDto } from './dto/filter-client-enrollment.dto';
import { FilterClientPurchaseDto } from './dto/filter-client-purchase.dto';

@ApiTags('# Client - Purchase')
@ApiBearerAuth('access-token')
@Controller('purchase')
export class ClientPurchaseController {
  constructor(private readonly clientPurchaseService: ClientPurchaseService) {}

  @Post()
  createPurchase(
    @CurrentUser() user: User,
    @Body() data: CreateClientPurchaseDto,
  ) {
    return this.clientPurchaseService.createPurchase(data, user.id);
  }

  @Get('my-purchases')
  getMyPurchases(
    @CurrentUser() user: User,
    @Query() query: FilterClientPurchaseDto,
  ) {
    return this.clientPurchaseService.getMyPurchases(query, user.id);
  }

  @Get('my-enrollments')
  getMyEnrollments(
    @CurrentUser() user: User,
    @Query() query: FilterClientEnrollmentDto,
  ) {
    return this.clientPurchaseService.getMyEnrollments(query, user.id);
  }

  @Get(':id')
  getPurchaseDetail(@CurrentUser() user: User, @Param('id') id: string) {
    return this.clientPurchaseService.getPurchaseDetail(id, user.id);
  }
}
