import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private supabaseService: SupabaseService) {}

  async create(userId: string, dto: CreateGalleryDto) {
    const { data: existingPhotos, error: selectError } =
      await this.supabaseService
        .getClient()
        .from('user_gallery_photos')
        .select('id')
        .eq('user_id', userId);

    if (selectError) throw selectError;
    if (existingPhotos.length >= 4)
      throw new BadRequestException('Max 4 photos allowed');

    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_gallery_photos')
      .insert([
        {
          user_id: userId,
          url: dto.url,
          position: dto.position || existingPhotos.length,
        },
      ]);

    if (error) throw error;
    return data;
  }

  async findByUser(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_gallery_photos')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  }

  async remove(userId: string, photoId: string) {
    const { data: photo, error: selectError } = await this.supabaseService
      .getClient()
      .from('user_gallery_photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (selectError) throw selectError;
    if (!photo || photo.user_id !== userId)
      throw new BadRequestException('Photo not found');

    const { error: storageError } = await this.supabaseService
      .getClient()
      .storage.from('gallery')
      .remove([photo.url]);

    if (storageError) throw storageError;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_gallery_photos')
      .delete()
      .eq('id', photoId);

    if (error) throw error;
    return data;
  }
}
