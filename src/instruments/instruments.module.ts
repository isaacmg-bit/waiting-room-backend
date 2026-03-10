import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [InstrumentsController],
  providers: [InstrumentsService, SupabaseService],
})
export class InstrumentsModule {}
