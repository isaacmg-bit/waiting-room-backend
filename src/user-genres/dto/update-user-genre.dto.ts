import { PartialType } from '@nestjs/swagger';
import { CreateUserGenreDto } from './create-user-genre.dto';

export class UpdateUserGenreDto extends PartialType(CreateUserGenreDto) {}
