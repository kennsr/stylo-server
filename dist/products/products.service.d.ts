import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    private reviewsRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>, reviewsRepository: Repository<Review>);
    findAll(query: {
        page?: number;
        pageSize?: number;
        category?: string;
        search?: string;
        featured?: boolean;
    }): Promise<Product[]>;
    count(query: {
        category?: string;
        search?: string;
    }): Promise<number>;
    findOne(id: string): Promise<Product>;
    search(q: string): Promise<Product[]>;
    findAllCategories(): Promise<Category[]>;
    findReviews(productId: string): Promise<Review[]>;
}
