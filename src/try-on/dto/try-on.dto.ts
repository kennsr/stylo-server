import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTryOnDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Base64-encoded user photo' })
  @IsString()
  photo: string;
}
