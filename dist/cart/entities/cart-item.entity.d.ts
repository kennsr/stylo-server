import { Cart } from './cart.entity';
export declare class CartItem {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    discount_price: number;
    cart: Cart;
}
