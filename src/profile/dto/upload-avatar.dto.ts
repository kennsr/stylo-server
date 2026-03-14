import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar image file (max 5MB, jpg/png/webp)',
  })
  avatar: Express.Multer.File;
}
