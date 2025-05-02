import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
class Detection {
  @Prop({ type: [Number], required: true })
  bbox: number[];

  @Prop({ required: true })
  class_id: number;

  @Prop({ required: true })
  class_name: string;

  @Prop({ required: true })
  confidence: number;
}

@Schema({ timestamps: true })
export class RawDetection extends Document {
  @Prop({ required: true })
  frame_id: string;

  @Prop({ type: [Detection], required: true })
  detections: Detection[];

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  source: string;
}

export const RawDetectionSchema = SchemaFactory.createForClass(RawDetection); 