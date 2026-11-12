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
import { CreateSubLessonDto } from './dto/create-sub_lesson.dto';
import { FilterSubLessonDto } from './dto/filter-sub_lesson.dto';
import { UpdateSubLessonDto } from './dto/update-sub_lesson.dto';
import { SubLessonService } from './sub_lesson.service';
@ApiTags('Dashboard - Sub Lesson')
@ApiBearerAuth('access-token')
// @Roles(Role.ADMIN, Role.TEACHER)
@Controller('dashboard/sub-lesson')
export class SubLessonController {
  constructor(private readonly subLessonService: SubLessonService) {}

  @Post()
  create(@Body() data: CreateSubLessonDto) {
    return this.subLessonService.create(data);
  }

  @Get()
  findAll(@Query() query: FilterSubLessonDto) {
    return this.subLessonService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subLessonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateSubLessonDto) {
    return this.subLessonService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subLessonService.remove(id);
  }
}
