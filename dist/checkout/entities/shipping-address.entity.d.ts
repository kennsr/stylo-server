import { User } from '../../auth/entities/user.entity';
export declare class ShippingAddress {
    id: string;
    user: User;
    receiver_name: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
    label: string;
}
