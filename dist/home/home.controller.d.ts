import { HomeService } from './home.service';
export declare class HomeController {
    private readonly homeService;
    constructor(homeService: HomeService);
    getBanners(): Promise<import("./entities/banner.entity").Banner[]>;
}
