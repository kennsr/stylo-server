import { Repository } from 'typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { ShippingOption } from './entities/shipping-option.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../auth/entities/user.entity';
import { PlaceOrderDto } from './dto/checkout.dto';
export declare class CheckoutService {
    private addressesRepository;
    private shippingOptionsRepository;
    private ordersRepository;
    private orderItemsRepository;
    private cartService;
    constructor(addressesRepository: Repository<ShippingAddress>, shippingOptionsRepository: Repository<ShippingOption>, ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, cartService: CartService);
    getAddresses(user: User): Promise<ShippingAddress[]>;
    getShippingRates(_addressId: string, _weight: number): Promise<ShippingOption[]>;
    getPaymentMethods(): {
        id: string;
        name: string;
        provider: string;
    }[];
    placeOrder(user: User, dto: PlaceOrderDto): Promise<Order>;
}
