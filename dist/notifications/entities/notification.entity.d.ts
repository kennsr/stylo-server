import { User } from '../../auth/entities/user.entity';
export declare class Notification {
    id: string;
    user: User;
    title: string;
    body: string;
    type: string;
    is_read: boolean;
    image_url: string;
    action_route: string;
    created_at: Date;
}
