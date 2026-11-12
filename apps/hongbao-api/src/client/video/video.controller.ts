import { Controller, Get, Param, Post } from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { type User } from '@prisma/client';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('# Client - Video')
@ApiBearerAuth('access-token')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('completed')
  getCompleted(@CurrentUser() user: User) {
    return this.videoService.getCompleted(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Post(':id/complete')
  markComplete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.videoService.markComplete(user.id, id);
  }
}
