import { IsBoolean, IsString, IsIn, ValidateIf } from 'class-validator';

export const THEORY_LEVELS = [
  'Basic',
  'Composition',
  'Advanced Orchestration',
] as const;
export type TheoryLevel = (typeof THEORY_LEVELS)[number];

export class CreateUserTheoryDto {
  @IsBoolean()
  knows_theory: boolean;

  @ValidateIf((o) => o.knows_theory === true)
  @IsString()
  @IsIn(THEORY_LEVELS, {
    message:
      'theory_level must be one of: Basic, Composition, Advanced Orchestration',
  })
  theory_level?: TheoryLevel;
}
