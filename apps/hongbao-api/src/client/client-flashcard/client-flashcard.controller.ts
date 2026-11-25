import { Controller, Get, Param, Query } from '@nestjs/common';
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
    return this.clientFlashcardService.findAll(query);
  }

  @Public()
  @Get('all-flashcards/:id')
  findOne(@Param('id') id: string) {
    return this.clientFlashcardService.findOne(id);
  }
}
