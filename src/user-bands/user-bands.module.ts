import { Module } from '@nestjs/common';
import { UserBandsService } from './user-bands.service';
import { UserBandsController } from './user-bands.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [UserBandsController],
  providers: [UserBandsService, SupabaseService],
})
export class UserBandsModule {}
