import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObjectDetectionDocument = ObjectDetection & Document;

@Schema({ timestamps: true })
export class ObjectDetection {
  @Prop({ required: true })
  objectType: string; // e.g., 'firearm', 'knife', 'phone'


  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  location: string;
}

export const ObjectDetectionSchema = SchemaFactory.createForClass(ObjectDetection);
