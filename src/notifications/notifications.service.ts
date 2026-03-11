import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  getAll(user: User) {
    return this.notificationsRepository.find({
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });
  }

  async markRead(user: User, id: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    notification.is_read = true;
    await this.notificationsRepository.save(notification);
  }

  async markAllRead(user: User) {
    await this.notificationsRepository.update(
      { user: { id: user.id }, is_read: false },
      { is_read: true },
    );
  }
}
