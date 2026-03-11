import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async findAll(user: User) {
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

  async findOne(user: User, orderId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, user: { id: user.id } },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');
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
}
