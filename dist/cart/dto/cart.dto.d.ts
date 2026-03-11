export declare class AddCartItemDto {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    discount_price?: number;
}
export declare class UpdateCartItemDto {
    quantity: number;
}
