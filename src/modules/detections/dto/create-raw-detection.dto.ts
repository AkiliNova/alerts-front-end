import { IsString, IsArray, IsDateString } from 'class-validator';

export class CreateRawDetectionDto {
  @IsString()
  frame_id: string;

  @IsArray()
  detections: any[];  // Assuming detections is an array of objects with specific properties

  @IsDateString()
  timestamp: string;

  @IsString()
  source: string;
}
