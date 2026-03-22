import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { GalleryModule } from './gallery/gallery.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { UserInstrumentsModule } from './user-instruments/user-instruments.module';
import { UserTheoryModule } from './user-theory/user-theory.module';
import { GenresModule } from './genres/genres.module';
import { UserGenresModule } from './user-genres/user-genres.module';
import { UserBandsModule } from './user-bands/user-bands.module';
import { MusicianSearchModule } from './musician-search/musician-search.module';
import { CityModule } from './city/city.module';
import { MusicbrainzController } from './musicbrainz-proxy/musicbrainz.controller';
import { MusicbrainzService } from './musicbrainz-proxy/musicbrainz.service';
import { SupabasePerRequestService } from './supabase/supabase-per-request-service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UsersModule,
    LocationsModule,
    EventsModule,
    GalleryModule,
    InstrumentsModule,
    UserInstrumentsModule,
    UserTheoryModule,
    GenresModule,
    UserGenresModule,
    UserBandsModule,
    MusicianSearchModule,
    CityModule,
  ],
  controllers: [AppController, MusicbrainzController],
  providers: [AppService, MusicbrainzService, SupabasePerRequestService],
})
export class AppModule {}
