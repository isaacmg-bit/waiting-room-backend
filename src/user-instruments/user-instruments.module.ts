import { Module } from '@nestjs/common';
import { UserInstrumentsService } from './user-instruments.service';
import { UserInstrumentsController } from './user-instruments.controller';

@Module({
  controllers: [UserInstrumentsController],
  providers: [UserInstrumentsService],
})
export class UserInstrumentsModule {}
