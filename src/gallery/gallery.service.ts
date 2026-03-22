import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';

export interface GalleryPhoto {
  id: string;
  user_id: string;
  url: string;
  position: number;
  created_at?: string;
}

@Injectable()
export class GalleryService {
  private readonly MAX_PHOTOS = 4;

  constructor(private supabaseService: SupabaseService) {}

  async create(userId: string, dto: CreateGalleryDto) {
    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const { data: existingPhotos, error: selectError } =
        await this.supabaseService
          .getClient()
          .from('user_gallery_photos')
          .select('id, position')
          .eq('user_id', userId);

      if (selectError) {
        throw new InternalServerErrorException(
          `Failed to check gallery: ${selectError.message}`,
        );
      }

      if (existingPhotos && existingPhotos.length >= this.MAX_PHOTOS) {
        throw new BadRequestException(
          `Maximum ${this.MAX_PHOTOS} photos allowed per user`,
        );
      }

      const position =
        dto.position !== undefined
          ? this.validatePosition(dto.position, existingPhotos?.length || 0)
          : existingPhotos?.length || 0;

      const { data, error } = await this.supabaseService
        .getClient()
        .from('user_gallery_photos')
        .insert([
          {
            user_id: userId,
            url: dto.url,
            position,
          },
        ])
        .select();

      if (error) {
        throw new InternalServerErrorException(
          `Failed to create photo: ${error.message}`,
        );
      }

      if (!data || data.length === 0) {
        throw new InternalServerErrorException('Failed to create photo');
      }

      return data;
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof InternalServerErrorException
      )
        throw err;
      throw new InternalServerErrorException('Failed to create photo');
    }
  }

  async findByUserId(userId: string): Promise<GalleryPhoto[]> {
    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('user_gallery_photos')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });

      if (error) {
        throw new InternalServerErrorException(
          `Failed to fetch gallery: ${error.message}`,
        );
      }

      return (data || []) as GalleryPhoto[];
    } catch (err) {
      if (err instanceof InternalServerErrorException) throw err;
      throw new InternalServerErrorException('Failed to fetch gallery');
    }
  }

  async remove(userId: string, photoId: string): Promise<any> {
    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    if (!photoId || photoId.trim().length === 0) {
      throw new BadRequestException('Photo ID is required');
    }

    try {
      const { data: photo, error: selectError } = await this.supabaseService
        .getClient()
        .from('user_gallery_photos')
        .select('*')
        .eq('id', photoId)
        .single();

      if (selectError) {
        throw new NotFoundException('Photo not found');
      }

      if (!photo) {
        throw new NotFoundException('Photo not found');
      }

      if (photo.user_id !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this photo',
        );
      }

      if (photo.url) {
        const { error: storageError } = await this.supabaseService
          .getClient()
          .storage.from('gallery')
          .remove([photo.url]);

        if (storageError) {
          console.warn(
            `Failed to delete file from storage: ${storageError.message}`,
          );
        }
      }

      const { error: deleteError } = await this.supabaseService
        .getClient()
        .from('user_gallery_photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) {
        throw new InternalServerErrorException(
          `Failed to delete photo: ${deleteError.message}`,
        );
      }

      return { message: 'Photo deleted successfully', id: photoId };
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ForbiddenException ||
        err instanceof BadRequestException ||
        err instanceof InternalServerErrorException
      )
        throw err;
      throw new InternalServerErrorException('Failed to delete photo');
    }
  }

  private validatePosition(position: number, totalExisting: number): number {
    if (position < 0 || position > this.MAX_PHOTOS - 1) {
      throw new BadRequestException(
        `Position must be between 0 and ${this.MAX_PHOTOS - 1}`,
      );
    }

    if (position > totalExisting) {
      throw new BadRequestException(
        `Position ${position} is too high. Max available: ${totalExisting}`,
      );
    }

    return position;
  }
}
