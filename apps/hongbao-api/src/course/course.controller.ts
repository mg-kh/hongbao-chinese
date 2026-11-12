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
import { Role, type User } from '@prisma/client';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../role/role.decorator';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
@ApiTags('Dashboard - Course')
@ApiBearerAuth('access-token')
@Controller('dashboard/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@CurrentUser() user: User, @Body() data: CreateCourseDto) {
    return this.courseService.create(data, user?.id);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateCourseDto,
  ) {
    return this.courseService.update(id, data, user?.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
