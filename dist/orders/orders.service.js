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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    constructor(ordersRepository) {
        this.ordersRepository = ordersRepository;
    }
    async findAll(user) {
        const orders = await this.ordersRepository.find({
            where: { user: { id: user.id } },
            relations: ['items'],
            order: { created_at: 'DESC' },
        });
        return orders.map((o) => ({
            id: o.id,
            order_number: o.order_number,
            item_count: o.items.length,
            total: o.total,
            status: o.status,
            created_at: o.created_at,
            first_item_image: o.items[0]?.product_image ?? null,
            first_item_name: o.items[0]?.product_name ?? null,
        }));
    }
    async findOne(user, orderId) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId, user: { id: user.id } },
            relations: ['items'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return {
            id: order.id,
            order_number: order.order_number,
            status: order.status,
            subtotal: order.subtotal,
            shipping_cost: order.shipping_cost,
            total: order.total,
            payment_method: order.payment_method,
            shipping_courier: order.shipping_courier,
            shipping_service: order.shipping_service,
            receiver_name: order.receiver_name,
            address: order.address,
            phone: order.phone,
            created_at: order.created_at,
            items: order.items.map((i) => ({
                product_id: i.product_id,
                product_name: i.product_name,
                quantity: i.quantity,
                price: i.price,
                size: i.size,
                color: i.color,
                product_image: i.product_image ?? null,
            })),
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map