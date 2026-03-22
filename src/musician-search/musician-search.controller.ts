import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import {
  MusicianSearchService,
  MusicianSearchResult,
} from './musician-search.service';
import { AuthGuard } from '@nestjs/passport';

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

@UseGuards(AuthGuard('jwt'))
@Controller('search')
export class MusicianSearchController {
  constructor(private readonly musicianSearchService: MusicianSearchService) {}

  @Get('musicians/advanced')
  async searchAdvanced(
    @Req() req: AuthRequest,
    @Query('radiusKm') radiusKm?: string,
    @Query('instruments') instruments?: string,
    @Query('genres') genres?: string,
    @Query('bands') bands?: string,
    @Query('theoryLevels') theoryLevels?: string,
    @Query('limit') limit?: string,
  ): Promise<MusicianSearchResult[]> {
    if (!radiusKm) {
      throw new BadRequestException('radiusKm query parameter is required');
    }

    const radiusKmNum = this.parseFloat(radiusKm, 'radiusKm');
    const limitNum = limit ? this.parseInt(limit, 'limit') : undefined;

    const instrumentNames = this.parseCommaSeparated(instruments);
    const genreNames = this.parseCommaSeparated(genres);
    const bandNames = this.parseCommaSeparated(bands);
    const theoryArray = this.parseCommaSeparated(theoryLevels);

    return this.musicianSearchService.searchAdvancedByNames(
      req.user.id,
      radiusKmNum,
      {
        instruments: instrumentNames,
        genres: genreNames,
        bands: bandNames,
        theoryLevels: theoryArray,
      },
      limitNum,
    );
  }

  @Get('musicians/nearby')
  async searchNearby(
    @Req() req: AuthRequest,
    @Query('radiusKm') radiusKm?: string,
    @Query('limit') limit?: string,
  ): Promise<MusicianSearchResult[]> {
    if (!radiusKm) {
      throw new BadRequestException('radiusKm query parameter is required');
    }

    const radiusKmNum = this.parseFloat(radiusKm, 'radiusKm');
    const limitNum = limit ? this.parseInt(limit, 'limit') : undefined;

    return this.musicianSearchService.searchNearby(
      req.user.id,
      radiusKmNum,
      limitNum,
    );
  }

  @Get('musicians/random')
  async getRandomMusicians(): Promise<MusicianSearchResult[]> {
    return this.musicianSearchService.searchRandom();
  }

  private parseCommaSeparated(value?: string): string[] | undefined {
    if (!value) return undefined;
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private parseFloat(value: string, fieldName: string): number {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new BadRequestException(
        `${fieldName} must be a valid number, got: ${value}`,
      );
    }
    return num;
  }

  private parseInt(value: string, fieldName: string): number {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new BadRequestException(
        `${fieldName} must be a valid integer, got: ${value}`,
      );
    }
    return num;
  }
}
