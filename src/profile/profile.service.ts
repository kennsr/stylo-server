import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { StylePreference } from './entities/style-preference.entity';
import { FitProfile } from './entities/fit-profile.entity';
import {
  UpdateProfileDto,
  UpdateStylePreferencesDto,
  UpdateFitProfileDto,
} from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(StylePreference)
    private stylePreferencesRepository: Repository<StylePreference>,
    @InjectRepository(FitProfile)
    private fitProfilesRepository: Repository<FitProfile>,
  ) {}

  getProfile(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? null,
      avatar_url: user.avatar_url ?? null,
      style_preferences: (user.style_preferences ?? []).map((p) => p.id),
    };
  }

  async updateProfile(user: User, dto: UpdateProfileDto) {
    if (dto.name) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    const saved = await this.usersRepository.save(user);
    return {
      id: saved.id,
      email: saved.email,
      name: saved.name,
      phone: saved.phone ?? null,
      avatar_url: saved.avatar_url ?? null,
      style_preferences: (saved.style_preferences ?? []).map((p) => p.id),
    };
  }

  async getStylePreferences(user: User) {
    const all = await this.stylePreferencesRepository.find();
    const selectedIds = new Set((user.style_preferences ?? []).map((p) => p.id));
    return all.map((p) => ({
      id: p.id,
      name: p.name,
      is_selected: selectedIds.has(p.id),
    }));
  }

  async updateStylePreferences(user: User, dto: UpdateStylePreferencesDto) {
    const prefs = await this.stylePreferencesRepository.findBy({
      id: In(dto.preference_ids),
    });
    user.style_preferences = prefs;
    await this.usersRepository.save(user);
  }

  async getFitProfile(user: User) {
    const profile = await this.fitProfilesRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!profile) {
      return {
        user_id: user.id,
        height: null,
        weight: null,
        chest: null,
        waist: null,
        hips: null,
        preferred_size: null,
      };
    }
    return {
      user_id: user.id,
      height: profile.height ?? null,
      weight: profile.weight ?? null,
      chest: profile.chest ?? null,
      waist: profile.waist ?? null,
      hips: profile.hips ?? null,
      preferred_size: profile.preferred_size ?? null,
    };
  }

  async updateFitProfile(user: User, dto: UpdateFitProfileDto) {
    let profile = await this.fitProfilesRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!profile) {
      profile = this.fitProfilesRepository.create({ user });
    }
    if (dto.height !== undefined) profile.height = dto.height;
    if (dto.weight !== undefined) profile.weight = dto.weight;
    if (dto.chest !== undefined) profile.chest = dto.chest;
    if (dto.waist !== undefined) profile.waist = dto.waist;
    if (dto.hips !== undefined) profile.hips = dto.hips;
    if (dto.preferred_size !== undefined) profile.preferred_size = dto.preferred_size;
    const saved = await this.fitProfilesRepository.save(profile);
    return {
      user_id: user.id,
      height: saved.height ?? null,
      weight: saved.weight ?? null,
      chest: saved.chest ?? null,
      waist: saved.waist ?? null,
      hips: saved.hips ?? null,
      preferred_size: saved.preferred_size ?? null,
    };
  }
}
