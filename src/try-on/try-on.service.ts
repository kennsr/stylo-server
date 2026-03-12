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
    // For now, return a modified version of the input base64 image to prove the API works.
    
    // We'll simulate a "modification" by just returning the same base64 for now, 
    // or you could append a watermark. To keep it simple and valid base64, we just return the input.
    const originalImageUrl = dto.photo.startsWith('data:image') 
      ? dto.photo 
      : `data:image/jpeg;base64,${dto.photo}`;
      
    const resultImageUrl = originalImageUrl; // Returning the same image as a stub

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

  async getAvatars(user: User) {
    // Mocking returning a list of saved avatars for the user.
    // Ideally this would be queried from a dedicated `UserAvatar` entity.
    // For now, we extract unique original images from tryOnResults or return defaults.
    const results = await this.tryOnResultsRepository.find({
      where: { user: { id: user.id } },
      select: ['original_image_url'],
    });

    const uniqueUrls = [...new Set(results.map(r => r.original_image_url))];
    
    return uniqueUrls.map((url, index) => ({
      id: `avatar_${index}`,
      url: url,
    }));
  }
}
