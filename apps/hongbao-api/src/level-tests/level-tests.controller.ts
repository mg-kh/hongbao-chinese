import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateQuizDto } from '../quiz/dto/create-quiz.dto';
import { UpdateQuizDto } from '../quiz/dto/update-quiz.dto';
import { Roles } from '../role/role.decorator';
import { CreateLevelTestDto } from './dto/create-level-test.dto';
import { UpdateLevelTestDto } from './dto/update-level-test.dto';
import { LevelTestsService } from './level-tests.service';

@ApiTags('Dashboard - Level Test')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN, Role.TEACHER)
@Controller('dashboard/level-test')
export class LevelTestsController {
  constructor(private readonly levelTestsService: LevelTestsService) {}

  @Post()
  create(@Body() createLevelTestDto: CreateLevelTestDto) {
    return this.levelTestsService.create(createLevelTestDto);
  }

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.levelTestsService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelTestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLevelTestDto: UpdateLevelTestDto,
  ) {
    return this.levelTestsService.update(id, updateLevelTestDto);
  }

  @Post(':id/quiz')
  createQuiz(@Param('id') id: string, @Body() createQuizDto: CreateQuizDto) {
    return this.levelTestsService.createQuiz(id, createQuizDto);
  }

  @Get(':id/quiz')
  getQuizzes(@Param('id') id: string) {
    return this.levelTestsService.getQuizzes(id);
  }

  @Get(':id/quiz/:quizId')
  findOneQuiz(@Param('id') id: string, @Param('quizId') quizId: string) {
    return this.levelTestsService.findOneQuiz(id, quizId);
  }

  @Patch(':id/quiz/:quizId')
  updateQuiz(
    @Param('id') id: string,
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.levelTestsService.updateQuiz(id, quizId, updateQuizDto);
  }

  @Delete(':id/quiz/:quizId')
  removeQuiz(@Param('id') id: string, @Param('quizId') quizId: string) {
    return this.levelTestsService.removeQuiz(id, quizId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelTestsService.remove(id);
  }
}
