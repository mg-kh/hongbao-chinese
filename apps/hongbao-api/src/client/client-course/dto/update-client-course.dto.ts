import { PartialType } from '@nestjs/swagger';
import { CreateClientCourseDto } from './create-client-course.dto';

export class UpdateClientCourseDto extends PartialType(CreateClientCourseDto) {}
