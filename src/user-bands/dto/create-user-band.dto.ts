import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator';

export class CreateUserBandDto {
  @IsUUID('4', { message: 'band_id must be a valid UUID' })
  band_id: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;
}
