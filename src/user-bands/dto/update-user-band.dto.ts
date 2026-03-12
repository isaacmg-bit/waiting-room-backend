import { PartialType } from '@nestjs/swagger';
import { CreateUserBandDto } from './create-user-band.dto';

export class UpdateUserBandDto extends PartialType(CreateUserBandDto) {}
