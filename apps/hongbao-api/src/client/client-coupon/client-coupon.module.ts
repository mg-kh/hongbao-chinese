import { Module } from '@nestjs/common';
import { ClientCouponService } from './client-coupon.service';
import { ClientCouponController } from './client-coupon.controller';

@Module({
  controllers: [ClientCouponController],
  providers: [ClientCouponService],
})
export class ClientCouponModule {}
