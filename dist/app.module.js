"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const cart_module_1 = require("./cart/cart.module");
const checkout_module_1 = require("./checkout/checkout.module");
const orders_module_1 = require("./orders/orders.module");
const profile_module_1 = require("./profile/profile.module");
const home_module_1 = require("./home/home.module");
const try_on_module_1 = require("./try-on/try-on.module");
const notifications_module_1 = require("./notifications/notifications.module");
const response_wrapper_interceptor_1 = require("./common/interceptors/response-wrapper.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const wishlist_module_1 = require("./wishlist/wishlist.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    ssl: { rejectUnauthorized: false },
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: configService.get('NODE_ENV') !== 'production',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            checkout_module_1.CheckoutModule,
            orders_module_1.OrdersModule,
            profile_module_1.ProfileModule,
            home_module_1.HomeModule,
            try_on_module_1.TryOnModule,
            notifications_module_1.NotificationsModule,
            wishlist_module_1.WishlistModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_INTERCEPTOR, useClass: response_wrapper_interceptor_1.ResponseWrapperInterceptor },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map