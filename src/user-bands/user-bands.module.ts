import { Module } from '@nestjs/common';
import { UserBandsService } from './user-bands.service';
import { UserBandsController } from './user-bands.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [UserBandsController],
  providers: [
    UserBandsService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
})
export class UserBandsModule {}
