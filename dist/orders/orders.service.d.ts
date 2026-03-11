import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../auth/entities/user.entity';
export declare class OrdersService {
    private ordersRepository;
    constructor(ordersRepository: Repository<Order>);
    findAll(user: User): Promise<{
        id: string;
        order_number: string;
        item_count: number;
        total: number;
        status: string;
        created_at: Date;
        first_item_image: string;
        first_item_name: string;
    }[]>;
    findOne(user: User, orderId: string): Promise<{
        id: string;
        order_number: string;
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
        created_at: Date;
        items: {
            product_id: string;
            product_name: string;
            quantity: number;
            price: number;
            size: string;
            color: string;
            product_image: string;
        }[];
    }>;
}
