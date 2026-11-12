import { Module } from '@nestjs/common';
import { ClientPurchaseService } from './client-purchase.service';
import { ClientPurchaseController } from './client-purchase.controller';

@Module({
  controllers: [ClientPurchaseController],
  providers: [ClientPurchaseService],
})
export class ClientPurchaseModule {}
