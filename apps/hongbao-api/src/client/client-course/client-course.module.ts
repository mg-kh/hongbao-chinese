import { Module } from '@nestjs/common';
import { ClientCourseController } from './client-course.controller';
import { ClientCourseService } from './client-course.service';

@Module({
  controllers: [ClientCourseController],
  providers: [ClientCourseService],
})
export class ClientCourseModule {}
