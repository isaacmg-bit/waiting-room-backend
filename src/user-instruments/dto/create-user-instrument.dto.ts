import { IsUUID, IsString, IsIn } from 'class-validator';

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
export type Level = (typeof LEVELS)[number];

export class CreateUserInstrumentDto {
  @IsUUID('4', { message: 'instrument_id must be a valid UUID' })
  instrument_id: string;

  @IsString()
  @IsIn(LEVELS, {
    message: 'level must be one of: Beginner, Intermediate, Advanced',
  })
  level: Level;
}
