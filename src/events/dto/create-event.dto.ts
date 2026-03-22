import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationPointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateEventDto {
  @IsDateString()
  date: string;

  @IsString()
  title: string;

  @IsString()
  color: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationPointDto)
  location_point?: { lat: number; lng: number };

  @IsBoolean()
  is_public: boolean;

  @IsString()
  street: string;

  @IsEnum(['show', 'rehearsalspace'], {
    message: 'event_type must be either "show" or "rehearsalspace"',
  })
  event_type: 'show' | 'rehearsalspace';
}
