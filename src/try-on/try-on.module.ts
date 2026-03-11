import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TryOnController } from './try-on.controller';
import { TryOnService } from './try-on.service';
import { TryOnResult } from './entities/try-on-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TryOnResult])],
  controllers: [TryOnController],
  providers: [TryOnService],
})
export class TryOnModule {}
