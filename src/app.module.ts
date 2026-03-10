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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
