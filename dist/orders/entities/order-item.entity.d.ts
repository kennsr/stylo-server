import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    product_image: string;
    order: Order;
}
