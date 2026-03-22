import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUrl,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinkDto {
  @IsString()
  platform: string;

  @IsUrl()
  url: string;
}

export class CreateUserProfileDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsString()
  @MinLength(2, { message: 'Location must be at least 2 characters' })
  @MaxLength(100, { message: 'Location must not exceed 100 characters' })
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Bio must not exceed 500 characters' })
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Gear must not exceed 500 characters' })
  gear?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Rehearsal space must not exceed 500 characters' })
  rehearsal_space?: string;

  @IsString()
  @IsOptional()
  location_point?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  social_links?: Array<{ platform: string; url: string }>;

  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  @IsOptional()
  role?: 'user' | 'admin';
}
