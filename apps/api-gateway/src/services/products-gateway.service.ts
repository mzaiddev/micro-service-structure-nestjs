import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { MESSAGE_PATTERNS, SERVICE_REGISTRY } from '@app/messaging';

import { CreateProductDto } from '../dto/products/create-product.dto';
import { ListProductsDto } from '../dto/products/list-products.dto';

@Injectable()
export class ProductsGatewayService {
  constructor(
    @Inject(SERVICE_REGISTRY.PRODUCT.token) private readonly productClient: ClientProxy,
  ) {}

  async create(dto: CreateProductDto) {
    return lastValueFrom(this.productClient.send(MESSAGE_PATTERNS.products.create, dto));
  }

  async list(query: ListProductsDto) {
    return lastValueFrom(this.productClient.send(MESSAGE_PATTERNS.products.list, query));
  }
}
