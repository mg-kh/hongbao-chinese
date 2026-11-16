import { Module } from '@nestjs/common';
import { ClientMockTestController } from './client-mock-test.controller';
import { ClientMockTestService } from './client-mock-test.service';

@Module({
  controllers: [ClientMockTestController],
  providers: [ClientMockTestService],
})
export class ClientMockTestModule {}
