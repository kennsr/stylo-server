import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async findAll(query: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants');

    if (query.category) {
      qb.andWhere('product.category = :category', { category: query.category });
    }
    if (query.search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
    if (query.featured !== undefined) {
      qb.andWhere('product.is_featured = :featured', { featured: query.featured });
    }

    qb.skip((page - 1) * pageSize).take(pageSize);
    return qb.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['variants'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async search(q: string) {
    return this.productsRepository.find({
      where: [{ name: ILike(`%${q}%`) }, { description: ILike(`%${q}%`) }],
      relations: ['variants'],
    });
  }

  findAllCategories() {
    return this.categoriesRepository.find();
  }

  async findReviews(productId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.reviewsRepository.find({ where: { product: { id: productId } } });
  }
}
