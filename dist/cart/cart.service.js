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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    constructor(cartRepository, cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }
    async getOrCreateCart(user) {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['items'],
        });
        if (!cart) {
            cart = this.cartRepository.create({ user, items: [] });
            cart = await this.cartRepository.save(cart);
        }
        return cart;
    }
    async getCart(user) {
        const cart = await this.getOrCreateCart(user);
        return { items: cart.items };
    }
    async addItem(user, itemData) {
        const cart = await this.getOrCreateCart(user);
        const item = this.cartItemRepository.create({ ...itemData, cart });
        await this.cartItemRepository.save(item);
        const updated = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['items'],
        });
        return { items: updated.items };
    }
    async updateItem(user, itemId, quantity) {
        const cart = await this.getOrCreateCart(user);
        const item = cart.items.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        item.quantity = quantity;
        await this.cartItemRepository.save(item);
        const updated = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['items'],
        });
        return { items: updated.items };
    }
    async removeItem(user, itemId) {
        const cart = await this.getOrCreateCart(user);
        const item = cart.items.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        await this.cartItemRepository.remove(item);
        const updated = await this.cartRepository.findOne({
            where: { id: cart.id },
            relations: ['items'],
        });
        return { items: updated.items };
    }
    async clearCart(user) {
        const cart = await this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['items'],
        });
        if (cart && cart.items.length > 0) {
            await this.cartItemRepository.remove(cart.items);
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map