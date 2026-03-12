import { Repository } from 'typeorm';
import { TryOnResult } from './entities/try-on-result.entity';
import { User } from '../auth/entities/user.entity';
import { GenerateTryOnDto } from './dto/try-on.dto';
export declare class TryOnService {
    private tryOnResultsRepository;
    constructor(tryOnResultsRepository: Repository<TryOnResult>);
    generate(user: User, dto: GenerateTryOnDto): Promise<TryOnResult>;
    getResults(user: User): Promise<TryOnResult[]>;
    getAvatars(user: User): Promise<{
        id: string;
        url: string;
    }[]>;
}
