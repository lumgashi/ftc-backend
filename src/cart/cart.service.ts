import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { REQUEST } from '@nestjs/core';
import { RequestWithUser } from 'src/utils/types';
import { Cart, User } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: RequestWithUser,
  ) {}
  @OnEvent('user.created')
  async create(user: User): Promise<Cart> {
    try {
      const cart: Cart = await this.prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
      return cart;
    } catch (error) {
      throw new InternalServerErrorException(
        'Could not create cart',
        error.message,
      );
    }
  }

  async findOne(id: string): Promise<Cart> {
    try {
      const cart: Cart = await this.prisma.cart.findUnique({
        where: {
          id,
        },
      });
      if (!cart) {
        throw new InternalServerErrorException('Cart not found');
      }

      const userId = this.request.user.id;
      if (cart.userId !== userId) {
        throw new InternalServerErrorException(
          'You do not have permission to access this resource',
        );
      }
      return cart;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }
}
