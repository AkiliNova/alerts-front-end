import { Injectable } from '@nestjs/common';

@Injectable()
export class AnomalyDetectionService {

  // Process detections and filter out anomalies based on some criteria
  async processDetections(detections: any[]): Promise<any[]> {
    const filteredDetections = detections.filter(detection => this.isValidDetection(detection));
    
    // Perform additional anomaly checks (e.g., detect unknown object types, low confidence, etc.)
    const anomalousDetections = detections.filter(detection => this.isAnomalous(detection));
    
    // Example: Detect if the confidence score is below a threshold
    if (anomalousDetections.length > 0) {
      return anomalousDetections;
    }

    return filteredDetections;
  }

  // Simple detection validation (for example, filtering out low-confidence objects)
  private isValidDetection(detection: any): boolean {
    return detection.confidence >= 0.2;  // Confidence threshold can be adjusted
  }

  // Detect anomalies (e.g., new or unknown object class, or unusual patterns)
  private isAnomalous(detection: any): boolean {
    // Example: Check for unknown class IDs or unexpected objects
    const knownClasses = [37, 43, 56]; // List of known class IDs (e.g., surfboard, etc.)
    return !knownClasses.includes(detection.class_id);
  }

  // Generate anomaly statistics (e.g., total anomalies detected)
  async getStatistics() {
    // Here you can track anomalies or provide stats about detection trends
    return {
      totalAnomalies: 10, // Example static value, replace with actual anomaly count logic
      lastAnomalyTime: new Date(),
    };
  }

  // Example function to enrich detections with AI classification (optional)
  async enrichDetections(detections: any[]): Promise<any[]> {
    return detections.map(detection => ({
      ...detection,
      enriched: true, // Enrich the detection with additional data or predictions
    }));
  }

  // Trigger alerts based on anomalous detections
  alert(frame_id: string, detections: any[]) {
    // Send alerts based on detected anomalies (e.g., via email, SMS, or logging system)
    console.log(`Anomaly detected in frame: ${frame_id}`);
  }
}
