import { Module } from '@nestjs/common';
import { QuizSectionService } from './quiz-section.service';
import { QuizSectionController } from './quiz-section.controller';

@Module({
  controllers: [QuizSectionController],
  providers: [QuizSectionService],
})
export class QuizSectionModule {}
