import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ClientCardService } from './client-card.service';
import { FilterClientCardDto } from './dto/filter-client-card.dto';

@ApiTags('# Client - Card')
@ApiBearerAuth('access-token')
@Controller()
export class ClientCardController {
  constructor(private readonly clientCardService: ClientCardService) {}

  @Public()
  @Get('all-cards')
  findAll(@Query() query: FilterClientCardDto) {
    return this.clientCardService.findAll(query);
  }
}
