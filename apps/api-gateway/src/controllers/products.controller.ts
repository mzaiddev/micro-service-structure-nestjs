import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public, Role, Roles } from '@app/common';
import { JwtAuthGuard, RolesGuard } from '@app/auth';

import { CreateProductDto } from '../dto/products/create-product.dto';
import { ListProductsDto } from '../dto/products/list-products.dto';
import { ProductsGatewayService } from '../services/products-gateway.service';

@ApiTags('products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsGatewayService: ProductsGatewayService) {}

  @Public()
  @Get()
  list(@Query() query: ListProductsDto) {
    return this.productsGatewayService.list(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsGatewayService.create(dto);
  }
}
