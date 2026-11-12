import { Module } from '@nestjs/common';
import { ClientCategoryService } from './client-category.service';
import { ClientCategoryController } from './client-category.controller';

@Module({
  controllers: [ClientCategoryController],
  providers: [ClientCategoryService],
})
export class ClientCategoryModule {}
