import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
