import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
