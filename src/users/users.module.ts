import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, SupabaseService, SupabasePerRequestService],
  exports: [UsersService],
})
export class UsersModule {}
