import { Module } from '@nestjs/common';
import { UserTheoryService } from './user-theory.service';
import { UserTheoryController } from './user-theory.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [UserTheoryController],
  providers: [UserTheoryService, SupabaseService],
})
export class UserTheoryModule {}
