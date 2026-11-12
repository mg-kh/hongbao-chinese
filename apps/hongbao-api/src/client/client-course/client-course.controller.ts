import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ClientCourseService } from './client-course.service';

@ApiTags('# Client - Course')
@ApiBearerAuth('access-token')
@Controller()
export class ClientCourseController {
  constructor(private readonly clientCourseService: ClientCourseService) {}

  @Public()
  @Get('all-courses')
  getAllCourses() {
    return this.clientCourseService.getAllCourses();
  }

  @Public()
  @Get('course-detail/:id')
  getCourseDetail(@Param('id') id: string) {
    return this.clientCourseService.getCourseDetail(id);
  }
}
