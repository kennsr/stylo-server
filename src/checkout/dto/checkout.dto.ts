import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceOrderDto {
  @ApiProperty()
  @IsString()
  address_id: string;

  @ApiProperty()
  @IsString()
  shipping_option_id: string;

  @ApiProperty()
  @IsString()
  payment_method: string;
}
