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
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizToCourseDto } from './dto/quiz-to-course.dto';
import { QuizToLessonDto } from './dto/quiz-to-lesson.dto';
import { QuizToLevelTestDto } from './dto/quiz-to-level-test.dto';
import { QuizToSubLessonDto } from './dto/quiz-to-sub-lesson.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizService } from './quiz.service';

@ApiTags('Dashboard - Quiz')
@ApiBearerAuth('access-token')
// @Roles(Role.ADMIN, Role.TEACHER)
@Controller('dashboard/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get('find-all-quiz-for-attach')
  findAllQuizForAttach() {
    return this.quizService.findAllQuizForAttach();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Post('quiz-to-course')
  addQuizToCourse(@Body() data: QuizToCourseDto) {
    return this.quizService.addQuizToCourse(data);
  }

  @Delete('quiz-to-course')
  removeQuizFromCourse(@Body() data: QuizToCourseDto) {
    return this.quizService.removeQuizFromCourse(data);
  }

  @Post('quiz-to-lesson')
  addQuizToLesson(@Body() data: QuizToLessonDto) {
    return this.quizService.addQuizToLesson(data);
  }

  @Delete('quiz-to-lesson')
  removeQuizFromLesson(@Body() data: QuizToLessonDto) {
    return this.quizService.removeQuizFromLesson(data);
  }

  @Post('quiz-to-sub-lesson')
  addQuizToSubLesson(@Body() data: QuizToSubLessonDto) {
    return this.quizService.addQuizToSubLesson(data);
  }

  @Delete('quiz-to-sub-lesson')
  removeQuizFromSubLesson(@Body() data: QuizToSubLessonDto) {
    return this.quizService.removeQuizFromSubLesson(data);
  }

  @Post('quiz-to-level-test')
  addQuizToLevelTest(@Body() data: QuizToLevelTestDto) {
    return this.quizService.addQuizToLevelTest(data);
  }

  @Delete('quiz-to-level-test')
  removeQuizFromLevelTest(@Body() data: QuizToLevelTestDto) {
    return this.quizService.removeQuizFromLevelTest(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }
}
