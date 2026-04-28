import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MESSAGE_PATTERNS } from '@app/messaging';

import { CreateProductCommandDto } from '../dto/create-product-command.dto';
import { ListProductsCommandDto } from '../dto/list-products-command.dto';
import { ReserveStockCommandDto } from '../dto/reserve-stock-command.dto';
import { ProductDomainService } from '../services/product-domain.service';

@Controller()
export class ProductMessageController {
  constructor(private readonly productDomainService: ProductDomainService) {}

  @MessagePattern(MESSAGE_PATTERNS.products.create)
  create(@Payload() dto: CreateProductCommandDto) {
    return this.productDomainService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERNS.products.list)
  list(@Payload() query: ListProductsCommandDto) {
    return this.productDomainService.list(query);
  }

  @MessagePattern(MESSAGE_PATTERNS.products.getById)
  getById(@Payload() payload: { productId: string }) {
    return this.productDomainService.getById(payload.productId);
  }

  @MessagePattern(MESSAGE_PATTERNS.products.getByIds)
  getByIds(@Payload() payload: { productIds: string[] }) {
    return this.productDomainService.getByIds(payload.productIds);
  }

  @MessagePattern(MESSAGE_PATTERNS.products.reserveStock)
  reserveStock(@Payload() dto: ReserveStockCommandDto) {
    return this.productDomainService.reserveStock(dto);
  }
}
