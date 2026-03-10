import { Module } from '@nestjs/common';
import { UserInstrumentsService } from './user-instruments.service';
import { UserInstrumentsController } from './user-instruments.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [UserInstrumentsController],
  providers: [UserInstrumentsService, SupabaseService],
})
export class UserInstrumentsModule {}
