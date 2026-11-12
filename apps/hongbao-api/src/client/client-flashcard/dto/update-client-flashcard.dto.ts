import { PartialType } from '@nestjs/swagger';
import { CreateClientFlashcardDto } from './create-client-flashcard.dto';

export class UpdateClientFlashcardDto extends PartialType(
  CreateClientFlashcardDto,
) {}
