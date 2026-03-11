import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  private async getOrCreateCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });
    if (!cart) {
      cart = this.cartRepository.create({ user, items: [] });
      cart = await this.cartRepository.save(cart);
    }
    return cart;
  }

  async getCart(user: User) {
    const cart = await this.getOrCreateCart(user);
    return { items: cart.items };
  }

  async addItem(user: User, itemData: Partial<CartItem>) {
    const cart = await this.getOrCreateCart(user);
    const item = this.cartItemRepository.create({ ...itemData, cart });
    await this.cartItemRepository.save(item);
    const updated = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items'],
    });
    return { items: updated!.items };
  }

  async updateItem(user: User, itemId: string, quantity: number) {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');
    item.quantity = quantity;
    await this.cartItemRepository.save(item);
    const updated = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items'],
    });
    return { items: updated!.items };
  }

  async removeItem(user: User, itemId: string) {
    const cart = await this.getOrCreateCart(user);
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartItemRepository.remove(item);
    const updated = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items'],
    });
    return { items: updated!.items };
  }

  async clearCart(user: User): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });
    if (cart && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }
  }
}
