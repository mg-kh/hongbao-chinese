import { Controller, Get, Param, Post } from '@nestjs/common';
import { ClientLearningProgressService } from './client-learning-progress.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { type User } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('# Client - Learning Progress')
@ApiBearerAuth('access-token')
@Controller('learning-progress')
export class ClientLearningProgressController {
  constructor(
    private readonly clientLearningProgressService: ClientLearningProgressService,
  ) {}

  // ---------- video ----------
  // "completed" routes are declared before ":id" so they aren't captured as ids

  @Get('video/completed')
  getCompletedVideos(@CurrentUser() user: User) {
    return this.clientLearningProgressService.getCompletedVideos(user.id);
  }

  @Get('video/:id')
  findVideo(@Param('id') id: string) {
    return this.clientLearningProgressService.findVideo(id);
  }

  @Post('video/:id/complete')
  markVideoComplete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.clientLearningProgressService.markVideoComplete(user.id, id);
  }

  // ---------- quiz ----------

  @Get('quiz/completed')
  getCompletedQuizzes(@CurrentUser() user: User) {
    return this.clientLearningProgressService.getCompletedQuizzes(user.id);
  }

  @Get('quiz/:id')
  findQuiz(@Param('id') id: string) {
    return this.clientLearningProgressService.findQuiz(id);
  }

  @Post('quiz/:id/complete')
  markQuizComplete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.clientLearningProgressService.markQuizComplete(user.id, id);
  }
}
