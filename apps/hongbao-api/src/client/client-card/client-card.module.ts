import { Module } from '@nestjs/common';
import { ClientCardService } from './client-card.service';
import { ClientCardController } from './client-card.controller';

@Module({
  controllers: [ClientCardController],
  providers: [ClientCardService],
})
export class ClientCardModule {}
