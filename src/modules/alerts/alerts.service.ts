import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectDetection } from '../object-detection/object-detection.schema';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(ObjectDetection.name) private objectDetectionModel: Model<ObjectDetection>,
  ) {}

  async findAlerts({
    page = 1,
    limit = 10,
    severity,
    location,
    search,
    date,
  }) {
    const query: any = {};

    if (severity) {
      query.severity = severity;
    }

    if (location) {
      query.location = location;
    }

    if (search) {
      query.detectedObjects = { $regex: search, $options: 'i' };
    }

    if (date) {
      query.createdAt = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      };
    }

    const [alerts, total] = await Promise.all([
      this.objectDetectionModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.objectDetectionModel.countDocuments(query),
    ]);

    return {
      alerts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
} 