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
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shipping_address_entity_1 = require("./entities/shipping-address.entity");
const shipping_option_entity_1 = require("./entities/shipping-option.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const cart_service_1 = require("../cart/cart.service");
let CheckoutService = class CheckoutService {
    addressesRepository;
    shippingOptionsRepository;
    ordersRepository;
    orderItemsRepository;
    cartService;
    constructor(addressesRepository, shippingOptionsRepository, ordersRepository, orderItemsRepository, cartService) {
        this.addressesRepository = addressesRepository;
        this.shippingOptionsRepository = shippingOptionsRepository;
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.cartService = cartService;
    }
    async getAddresses(user) {
        return this.addressesRepository.find({
            where: { user: { id: user.id } },
        });
    }
    async getShippingRates(_addressId, _weight) {
        return this.shippingOptionsRepository.find();
    }
    getPaymentMethods() {
        return [
            { id: 'cc', name: 'Credit Card', provider: 'Stripe' },
            { id: 'gopay', name: 'GoPay', provider: 'Midtrans' },
            { id: 'ovo', name: 'OVO', provider: 'Midtrans' },
            { id: 'qris', name: 'QRIS', provider: 'Midtrans' },
            { id: 'bca_va', name: 'BCA Virtual Account', provider: 'Midtrans' },
            { id: 'cod', name: 'Cash on Delivery', provider: 'Internal' },
        ];
    }
    async placeOrder(user, dto) {
        const address = await this.addressesRepository.findOne({
            where: { id: dto.address_id, user: { id: user.id } },
        });
        if (!address)
            throw new common_1.NotFoundException('Shipping address not found');
        const shippingOption = await this.shippingOptionsRepository.findOne({
            where: { id: dto.shipping_option_id },
        });
        if (!shippingOption)
            throw new common_1.NotFoundException('Shipping option not found');
        const cart = await this.cartService.getCart(user);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const subtotal = cart.items.reduce((sum, item) => sum + (item.discount_price ?? item.price) * item.quantity, 0);
        const total = subtotal + shippingOption.cost;
        const order_number = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        const order = this.ordersRepository.create({
            user,
            order_number,
            status: 'pending',
            subtotal,
            shipping_cost: shippingOption.cost,
            total,
            payment_method: dto.payment_method,
            shipping_courier: shippingOption.courier,
            shipping_service: shippingOption.service,
            receiver_name: address.receiver_name,
            address: `${address.street}, ${address.city}, ${address.province} ${address.postal_code}`,
            phone: address.phone,
            items: cart.items.map((item) => this.orderItemsRepository.create({
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color,
                product_image: item.product_image,
            })),
        });
        const saved = await this.ordersRepository.save(order);
        await this.cartService.clearCart(user);
        return saved;
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shipping_address_entity_1.ShippingAddress)),
    __param(1, (0, typeorm_1.InjectRepository)(shipping_option_entity_1.ShippingOption)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cart_service_1.CartService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map