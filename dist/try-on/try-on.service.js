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
exports.TryOnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const try_on_result_entity_1 = require("./entities/try-on-result.entity");
let TryOnService = class TryOnService {
    tryOnResultsRepository;
    constructor(tryOnResultsRepository) {
        this.tryOnResultsRepository = tryOnResultsRepository;
    }
    async generate(user, dto) {
        const originalImageUrl = `data:image/jpeg;base64,${dto.photo.substring(0, 50)}...`;
        const resultImageUrl = `https://placehold.co/512x512?text=Try-On+Result`;
        const result = this.tryOnResultsRepository.create({
            user,
            product_id: dto.productId,
            original_image_url: originalImageUrl,
            result_image_url: resultImageUrl,
            is_saved: false,
        });
        return this.tryOnResultsRepository.save(result);
    }
    async getResults(user) {
        return this.tryOnResultsRepository.find({
            where: { user: { id: user.id } },
            order: { created_at: 'DESC' },
        });
    }
};
exports.TryOnService = TryOnService;
exports.TryOnService = TryOnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(try_on_result_entity_1.TryOnResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TryOnService);
//# sourceMappingURL=try-on.service.js.map