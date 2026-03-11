"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const style_preference_entity_1 = require("./entities/style-preference.entity");
const fit_profile_entity_1 = require("./entities/fit-profile.entity");
let ProfileService = class ProfileService {
    usersRepository;
    stylePreferencesRepository;
    fitProfilesRepository;
    constructor(usersRepository, stylePreferencesRepository, fitProfilesRepository) {
        this.usersRepository = usersRepository;
        this.stylePreferencesRepository = stylePreferencesRepository;
        this.fitProfilesRepository = fitProfilesRepository;
    }
    getProfile(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone ?? null,
            avatar_url: user.avatar_url ?? null,
            style_preferences: (user.style_preferences ?? []).map((p) => p.id),
        };
    }
    async updateProfile(user, dto) {
        if (dto.name)
            user.name = dto.name;
        if (dto.phone !== undefined)
            user.phone = dto.phone;
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
    async getStylePreferences(user) {
        const all = await this.stylePreferencesRepository.find();
        const selectedIds = new Set((user.style_preferences ?? []).map((p) => p.id));
        return all.map((p) => ({
            id: p.id,
            name: p.name,
            is_selected: selectedIds.has(p.id),
        }));
    }
    async updateStylePreferences(user, dto) {
        const prefs = await this.stylePreferencesRepository.findBy({
            id: (0, typeorm_2.In)(dto.preference_ids),
        });
        user.style_preferences = prefs;
        await this.usersRepository.save(user);
    }
    async getFitProfile(user) {
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
    async updateFitProfile(user, dto) {
        let profile = await this.fitProfilesRepository.findOne({
            where: { user: { id: user.id } },
        });
        if (!profile) {
            profile = this.fitProfilesRepository.create({ user });
        }
        if (dto.height !== undefined)
            profile.height = dto.height;
        if (dto.weight !== undefined)
            profile.weight = dto.weight;
        if (dto.chest !== undefined)
            profile.chest = dto.chest;
        if (dto.waist !== undefined)
            profile.waist = dto.waist;
        if (dto.hips !== undefined)
            profile.hips = dto.hips;
        if (dto.preferred_size !== undefined)
            profile.preferred_size = dto.preferred_size;
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
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(style_preference_entity_1.StylePreference)),
    __param(2, (0, typeorm_1.InjectRepository)(fit_profile_entity_1.FitProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProfileService);
//# sourceMappingURL=profile.service.js.map