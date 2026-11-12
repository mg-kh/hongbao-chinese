import { Controller, Get, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('# Client - quiz')
@ApiBearerAuth('access-token')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }
}
