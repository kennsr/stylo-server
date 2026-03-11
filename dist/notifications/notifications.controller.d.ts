import { NotificationsService } from './notifications.service';
import { User } from '../auth/entities/user.entity';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getAll(user: User): Promise<import("./entities/notification.entity").Notification[]>;
    markAllRead(user: User): Promise<void>;
    markRead(user: User, id: string): Promise<void>;
}
