import { PartialType } from '@nestjs/mapped-types';
import { CreateSubLessonDto } from './create-sub_lesson.dto';

export class UpdateSubLessonDto extends PartialType(CreateSubLessonDto) {}
