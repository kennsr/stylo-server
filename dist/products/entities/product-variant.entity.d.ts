import { Product } from './product.entity';
export declare class ProductVariant {
    id: string;
    size: string;
    color: string;
    stock: number;
    additional_price: number | null;
    product: Product;
}
