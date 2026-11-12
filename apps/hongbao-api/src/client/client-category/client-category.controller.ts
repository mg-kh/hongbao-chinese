import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ClientCategoryService } from './client-category.service';

@ApiTags('# Client - Category')
@ApiBearerAuth('access-token')
@Controller()
export class ClientCategoryController {
  constructor(private readonly clientCategoryService: ClientCategoryService) {}

  @Public()
  @Get('all-categories')
  findAll() {
    return this.clientCategoryService.findAll();
  }
}
