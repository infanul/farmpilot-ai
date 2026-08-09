export interface User {
  id: string;
  name: string;
  email: string;
  profile?: FarmerProfile;
  farms?: Farm[];
}

export interface FarmerProfile {
  id: string;
  phone?: string;
  location?: string;
  farmSize?: number;
  farmingExperience?: string;
  mainCrop?: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  area: number;
  soilType: string;
  irrigationType: string;
  mainCropId?: string;
}

export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  cropType: string;
  growingSeason: string;
  tempMin: number;
  tempMax: number;
  soilRequirements: string;
  soilPhMin: number;
  soilPhMax: number;
  waterRequirement: string;
  irrigationGuidance: string;
  fertilizationSchedule: string;
  plantingInfo: string;
  seedInfo: string;
  growthStages: string; // JSON string array of 13 stages
  expectedHarvestPeriod: string;
  harvestingGuidance: string;
  storageGuidance: string;
  marketOverview: string;
  imageUrl?: string;
  diseases?: Disease[];
}

export interface Disease {
  id: string;
  cropId: string;
  name: string;
  category: string;
  symptoms: string;
  causes: string;
  favorableConditions: string;
  prevention: string;
  severity: string;
  imageUrl?: string;
  crop?: Crop;
  treatmentRecommendations?: TreatmentRecommendation[];
}

export interface TreatmentRecommendation {
  id: string;
  title: string;
  details: string;
  treatmentType: string;
}

export interface DiseaseScanResult {
  id?: string;
  imageUrl?: string;
  detectedDisease: string;
  confidence: number;
  confidenceLevel?: 'HIGH' | 'MEDIUM' | 'LOW' | 'REJECTED';
  rejectionReason?: string;
  severity?: string;
  cropName: string;
  symptoms: string[];
  causes: string[];
  immediateActions?: string[];
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
  isExpertVerificationRecommended?: boolean;
  isLowConfidence: boolean;
  createdAt?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  pressure: number;
  visibility?: number;
  cloudPercentage: number;
  rainProbability: number;
  condition: string;
  icon: string;
  sunrise?: string;
  sunset?: string;
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

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendedAction: string;
  location?: string;
  validUntil: string;
}

export interface CropCalendarEvent {
  id: string;
  cropId: string;
  crop: Crop;
  farmId?: string;
  farm?: Farm;
  plantingDate: string;
  activityName: string;
  stage: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'POSTPONED';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  description?: string;
  waterRequirement?: string;
  fertilizerTask?: string;
  soilConsiderations?: string;
  diseaseMonitoring?: string;
  pestMonitoring?: string;
  weatherConsiderations?: string;
  farmerNotes?: string;
  weatherImpact?: string;
  recommendation?: string;
  isSmartAdjusted?: boolean;
}

export interface SoilRecord {
  id: string;
  location: string;
  soilType: string;
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  healthScore: number;
  isEstimated: boolean;
  recommendations: string;
  createdAt: string;
}

export interface MarketPrice {
  id: string;
  cropId: string;
  cropName: string;
  market: string;
  location: string;
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  unit: string;
  recordedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  isRead: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  farm?: Farm;
}
