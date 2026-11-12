import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { type User } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ClientCouponService } from './client-coupon.service';
import { UseClientCouponDto } from './dto/use-client-coupon.dto';

@ApiTags('# Client - Coupon')
@ApiBearerAuth('access-token')
@Controller('coupon')
export class ClientCouponController {
  constructor(private readonly clientCouponService: ClientCouponService) {}

  @Post('apply')
  create(@CurrentUser() user: User, @Body() data: UseClientCouponDto) {
    return this.clientCouponService.applyCoupon(data, user.id);
  }

  @Delete('apply')
  remove(@CurrentUser() user: User, @Body() data: UseClientCouponDto) {
    return this.clientCouponService.removeCoupon(data, user.id);
  }
}
