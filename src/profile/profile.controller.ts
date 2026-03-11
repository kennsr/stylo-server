import {
  Controller,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import {
  UpdateProfileDto,
  UpdateStylePreferencesDto,
  UpdateFitProfileDto,
} from './dto/profile.dto';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: User) {
    return this.profileService.getProfile(user);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(user, dto);
  }

  @Get('style-preferences')
  @ApiOperation({ summary: 'Get all style preferences with selection state' })
  getStylePreferences(@CurrentUser() user: User) {
    return this.profileService.getStylePreferences(user);
  }

  @Put('style-preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update selected style preferences' })
  updateStylePreferences(
    @CurrentUser() user: User,
    @Body() dto: UpdateStylePreferencesDto,
  ) {
    return this.profileService.updateStylePreferences(user, dto);
  }

  @Get('fit-profile')
  @ApiOperation({ summary: 'Get AI fit profile (body measurements)' })
  getFitProfile(@CurrentUser() user: User) {
    return this.profileService.getFitProfile(user);
  }

  @Put('fit-profile')
  @ApiOperation({ summary: 'Save or update AI fit profile' })
  updateFitProfile(@CurrentUser() user: User, @Body() dto: UpdateFitProfileDto) {
    return this.profileService.updateFitProfile(user, dto);
  }
}
