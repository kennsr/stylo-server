import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import {
  UpdateProfileDto,
  UpdateStylePreferencesDto,
  UpdateFitProfileDto,
} from './dto/profile.dto';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        // Accept only images
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (max 5MB, jpg/png/webp)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload user avatar' })
  uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(user, file);
  }
}
