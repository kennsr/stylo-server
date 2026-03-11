import { OrderItem } from './order-item.entity';
import { User } from '../../auth/entities/user.entity';
export declare class Order {
    id: string;
    order_number: string;
    user: User;
    status: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    payment_method: string;
    shipping_courier: string;
    shipping_service: string;
    receiver_name: string;
    address: string;
    phone: string;
    items: OrderItem[];
    created_at: Date;
}
