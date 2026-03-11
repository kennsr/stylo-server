import { TryOnService } from './try-on.service';
import { User } from '../auth/entities/user.entity';
import { GenerateTryOnDto } from './dto/try-on.dto';
export declare class TryOnController {
    private readonly tryOnService;
    constructor(tryOnService: TryOnService);
    generate(user: User, dto: GenerateTryOnDto): Promise<import("./entities/try-on-result.entity").TryOnResult>;
    getResults(user: User): Promise<import("./entities/try-on-result.entity").TryOnResult[]>;
}
