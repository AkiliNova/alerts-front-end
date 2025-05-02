import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawDetection } from '../rabbitmq/raw-detection.schema';
import { CreateRawDetectionDto } from './dto/create-raw-detection.dto';
import { UpdateRawDetectionDto } from './dto/update-raw-detection.dto';

interface FindAllOptions {
  limit?: number;
  page?: number;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class RawDetectionService {
  private readonly DEFAULT_LIMIT = 50;
  private readonly MAX_LIMIT = 100;

  constructor(
    @InjectModel(RawDetection.name) private readonly rawDetectionModel: Model<RawDetection>,
  ) {}

  // Create a new raw detection
  async create(createRawDetectionDto: CreateRawDetectionDto): Promise<RawDetection> {
    const createdDetection = new this.rawDetectionModel(createRawDetectionDto);
    return createdDetection.save();
  }

  // Get all raw detections
  async findAll(options: FindAllOptions = {}): Promise<{ data: RawDetection[]; total: number }> {
    const {
      limit = this.DEFAULT_LIMIT,
      page = 1,
      startDate,
      endDate
    } = options;

    const actualLimit = Math.min(limit, this.MAX_LIMIT);
    const skip = (page - 1) * actualLimit;

    const query = this.rawDetectionModel.find();

    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
      query.where('timestamp').equals(dateFilter);
    }

    const [data, total] = await Promise.all([
      query
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(actualLimit)
        .exec(),
      this.rawDetectionModel.countDocuments(query.getQuery())
    ]);

    return { data, total };
  }

  // Get a specific raw detection by ID
  async findOne(id: string): Promise<RawDetection> {
    const detection = await this.rawDetectionModel.findById(id).exec();
    if (!detection) throw new NotFoundException(`Detection with ID ${id} not found`);
    return detection;
  }

  // Update a raw detection by ID
  async update(id: string, updateRawDetectionDto: UpdateRawDetectionDto): Promise<RawDetection> {
    const updated = await this.rawDetectionModel.findByIdAndUpdate(id, updateRawDetectionDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Detection with ID ${id} not found`);
    return updated;
  }

  // Delete a raw detection by ID
  async remove(id: string): Promise<void> {
    const result = await this.rawDetectionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Detection with ID ${id} not found`);
  }
}
