import { User } from '../../auth/entities/user.entity';
import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: string;
    user: User;
    items: CartItem[];
}
