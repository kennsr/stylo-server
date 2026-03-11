"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("./entities/category.entity");
const review_entity_1 = require("./entities/review.entity");
let ProductsService = class ProductsService {
    productsRepository;
    categoriesRepository;
    reviewsRepository;
    constructor(productsRepository, categoriesRepository, reviewsRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.reviewsRepository = reviewsRepository;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const qb = this.productsRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.variants', 'variants');
        if (query.category) {
            qb.andWhere('product.category = :category', { category: query.category });
        }
        if (query.search) {
            qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query.featured !== undefined) {
            qb.andWhere('product.is_featured = :featured', { featured: query.featured });
        }
        qb.skip((page - 1) * pageSize).take(pageSize);
        return qb.getMany();
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['variants'],
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async search(q) {
        return this.productsRepository.find({
            where: [{ name: (0, typeorm_2.ILike)(`%${q}%`) }, { description: (0, typeorm_2.ILike)(`%${q}%`) }],
            relations: ['variants'],
        });
    }
    findAllCategories() {
        return this.categoriesRepository.find();
    }
    async findReviews(productId) {
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.reviewsRepository.find({ where: { product: { id: productId } } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map