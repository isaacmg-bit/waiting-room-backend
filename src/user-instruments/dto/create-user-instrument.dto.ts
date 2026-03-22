import { IsUUID, IsString, IsEnum } from 'class-validator';

export class CreateUserInstrumentDto {
  @IsUUID('4', { message: 'instrument_id must be a valid UUID' })
  instrument_id: string;

  @IsString()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'], {
    message: 'level must be one of: beginner, intermediate, advanced, expert',
  })
  level: string;
}
