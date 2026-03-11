import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { PlaceOrderDto } from './dto/checkout.dto';

@ApiTags('checkout')
@ApiBearerAuth()
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('addresses')
  @ApiOperation({ summary: 'Get saved shipping addresses' })
  getAddresses(@CurrentUser() user: User) {
    return this.checkoutService.getAddresses(user);
  }

  @Get('shipping-rates')
  @ApiOperation({ summary: 'Get shipping options for address and weight' })
  @ApiQuery({ name: 'address_id', required: true })
  @ApiQuery({ name: 'weight', required: true })
  getShippingRates(
    @Query('address_id') addressId: string,
    @Query('weight') weight: string,
  ) {
    return this.checkoutService.getShippingRates(addressId, parseFloat(weight));
  }

  @Post('place-order')
  @ApiOperation({ summary: 'Place order from cart' })
  placeOrder(@CurrentUser() user: User, @Body() dto: PlaceOrderDto) {
    return this.checkoutService.placeOrder(user, dto);
  }
}
