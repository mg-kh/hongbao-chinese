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
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';
import { MockTestsService } from './mock-tests.service';

@ApiTags('Dashboard - Mock Test')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN, Role.TEACHER)
@Controller('dashboard/mock-test')
export class MockTestsController {
  constructor(private readonly mockTestsService: MockTestsService) {}

  @Post()
  create(@Body() createMockTestDto: CreateMockTestDto) {
    return this.mockTestsService.create(createMockTestDto);
  }

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.mockTestsService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mockTestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMockTestDto: UpdateMockTestDto,
  ) {
    return this.mockTestsService.update(id, updateMockTestDto);
  }

  @Post(':id/quiz')
  createQuiz(@Param('id') id: string, @Body() createQuizDto: CreateQuizDto) {
    return this.mockTestsService.createQuiz(id, createQuizDto);
  }

  @Get(':id/quiz')
  getQuizzes(@Param('id') id: string) {
    return this.mockTestsService.getQuizzes(id);
  }

  @Get(':id/quiz/:quizId')
  findOneQuiz(@Param('id') id: string, @Param('quizId') quizId: string) {
    return this.mockTestsService.findOneQuiz(id, quizId);
  }

  @Patch(':id/quiz/:quizId')
  updateQuiz(
    @Param('id') id: string,
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.mockTestsService.updateQuiz(id, quizId, updateQuizDto);
  }

  @Delete(':id/quiz/:quizId')
  removeQuiz(@Param('id') id: string, @Param('quizId') quizId: string) {
    return this.mockTestsService.removeQuiz(id, quizId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mockTestsService.remove(id);
  }
}
