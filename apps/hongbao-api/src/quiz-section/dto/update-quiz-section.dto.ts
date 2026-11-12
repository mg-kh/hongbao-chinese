import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizSectionDto } from './create-quiz-section.dto';

export class UpdateQuizSectionDto extends PartialType(CreateQuizSectionDto) {}
