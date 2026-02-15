import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, CalendarEvent } from './entities/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CalendarEvent.name, schema: EventSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
