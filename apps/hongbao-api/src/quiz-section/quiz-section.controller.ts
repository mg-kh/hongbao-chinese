import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateQuizSectionDto } from './dto/create-quiz-section.dto';
import { UpdateQuizSectionDto } from './dto/update-quiz-section.dto';
import { QuizSectionService } from './quiz-section.service';

@ApiTags('Dashboard - Quiz Section')
@ApiBearerAuth('access-token')
@Controller('dashboard/quiz-section')
export class QuizSectionController {
  constructor(private readonly quizSectionService: QuizSectionService) {}

  @Post()
  create(@Body() createQuizSectionDto: CreateQuizSectionDto) {
    return this.quizSectionService.create(createQuizSectionDto);
  }

  @Get('quiz/:quizId/section/:sectionId')
  findOne(
    @Param('quizId') quizId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.quizSectionService.findOne(quizId, sectionId);
  }

  @Patch('quiz/:quizId/section/:sectionId')
  update(
    @Param('quizId') quizId: string,
    @Param('sectionId') sectionId: string,
    @Body() updateQuizSectionDto: UpdateQuizSectionDto,
  ) {
    return this.quizSectionService.update(
      quizId,
      sectionId,
      updateQuizSectionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizSectionService.remove(id);
  }
}
