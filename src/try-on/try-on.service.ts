import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TryOnResult } from './entities/try-on-result.entity';
import { User } from '../auth/entities/user.entity';
import { GenerateTryOnDto } from './dto/try-on.dto';

@Injectable()
export class TryOnService {
  constructor(
    @InjectRepository(TryOnResult)
    private tryOnResultsRepository: Repository<TryOnResult>,
  ) {}

  async generate(user: User, dto: GenerateTryOnDto): Promise<TryOnResult> {
    // TODO: Integrate with real AI try-on API (e.g., IDM-VTON or commercial API)
    // For now, store original image as base64 data URI and return a placeholder result
    const originalImageUrl = `data:image/jpeg;base64,${dto.photo.substring(0, 50)}...`; // truncated for storage
    const resultImageUrl = `https://placehold.co/512x512?text=Try-On+Result`;

    const result = this.tryOnResultsRepository.create({
      user,
      product_id: dto.productId,
      original_image_url: originalImageUrl,
      result_image_url: resultImageUrl,
      is_saved: false,
    });

    return this.tryOnResultsRepository.save(result);
  }

  async getResults(user: User): Promise<TryOnResult[]> {
    return this.tryOnResultsRepository.find({
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });
  }
}
