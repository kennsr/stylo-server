import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepository: Repository<WishlistItem>,
  ) {}

  async getWishlist(user: User) {
    return this.wishlistRepository.find({
      where: { user: { id: user.id } },
      order: { added_at: 'DESC' },
    });
  }

  async addToWishlist(user: User, dto: AddToWishlistDto) {
    const item = this.wishlistRepository.create({
      user,
      product_id: dto.product_id,
    });
    return this.wishlistRepository.save(item);
  }

  async removeFromWishlist(user: User, productId: string) {
    const result = await this.wishlistRepository.delete({
      user: { id: user.id },
      product_id: productId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Product not found in wishlist');
    }
    return { success: true };
  }
}
