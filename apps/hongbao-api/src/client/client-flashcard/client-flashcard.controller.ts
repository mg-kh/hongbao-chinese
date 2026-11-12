import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ClientFlashcardService } from './client-flashcard.service';
import { FilterClientFlashcardDto } from './dto/filter-client-flashcard.dto';

@ApiTags('# Client - Flashcard')
@ApiBearerAuth('access-token')
@Controller()
export class ClientFlashcardController {
  constructor(
    private readonly clientFlashcardService: ClientFlashcardService,
  ) {}

  @Public()
  @Get('all-flashcards')
  findAll(@Query() query: FilterClientFlashcardDto) {
    return this.clientFlashcardService.findAll(query.categoryId);
  }
}
