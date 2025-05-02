import { IsString, IsArray, IsOptional, IsDateString } from 'class-validator';

export class UpdateRawDetectionDto {
  @IsString()
  @IsOptional()
  frame_id?: string;

  @IsArray()
  @IsOptional()
  detections?: any[];

  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @IsString()
  @IsOptional()
  source?: string;
}
