import { PartialType } from '@nestjs/swagger';
import { CreateUserInstrumentDto } from './create-user-instrument.dto';

export class UpdateUserInstrumentDto extends PartialType(CreateUserInstrumentDto) {}
