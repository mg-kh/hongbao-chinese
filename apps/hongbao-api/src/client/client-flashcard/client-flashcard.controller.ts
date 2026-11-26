import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { type User } from '@prisma/client';
import { Public } from '../../auth/auth-public.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
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

  @Get('my-flashcards')
  findMine(@CurrentUser() user: User) {
    return this.clientFlashcardService.findMine(user.id);
  }

  @Get('my-flashcards/:id')
  findMineOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.clientFlashcardService.findMineOne(id, user.id);
  }

  @Public()
  @Get('all-flashcards/:id')
  findOne(@Param('id') id: string) {
    return this.clientFlashcardService.findOne(id);
  }
}
