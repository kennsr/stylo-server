import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../auth/entities/user.entity';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>);
    private getOrCreateCart;
    getCart(user: User): Promise<{
        items: CartItem[];
    }>;
    addItem(user: User, itemData: Partial<CartItem>): Promise<{
        items: CartItem[];
    }>;
    updateItem(user: User, itemId: string, quantity: number): Promise<{
        items: CartItem[];
    }>;
    removeItem(user: User, itemId: string): Promise<{
        items: CartItem[];
    }>;
    clearCart(user: User): Promise<void>;
}
