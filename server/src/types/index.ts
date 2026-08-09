import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  cloudPercentage: number;
  rainProbability: number;
  condition: string;
  icon: string;
  sunrise: string;
  sunset: string;
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  recommendations: string[];
}

export interface DailyForecast {
  day: string;
  date: string;
  tempMin: number;
  tempMax: number;
  rainProbability: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  rainProbability: number;
  condition: string;
}

export interface DiseaseDetectionResult {
  id?: string;
  imageUrl?: string;
  detectedDisease: string;
  confidence: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'REJECTED';
  rejectionReason?: string;
  severity?: string;
  cropName: string;
  symptoms: string[];
  causes: string[];
  immediateActions: string[];
  prevention: string[];
  treatmentGuidance: {
    cultural: string[];
    sanitation: string[];
    biological: string[];
    expertAdvice: string;
  };
  modelId?: string;
  modelVersion?: string;
  isModelPending?: boolean;
  isExpertVerificationRecommended: boolean;
  isLowConfidence: boolean;
  createdAt?: string;
}
