import { User } from '../../auth/entities/user.entity';
export declare class TryOnResult {
    id: string;
    user: User;
    product_id: string;
    original_image_url: string;
    result_image_url: string;
    is_saved: boolean;
    created_at: Date;
}
