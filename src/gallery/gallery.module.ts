import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService, SupabaseService],
})
export class GalleryModule {}
