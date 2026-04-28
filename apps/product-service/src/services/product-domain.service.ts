import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { RedisService } from '@app/cache';
import { buildPaginationMeta } from '@app/utils';

import { CreateProductCommandDto } from '../dto/create-product-command.dto';
import { ListProductsCommandDto } from '../dto/list-products-command.dto';
import { ReserveStockCommandDto } from '../dto/reserve-stock-command.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductDomainService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly redisService: RedisService,
  ) {}

  async create(dto: CreateProductCommandDto) {
    const product = this.productRepository.create(dto);
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async list(query: ListProductsCommandDto) {
    const cacheKey = `product-list:${JSON.stringify(query)}`;
    const cached = await this.redisService.get<unknown>(cacheKey);

    if (cached) {
      return cached;
    }

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }

    if (query.tag) {
      where.tags = ILike(`%${query.tag}%`);
    }

    const [items, total] = await this.productRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const response = {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };

    await this.redisService.set(cacheKey, response, 60);
    return response;
  }

  async getById(productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getByIds(productIds: string[]) {
    return this.productRepository.find({
      where: { id: In(productIds) },
    });
  }

  async reserveStock(dto: ReserveStockCommandDto) {
    return this.productRepository.manager.transaction(async (transactionManager) => {
      const reservedProducts: ProductEntity[] = [];

      for (const item of dto.items) {
        const product = await transactionManager.findOne(ProductEntity, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }

        product.stock -= item.quantity;
        reservedProducts.push(await transactionManager.save(ProductEntity, product));
      }

      return reservedProducts;
    });
  }
}
