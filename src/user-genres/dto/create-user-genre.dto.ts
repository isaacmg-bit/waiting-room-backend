import { IsUUID } from 'class-validator';

export class CreateUserGenreDto {
  @IsUUID('4', { message: 'genre_id must be a valid UUID' })
  genre_id: string;
}
