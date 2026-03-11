import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        avatar_url: string;
        style_preferences: string[];
        token: string;
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        avatar_url: string;
        style_preferences: string[];
        token: string;
    }>;
    logout(): {};
    getMe(user: User): {
        id: string;
        email: string;
        name: string;
        phone: string;
        avatar_url: string;
        style_preferences: string[];
    };
}
