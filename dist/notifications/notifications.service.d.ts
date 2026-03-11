import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../auth/entities/user.entity';
export declare class NotificationsService {
    private notificationsRepository;
    constructor(notificationsRepository: Repository<Notification>);
    getAll(user: User): Promise<Notification[]>;
    markRead(user: User, id: string): Promise<void>;
    markAllRead(user: User): Promise<void>;
}
