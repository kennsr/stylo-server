import { User } from '../../auth/entities/user.entity';
export declare class FitProfile {
    id: string;
    user: User;
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    preferred_size: string;
}
