import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    private serializeUser;
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
    getMe(user: User): {
        id: string;
        email: string;
        name: string;
        phone: string;
        avatar_url: string;
        style_preferences: string[];
    };
}
