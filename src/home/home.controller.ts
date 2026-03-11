import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HomeService } from './home.service';

@ApiTags('home')
@ApiBearerAuth()
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('banners')
  @ApiOperation({ summary: 'Get promotional banners for home screen' })
  getBanners() {
    return this.homeService.getBanners();
  }
}
