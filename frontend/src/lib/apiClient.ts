import {
  User,
  WeatherData,
  WeatherAlert,
  CropCalendarEvent,
  SoilRecord,
  MarketPrice,
  DiseaseScanResult,
  Crop,
  NotificationItem,
  Expense,
} from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const MOCK_USER: User = {
  id: 'usr_farmer_123',
  name: 'Farmer',
  email: 'farmer@farmpilot.ai',
  profile: {
    id: 'prof_farmer_123',
    phone: '+91 98765 43210',
    location: 'Kottayam, Kerala',
    farmSize: 4.5,
    farmingExperience: '8 years',
    mainCrop: 'Rice, Banana & Tomato',
  },
  farms: [
    {
      id: 'farm_123',
      name: 'Green Canopy Farm Sector A',
      location: 'Kottayam Sector 2',
      area: 4.5,
      soilType: 'Clay Loam',
      irrigationType: 'Drip & Basin Irrigation',
    },
  ],
};

const MOCK_CROPS: Crop[] = [
  {
    id: 'crop_rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    cropType: 'Cereal Grain',
    growingSeason: 'Kharif / Rabi (100–150 days)',
    tempMin: 20,
    tempMax: 38,
    soilRequirements: 'Clay loam or alluvial soil with high water retention capacity',
    soilPhMin: 5.5,
    soilPhMax: 6.5,
    waterRequirement: 'High (1200–1500 mm per season). Requires standing water during tillering phase.',
    irrigationGuidance: 'Maintain 2-5 cm standing water during tillering and flowering. Drain 10 days before harvest.',
    fertilizationSchedule: 'NPK 120:60:60 kg/ha. Apply Basal NPK; top-dress Nitrogen at active tillering and panicle initiation.',
    plantingInfo: 'Transplant 20–25 day old seedlings at 20x15 cm spacing.',
    seedInfo: 'Requires 20–25 kg certified seeds per acre. Treat seeds with Carbendazim before nursery sowing.',
    growthStages: JSON.stringify([
      'Land Preparation', 'Seed Selection', 'Seed Treatment', 'Nursery Preparation',
      'Sowing / Transplanting', 'Germination', 'Early Growth', 'Vegetative Growth',
      'Flowering', 'Fruit / Grain Development', 'Maturity', 'Harvest', 'Post-Harvest'
    ]),
    expectedHarvestPeriod: 'October - November / March - April',
    harvestingGuidance: 'Harvest when 80-85% of panicles turn golden yellow and grain moisture drops below 20%.',
    storageGuidance: 'Sun-dry grains to 12–14% moisture content before storing in gunny bags.',
    marketOverview: 'High market demand with strong local MSP support and basmati export potential.',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'crop_tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    cropType: 'Horticultural Crop',
    growingSeason: 'Kharif / Rabi (90–120 days)',
    tempMin: 18,
    tempMax: 32,
    soilRequirements: 'Well-drained sandy loam rich in organic matter',
    soilPhMin: 6.0,
    soilPhMax: 7.0,
    waterRequirement: 'Moderate (600–800 mm). Drip irrigation recommended.',
    irrigationGuidance: 'Irrigate at 2-3 day intervals during flowering and fruiting stage.',
    fertilizationSchedule: 'NPK 100:60:60 kg/ha. Inject water-soluble 19:19:19 via drip weekly.',
    plantingInfo: 'Transplant 25–30 day seedlings at 60x45 cm spacing on raised beds.',
    seedInfo: 'Requires 100–150 g hybrid seeds per acre.',
    growthStages: JSON.stringify([
      'Land Preparation', 'Seed Selection', 'Seed Treatment', 'Nursery Preparation',
      'Sowing / Transplanting', 'Germination', 'Early Growth', 'Vegetative Growth',
      'Flowering', 'Fruit / Grain Development', 'Maturity', 'Harvest', 'Post-Harvest'
    ]),
    expectedHarvestPeriod: '75–90 days after transplanting (multiple pickings)',
    harvestingGuidance: 'Pick fruits at breaker stage (pink blush) for long-distance transport.',
    storageGuidance: 'Store at 12–15°C with 85–90% relative humidity.',
    marketOverview: 'Stable vegetable demand with high price surge during off-season monsoon months.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
  },
];

