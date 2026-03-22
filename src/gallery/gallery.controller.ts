import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Param,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UseGuards } from '@nestjs/common';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@UseGuards(SupabaseTokenGuard)
@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateGalleryDto) {
    const client = req.supabaseClient;
    const [createdPhoto] = await this.galleryService.create(
      req.user.id,
      dto,
      client,
    );
    return createdPhoto;
  }

  @Get('me')
  async getMyGallery(@Req() req) {
    const client = req.supabaseClient;
    return this.galleryService.findByUserId(req.user.id, client);
  }

  @Get(':userId')
  getGalleryByUserId(@Param('userId') userId: string) {
    return this.galleryService.findByUserId(userId);
  }

  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    const client = req.supabaseClient;
    return this.galleryService.remove(req.user.id, id, client);
  }
}
