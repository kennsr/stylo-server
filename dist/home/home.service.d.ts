import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
export declare class HomeService {
    private bannersRepository;
    constructor(bannersRepository: Repository<Banner>);
    getBanners(): Promise<Banner[]>;
}