const MOCK_WEATHER: WeatherData = {
  location: 'Kottayam, Kerala',
  temperature: 28.5,
  feelsLike: 31.2,
  humidity: 78,
  windSpeed: 12.4,
  pressure: 1011,
  cloudPercentage: 40,
  rainProbability: 25,
  condition: 'Partly Cloudy',
  icon: 'cloud-sun',
  forecast: [
    { day: 'Today', date: 'Aug 14', tempMin: 23, tempMax: 31, rainProbability: 25, humidity: 78, windSpeed: 12, condition: 'Partly Cloudy', icon: 'cloud-sun' },
    { day: 'Tomorrow', date: 'Aug 15', tempMin: 24, tempMax: 32, rainProbability: 60, humidity: 82, windSpeed: 14, condition: 'Light Rain', icon: 'cloud-rain' },
    { day: 'Sunday', date: 'Aug 16', tempMin: 22, tempMax: 30, rainProbability: 80, humidity: 85, windSpeed: 18, condition: 'Thunderstorm', icon: 'cloud-lightning' },
    { day: 'Monday', date: 'Aug 17', tempMin: 23, tempMax: 31, rainProbability: 35, humidity: 75, windSpeed: 10, condition: 'Sunny Spells', icon: 'sun' },
    { day: 'Tuesday', date: 'Aug 18', tempMin: 24, tempMax: 33, rainProbability: 15, humidity: 70, windSpeed: 8, condition: 'Clear Sky', icon: 'sun' },
  ],
  hourly: [
    { time: '06:00', temp: 24, rainProbability: 10, condition: 'Clear' },
    { time: '09:00', temp: 27, rainProbability: 15, condition: 'Sunny' },
    { time: '12:00', temp: 31, rainProbability: 25, condition: 'Partly Cloudy' },
    { time: '15:00', temp: 30, rainProbability: 30, condition: 'Cloudy' },
    { time: '18:00', temp: 28, rainProbability: 20, condition: 'Fair' },
    { time: '21:00', temp: 26, rainProbability: 10, condition: 'Clear' },
  ],
  recommendations: [
    'Good conditions for morning fertilizer application before temperature peak.',
    'Expect rain showers on Saturday; avoid spraying pesticides after Friday evening.',
  ],
};

const MOCK_WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: 'alt_1',
    title: 'Moderate Rainfall Advisory',
    severity: 'MEDIUM',
    description: 'Heavy localized rainfall expected on Saturday with gusts up to 25 km/h.',
    recommendedAction: 'Clear field drainage channels and postpone spray applications.',
    validUntil: 'Aug 16, 2026',
  },
];

const MOCK_SOIL: SoilRecord[] = [
  {
    id: 'soil_1',
    location: 'Kottayam Sector 2',
    soilType: 'Clay Loam',
    ph: 6.4,
    moisture: 45.2,
    nitrogen: 220,
    phosphorus: 34,
    potassium: 195,
    organicMatter: 2.8,
    healthScore: 86.5,
    isEstimated: false,
    recommendations: 'Optimal soil health. Top-dress 15 kg Nitrogen per acre during active tillering.',
    createdAt: '2026-08-10',
  },
];

