import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestWithUser } from 'src/utils/types';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: RequestWithUser,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const productDetails =
        createProductDto.productDetails as Prisma.JsonValue;
      const product: Product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          category: {
            connect: {
              id: createProductDto.category,
            },
          },
          productDetails,
        },
      });
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const allProducts = await this.prisma.product.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return allProducts;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product: Product = await this.prisma.product.findUnique({
        where: {
          id,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} ${updateProductDto} product`;
  }

  async remove(id: string): Promise<Product> {
    try {
      const product: Product = await this.prisma.product.delete({
        where: {
          id,
        },
      });
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
