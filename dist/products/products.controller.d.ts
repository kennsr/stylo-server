import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getCategories(): Promise<import("./entities/category.entity").Category[]>;
    search(q: string): Promise<import("./entities/product.entity").Product[]>;
    getCount(category?: string, search?: string): Promise<{
        message: string;
        data: {
            total: number;
        };
    }>;
    findAll(page?: number, pageSize?: number, category?: string, search?: string, featured?: string): Promise<import("./entities/product.entity").Product[]>;
    getReviews(id: string): Promise<import("./entities/review.entity").Review[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
}