const MOCK_MARKET: MarketPrice[] = [
  { id: 'mkt_1', cropId: 'crop_rice', cropName: 'Paddy Rice (Grade A)', market: 'Kottayam Mandi', location: 'Kerala', currentPrice: 24.5, previousPrice: 23.8, priceChange: 0.7, unit: 'kg', recordedAt: '2026-08-14' },
  { id: 'mkt_2', cropId: 'crop_tomato', cropName: 'Hybrid Tomato', market: 'Ernakulam Wholesale', location: 'Kerala', currentPrice: 38.0, previousPrice: 34.5, priceChange: 3.5, unit: 'kg', recordedAt: '2026-08-14' },
  { id: 'mkt_3', cropId: 'crop_coconut', cropName: 'Raw Coconut', market: 'Alappuzha Market', location: 'Kerala', currentPrice: 32.0, previousPrice: 33.5, priceChange: -1.5, unit: 'nut', recordedAt: '2026-08-14' },
  { id: 'mkt_4', cropId: 'crop_chilli', cropName: 'Green Chilli (Guntur)', market: 'Kottayam Mandi', location: 'Kerala', currentPrice: 55.0, previousPrice: 50.0, priceChange: 5.0, unit: 'kg', recordedAt: '2026-08-14' },
];

const MOCK_EVENTS: CropCalendarEvent[] = [
  {
    id: 'evt_1',
    cropId: 'crop_rice',
    crop: MOCK_CROPS[0],
    plantingDate: '2026-08-01',
    activityName: 'Active Tillering & Nutrient Top-Dressing',
    stage: 'Tillering Phase',
    scheduledDate: '2026-08-15',
    status: 'PENDING',
    priority: 'HIGH',
    description: 'Apply 20 kg Urea per acre. Inspect for leaf folder and blast spots.',
    waterRequirement: '2-5 cm standing water',
    fertilizerTask: 'Top-dress Urea @ 20 kg/acre',
    diseaseMonitoring: 'Check for Blast leaf spots',
    pestMonitoring: 'Scout for Stem Borer & Leaf Folder',
    recommendation: 'Apply fertilizer in early morning when soil is moist.',
  },
  {
    id: 'evt_2',
    cropId: 'crop_tomato',
    crop: MOCK_CROPS[1],
    plantingDate: '2026-07-20',
    activityName: 'Drip Fertigation & Staking Tie-Up',
    stage: 'Vegetative / Flowering Prep',
    scheduledDate: '2026-08-12',
    status: 'COMPLETED',
    completedDate: '2026-08-12',
    priority: 'MEDIUM',
    description: 'Bind branches to bamboo stakes. Inject 19:19:19 water soluble NPK.',
    waterRequirement: '2 liters per plant daily via drip',
    fertilizerTask: 'Inject 19:19:19 @ 3 kg/acre',
    diseaseMonitoring: 'Inspect lower leaves for Early Blight spots',
    pestMonitoring: 'Scout for Whitefly & Leaf Miner',
    recommendation: 'Prune bottom leaves touching soil.',
  },
];

const MOCK_SCANS: DiseaseScanResult[] = [
  {
    id: 'scan_1',
    detectedDisease: 'Rice Blast (Magnaporthe oryzae)',
    confidence: 94.2,
    confidenceLevel: 'HIGH',
    cropName: 'Rice',
    symptoms: ['Diamond-shaped lesion on leaves with gray center', 'Brown reddish margins'],
    causes: ['Fungal pathogen Magnaporthe oryzae', 'High humidity (>90%) and leaf wetness'],
    immediateActions: ['Spray Tricyclazole 75% WP @ 0.6g/L water', 'Avoid excess nitrogen fertilization'],
    prevention: ['Use resistant varieties', 'Maintain proper plant spacing'],
    treatmentGuidance: {
      cultural: ['Avoid flooding field continuously', 'Drain water temporarily'],
      sanitation: ['Remove infected crop residue'],
      biological: ['Apply Pseudomonas fluorescens @ 10g/L'],
      expertAdvice: 'High confidence diagnosis. Apply systemic fungicide immediately during dry hours.',
    },
    isLowConfidence: false,
    createdAt: '2026-08-13',
  },
];

