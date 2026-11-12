import { Module } from '@nestjs/common';
import { ClientFlashcardService } from './client-flashcard.service';
import { ClientFlashcardController } from './client-flashcard.controller';

@Module({
  controllers: [ClientFlashcardController],
  providers: [ClientFlashcardService],
})
export class ClientFlashcardModule {}
