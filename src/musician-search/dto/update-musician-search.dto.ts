import { PartialType } from '@nestjs/swagger';
import { CreateMusicianSearchDto } from './create-musician-search.dto';

export class UpdateMusicianSearchDto extends PartialType(CreateMusicianSearchDto) {}
