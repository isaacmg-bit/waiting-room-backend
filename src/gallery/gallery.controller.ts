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
    const [createdPhoto] = await this.galleryService.create(req.user.id, dto);
    return createdPhoto;
  }

  @Get('me')
  async getMyGallery(@Req() req) {
    return this.galleryService.findByUserId(req.user.id);
  }

  @Get(':userId')
  getGalleryByUserId(@Param('userId') userId: string) {
    return this.galleryService.findByUserId(userId);
  }

  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    return this.galleryService.remove(req.user.id, id);
  }
}
