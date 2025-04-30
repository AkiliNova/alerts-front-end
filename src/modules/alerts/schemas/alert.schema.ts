import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Alert extends Document {
  @Prop({ required: true })
  message: string;

  @Prop()
  location: string;

  @Prop({ enum: ['high', 'medium', 'low'] })
  severity: string;

  @Prop()
  createdAt: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert); 