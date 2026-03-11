import { StylePreference } from '../../profile/entities/style-preference.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    phone: string;
    avatar_url: string;
    style_preferences: StylePreference[];
    created_at: Date;
    updated_at: Date;
}
