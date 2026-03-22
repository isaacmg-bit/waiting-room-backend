import { IsOptional, IsNumber, IsUrl, Min, Max } from 'class-validator';

export class CreateGalleryDto {
  @IsUrl({}, { message: 'URL must be a valid URL' })
  url: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Position must be >= 0' })
  @Max(3, { message: 'Position must be <= 3' })
  position?: number;
}
