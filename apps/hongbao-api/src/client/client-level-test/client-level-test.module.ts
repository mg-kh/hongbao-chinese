import { Module } from '@nestjs/common';
import { ClientLevelTestController } from './client-level-test.controller';
import { ClientLevelTestService } from './client-level-test.service';

@Module({
  controllers: [ClientLevelTestController],
  providers: [ClientLevelTestService],
})
export class ClientLevelTestModule {}
