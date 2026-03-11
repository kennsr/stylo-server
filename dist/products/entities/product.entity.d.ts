import { ProductVariant } from './product-variant.entity';
import { Review } from './review.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_price: number;
    category: string;
    images: string[];
    variants: ProductVariant[];
    reviews: Review[];
    rating: number;
    review_count: number;
    stock: number;
    is_featured: boolean;
    has_ai_try_on: boolean;
    created_at: Date;
    updated_at: Date;
}
