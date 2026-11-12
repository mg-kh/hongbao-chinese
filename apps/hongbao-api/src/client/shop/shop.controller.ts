import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/auth-public.decorator';
import { ShopService } from './shop.service';
import { FilterShopDto } from './dto/filter-shop.dto';

@ApiTags('# Client - Shop')
@ApiBearerAuth('access-token')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Public()
  @Get('all-products')
  getAllProducts(@Query() query: FilterShopDto) {
    return this.shopService.getAllProducts(query);
  }

  @Public()
  @Get('product-overview')
  getProductOverview() {
    return this.shopService.getProductOverview();
  }
}
