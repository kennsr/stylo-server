import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { ShippingOption } from './entities/shipping-option.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../auth/entities/user.entity';
import { PlaceOrderDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(ShippingAddress)
    private addressesRepository: Repository<ShippingAddress>,
    @InjectRepository(ShippingOption)
    private shippingOptionsRepository: Repository<ShippingOption>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
  ) {}

  async getAddresses(user: User) {
    return this.addressesRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async getShippingRates(_addressId: string, _weight: number) {
    // In production, integrate with a courier API (e.g. RajaOngkir)
    // Return all available shipping options for now
    return this.shippingOptionsRepository.find();
  }

  async placeOrder(user: User, dto: PlaceOrderDto): Promise<Order> {
    const address = await this.addressesRepository.findOne({
      where: { id: dto.address_id, user: { id: user.id } },
    });
    if (!address) throw new NotFoundException('Shipping address not found');

    const shippingOption = await this.shippingOptionsRepository.findOne({
      where: { id: dto.shipping_option_id },
    });
    if (!shippingOption) throw new NotFoundException('Shipping option not found');

    const cart = await this.cartService.getCart(user);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.discount_price ?? item.price) * item.quantity,
      0,
    );
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
      items: cart.items.map((item) =>
        this.orderItemsRepository.create({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          product_image: item.product_image,
        }),
      ),
    });

    const saved = await this.ordersRepository.save(order);

    // Clear the cart after order is placed
    await this.cartService.clearCart(user);

    return saved;
  }
}
