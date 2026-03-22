import { IsBoolean, IsString, IsEnum, ValidateIf } from 'class-validator';

export class CreateUserTheoryDto {
  @IsBoolean()
  knows_theory: boolean;

  @IsString()
  @IsEnum(['Basic', 'Composition', 'Advanced Orchestration'], {
    message:
      'theory_level must be one of: Basic, Composition, Advanced Orchestration',
  })
  @ValidateIf((obj) => obj.knows_theory === true)
  theory_level: string;
}
