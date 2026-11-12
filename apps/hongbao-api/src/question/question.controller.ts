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
import { Role, type User } from '@prisma/client';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../role/role.decorator';
import { FilterQuestionDto } from './dto/filter-question.dto';

@ApiTags('Dashboard - Question')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN, Role.TEACHER)
@Controller('dashboard/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.create(createQuestionDto, user.id);
  }

  @Get()
  findAll(@Query() query: FilterQuestionDto) {
    return this.questionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionService.update(id, updateQuestionDto, user?.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
