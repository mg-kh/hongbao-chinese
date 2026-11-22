import { Module } from '@nestjs/common';
import { ClientLearningProgressService } from './client-learning-progress.service';
import { ClientLearningProgressController } from './client-learning-progress.controller';

@Module({
  controllers: [ClientLearningProgressController],
  providers: [ClientLearningProgressService],
})
export class ClientLearningProgressModule {}
