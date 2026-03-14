import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { StylePreference } from './entities/style-preference.entity';
import { FitProfile } from './entities/fit-profile.entity';
import { UpdateProfileDto, UpdateStylePreferencesDto, UpdateFitProfileDto } from './dto/profile.dto';
export declare class ProfileService {
    private usersRepository;
    private stylePreferencesRepository;
    private fitProfilesRepository;
    constructor(usersRepository: Repository<User>, stylePreferencesRepository: Repository<StylePreference>, fitProfilesRepository: Repository<FitProfile>);
    private getUploadsDir;
    private generateFileName;
    uploadAvatar(user: User, file: Express.Multer.File): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        avatar_url: string;
        style_preferences: string[];
    }>;
    getProfile(user: User): {
        id: string;
        email: string;
        name: string;
        phone: string;
        avatar_url: string;
        style_preferences: string[];
    };
    updateProfile(user: User, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        avatar_url: string;
        style_preferences: string[];
    }>;
    getStylePreferences(user: User): Promise<{
        id: string;
        name: string;
        is_selected: boolean;
    }[]>;
    updateStylePreferences(user: User, dto: UpdateStylePreferencesDto): Promise<void>;
    getFitProfile(user: User): Promise<{
        user_id: string;
        height: null;
        weight: null;
        chest: null;
        waist: null;
        hips: null;
        preferred_size: null;
    } | {
        user_id: string;
        height: number;
        weight: number;
        chest: number;
        waist: number;
        hips: number;
        preferred_size: string;
    }>;
    updateFitProfile(user: User, dto: UpdateFitProfileDto): Promise<{
        user_id: string;
        height: number;
        weight: number;
        chest: number;
        waist: number;
        hips: number;
        preferred_size: string;
    }>;
}
