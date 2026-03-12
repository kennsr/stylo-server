import { Controller, Get, Post, Body, Param, Delete, ConflictException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist items' })
  getWishlist(@CurrentUser() user: User) {
    return this.wishlistService.getWishlist(user);
  }

  @Post()
  @ApiOperation({ summary: 'Add a product to wishlist' })
  async addToWishlist(@CurrentUser() user: User, @Body() dto: AddToWishlistDto) {
    try {
      return await this.wishlistService.addToWishlist(user, dto);
    } catch (e: any) {
      if (e.code === '23505') {
         // Unique violation constraint in PostgreSQL
         throw new ConflictException('Product is already in wishlist');
      }
      throw e;
    }
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove a product from wishlist' })
  removeFromWishlist(
    @CurrentUser() user: User,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(user, productId);
  }
}
