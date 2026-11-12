import { Module } from '@nestjs/common';
import { SubLessonController } from './sub_lesson.controller';
import { SubLessonService } from './sub_lesson.service';

@Module({
  controllers: [SubLessonController],
  providers: [SubLessonService],
})
export class SubLessonModule {}
