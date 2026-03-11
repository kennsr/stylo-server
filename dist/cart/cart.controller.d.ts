import { CartService } from './cart.service';
import { User } from '../auth/entities/user.entity';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: User): Promise<{
        items: import("./entities/cart-item.entity").CartItem[];
    }>;
    addItem(user: User, dto: AddCartItemDto): Promise<{
        items: import("./entities/cart-item.entity").CartItem[];
    }>;
    updateItem(user: User, itemId: string, dto: UpdateCartItemDto): Promise<{
        items: import("./entities/cart-item.entity").CartItem[];
    }>;
    removeItem(user: User, itemId: string): Promise<{
        items: import("./entities/cart-item.entity").CartItem[];
    }>;
}
