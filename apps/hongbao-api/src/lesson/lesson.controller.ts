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
import { CreateLessonDto } from './dto/create-lesson.dto';
import { FilterLessonDto } from './dto/filter-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonService } from './lesson.service';
@ApiTags('Dashboard - Lesson')
@ApiBearerAuth('access-token')
// @Roles(Role.ADMIN, Role.TEACHER)
@Controller('dashboard/lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  create(@Body() data: CreateLessonDto) {
    return this.lessonService.create(data);
  }

  @Get()
  findAll(@Query() query: FilterLessonDto) {
    return this.lessonService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateLessonDto) {
    return this.lessonService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
