import { Module } from '@nestjs/common';
import { LevelTestsService } from './level-tests.service';
import { LevelTestsController } from './level-tests.controller';

@Module({
  controllers: [LevelTestsController],
  providers: [LevelTestsService],
})
export class LevelTestsModule {}
