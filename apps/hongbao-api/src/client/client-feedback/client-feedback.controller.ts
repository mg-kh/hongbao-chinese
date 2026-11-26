import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ClientFeedbackService } from './client-feedback.service';

@ApiTags('# Client - Feedback')
@Controller()
export class ClientFeedbackController {
  constructor(private readonly clientFeedbackService: ClientFeedbackService) {}

  @Public()
  @Get('all-feedbacks')
  findAll() {
    return this.clientFeedbackService.findAll();
  }
}
