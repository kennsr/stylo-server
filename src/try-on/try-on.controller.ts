import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TryOnService } from './try-on.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { GenerateTryOnDto } from './dto/try-on.dto';

@ApiTags('try-on')
@ApiBearerAuth()
@Controller('try-on')
export class TryOnController {
  constructor(private readonly tryOnService: TryOnService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a virtual try-on image' })
  generate(@CurrentUser() user: User, @Body() dto: GenerateTryOnDto) {
    return this.tryOnService.generate(user, dto);
  }

  @Get('results')
  @ApiOperation({ summary: 'Get try-on history for current user' })
  getResults(@CurrentUser() user: User) {
    return this.tryOnService.getResults(user);
  }
}