function deriveNameFromEmail(email: string): string {
  if (!email || !email.includes('@')) return 'Farmer';
  const prefix = email.split('@')[0];
  if (!prefix || prefix.toLowerCase() === 'farmer') return 'Farmer';

  return prefix
    .split(/[\._\-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function getMockFallback<T>(endpoint: string, options: RequestInit = {}): any {
  if (endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register')) {
    let email = 'farmer@farmpilot.ai';
    let name: string | undefined = undefined;

    if (typeof options.body === 'string') {
      try {
        const parsed = JSON.parse(options.body);
        if (parsed.email) email = parsed.email;
        if (parsed.name) name = parsed.name;
      } catch (e) {}
    }

    let usersDb: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      try {
        const savedDb = localStorage.getItem('farmpilot_users_db');
        if (savedDb) usersDb = JSON.parse(savedDb);
      } catch (e) {}
    }

    if (name) {
      usersDb[email.toLowerCase()] = name;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('farmpilot_users_db', JSON.stringify(usersDb));
        } catch (e) {}
      }
    }

    let displayName = name || usersDb[email.toLowerCase()];
    if (!displayName) {
      displayName = deriveNameFromEmail(email);
    }

    const user = {
      ...MOCK_USER,
      id: `usr_${Date.now()}`,
      email,
      name: displayName,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('farmpilot_user_session', JSON.stringify(user));
      } catch (e) {}
    }

    return { token: 'jwt-token-farmpilot-2026', user };
  }
  if (endpoint.startsWith('/auth/me')) {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('farmpilot_user_session');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    return MOCK_USER;
  }
  if (endpoint.startsWith('/weather/alerts')) {
    return MOCK_WEATHER_ALERTS;
  }
  if (endpoint.startsWith('/weather')) {
    return MOCK_WEATHER;
  }
  if (endpoint.startsWith('/soil')) {
    return MOCK_SOIL;
  }
  if (endpoint.startsWith('/market/trends')) {
    return {
      trends: [
        { date: 'Aug 08', price: 22.0 },
        { date: 'Aug 09', price: 22.5 },
        { date: 'Aug 10', price: 23.0 },
        { date: 'Aug 11', price: 23.8 },
        { date: 'Aug 12', price: 24.0 },
        { date: 'Aug 13', price: 24.2 },
        { date: 'Aug 14', price: 24.5 },
      ],
    };
  }
  if (endpoint.startsWith('/market')) {
    return MOCK_MARKET;
  }
  if (endpoint.startsWith('/calendar/generate')) {
    return MOCK_EVENTS;
  }
  if (endpoint.startsWith('/calendar')) {
    return MOCK_EVENTS;
  }
  if (endpoint.startsWith('/disease/scans')) {
    return MOCK_SCANS;
  }
  if (endpoint.startsWith('/disease/scan')) {
    return MOCK_SCANS[0];
  }
  if (endpoint.startsWith('/crops')) {
    return MOCK_CROPS;
  }
  if (endpoint.startsWith('/farms')) {
    return MOCK_USER.farms;
  }
  if (endpoint.startsWith('/notifications')) {
    return [
      {
        id: 'notif_1',
        title: 'Rainfall Alert',
        message: 'Light rain expected tomorrow. Plan irrigation accordingly.',
        type: 'WEATHER',
        severity: 'INFO',
        isRead: false,
        createdAt: '2026-08-14',
      },
    ];
  }
  if (endpoint.startsWith('/advisor')) {
    return {
      answer: 'For yellowing leaves on paddy, top-dress Nitrogen (Urea @ 20kg/acre) and inspect lower leaves for Blast fungal lesions.',
    };
  }
  if (endpoint.startsWith('/finance')) {
    return [
      { id: 'exp_1', category: 'Fertilizers', description: 'Urea & NPK 19:19:19 purchase', amount: 4500, date: '2026-08-05' },
      { id: 'exp_2', category: 'Seeds', description: 'Certified Hybrid Rice Seed 25kg', amount: 3200, date: '2026-08-01' },
    ];
  }
  return {};
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('farmpilot_token');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data;
    } catch (err: any) {
      console.warn(`[ApiClient] Network/Server unavailable for ${endpoint}. Using standalone demo mode fallback:`, err.message);
      const fallbackData = getMockFallback<T>(endpoint, options);
      return fallbackData as T;
    }
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

