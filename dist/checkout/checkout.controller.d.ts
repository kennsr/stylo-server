import { CheckoutService } from './checkout.service';
import { User } from '../auth/entities/user.entity';
import { PlaceOrderDto } from './dto/checkout.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    getAddresses(user: User): Promise<import("./entities/shipping-address.entity").ShippingAddress[]>;
    getShippingRates(addressId: string, weight: string): Promise<import("./entities/shipping-option.entity").ShippingOption[]>;
    placeOrder(user: User, dto: PlaceOrderDto): Promise<import("../orders/entities/order.entity").Order>;
}
