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
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateGalleryDto) {
    return this.galleryService.create(req.user.id, dto);
  }

  @Get('me')
  async getMyGallery(@Req() req) {
    return this.galleryService.findByUser(req.user.id);
  }

  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    return this.galleryService.remove(req.user.id, id);
  }
}
