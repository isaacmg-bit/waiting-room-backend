import { PartialType } from '@nestjs/swagger';
import { CreateUserTheoryDto } from './create-user-theory.dto';

export class UpdateUserTheoryDto extends PartialType(CreateUserTheoryDto) {}
