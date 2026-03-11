import { Product } from './product.entity';
export declare class Review {
    id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    rating: number;
    comment: string;
    created_at: Date;
    images: string[];
    product: Product;
}
