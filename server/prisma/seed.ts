import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FarmPilot AI database seed...');

  // Clear existing data
  await prisma.expense.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.weatherAlert.deleteMany();
  await prisma.weatherRecord.deleteMany();
  await prisma.soilRecord.deleteMany();
  await prisma.cropCalendarEvent.deleteMany();
  await prisma.diseaseScan.deleteMany();
  await prisma.treatmentRecommendation.deleteMany();
  await prisma.disease.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Demo User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'farmer@farmpilot.ai',
      password: hashedPassword,
      name: 'Ramesh Patel',
      profile: {
        create: {
          phone: '+91 98765 43210',
          location: 'Kottayam, Kerala',
          farmSize: 4.5,
          farmingExperience: '8 years',
          mainCrop: 'Rice, Tomato & Chilli',
        },
      },
    },
  });

  console.log(`👤 Created Demo User: ${demoUser.name} (${demoUser.email})`);

  // 2. Seed Demo Farm
  const demoFarm = await prisma.farm.create({
    data: {
      userId: demoUser.id,
      name: 'Green Canopy Farm Sector A',
      location: 'Kottayam Sector 2',
      area: 4.5,
      soilType: 'Clay Loam',
      irrigationType: 'Drip & Basin Irrigation',
    },
  });

  // 3. Seed 13 Standard Agronomic Stages
  const standard13Stages = [
    'Land Preparation',
    'Seed Selection',
    'Seed Treatment',
    'Nursery Preparation',
    'Sowing / Transplanting',
    'Germination',
    'Early Growth',
    'Vegetative Growth',
    'Flowering',
    'Fruit / Grain Development',
    'Maturity',
    'Harvest',
    'Post-Harvest',
  ];

  // 4. Seed Crops (Rice, Tomato, Chilli)
  const rice = await prisma.crop.create({
    data: {
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
      growthStages: JSON.stringify(standard13Stages),
      expectedHarvestPeriod: 'October - November / March - April',
      harvestingGuidance: 'Harvest when 80-85% of panicles turn golden yellow and grain moisture drops below 20%.',
      storageGuidance: 'Sun-dry grains to 12–14% moisture content before storing in moisture-proof silos or gunny bags.',
      marketOverview: 'High market demand with strong local MSP support and basmati export potential.',
      imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800',
    },
  });

  const tomato = await prisma.crop.create({
    data: {
      name: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      cropType: 'Horticultural Fruit Crop',
      growingSeason: 'Year-round (90–120 days)',
      tempMin: 18,
      tempMax: 30,
      soilRequirements: 'Well-drained sandy loam rich in organic matter',
      soilPhMin: 6.0,
      soilPhMax: 7.0,
      waterRequirement: 'Moderate (400–600 mm). Sensitive to drought and waterlogging.',
      irrigationGuidance: 'Drip irrigation recommended every 2-3 days. Avoid overhead watering to prevent leaf fungus.',
      fertilizationSchedule: 'NPK 100:60:60 kg/ha. Basal FYM 10 t/ha; weekly NPK drip fertigation during fruiting.',
      plantingInfo: 'Transplant 25-30 day seedlings on raised beds with mulch film. Spacing 60x45 cm.',
      seedInfo: 'Requires 60–80 g certified hybrid seeds per acre.',
      growthStages: JSON.stringify(standard13Stages),
      expectedHarvestPeriod: '90-120 days from planting',
      harvestingGuidance: 'Harvest firm pink/breaker fruits every 3 days using clean pruning shears.',
      storageGuidance: 'Store harvested tomatoes in ventilated crates at 12–15°C; avoid direct sunlight exposure.',
      marketOverview: 'High daily culinary demand with price elasticity during monsoon supply windows.',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    },
  });

  const chilli = await prisma.crop.create({
    data: {
      name: 'Chilli',
      scientificName: 'Capsicum annuum',
      cropType: 'Spice & Vegetable Crop',
      growingSeason: 'Kharif / Summer (120–160 days)',
      tempMin: 20,
      tempMax: 35,
      soilRequirements: 'Deep, well-drained loamy soil rich in organic humus',
      soilPhMin: 6.0,
      soilPhMax: 7.2,
      waterRequirement: 'Moderate (500–700 mm). High moisture at flowering causes blossom drop.',
      irrigationGuidance: 'Irrigate at critical stages: transplanting, flowering, and fruit development.',
      fertilizationSchedule: 'NPK 120:60:60 kg/ha. Split application of Nitrogen at 30, 60, and 90 days after transplanting.',
      plantingInfo: 'Transplant 30–35 day old seedlings at 60x45 cm spacing on raised beds.',
      seedInfo: 'Requires 100–150 g hybrid seeds per acre.',
      growthStages: JSON.stringify(standard13Stages),
      expectedHarvestPeriod: 'First pick at 75-80 days; multiple picks every 7-10 days.',
      harvestingGuidance: 'Harvest green fruits for fresh vegetable market or fully red pods for dry spice processing.',
      storageGuidance: 'Sun-dry red chillies to 10% moisture content before packing in gunny bags.',
      marketOverview: 'Excellent cash crop value for both domestic spice markets and oleoresin export industry.',
      imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800',
    },
  });

  console.log(`🌾 Seeded Crops: ${rice.name}, ${tomato.name}, ${chilli.name}`);

  // 5. Seed Realistic Diseases for Rice, Tomato, and Chilli
  // --- Rice Diseases ---
  const riceBlast = await prisma.disease.create({
    data: {
      cropId: rice.id,
      name: 'Rice Blast',
      category: 'Fungal (Magnaporthe oryzae)',
      symptoms: 'Spindle-shaped or diamond-shaped lesions with reddish-brown borders and gray centers on leaves. Collar rot and neck rot leading to empty white heads.',
      causes: 'Fungal spores transmitted via wind, infected crop residue, and high nitrogen application.',
      favorableConditions: 'High relative humidity (>90%), cool night temperatures (20–24°C), and dew presence.',
      prevention: 'Use blast-resistant varieties. Avoid excessive Nitrogen fertilization. Treat seeds before sowing.',
      severity: 'SEVERE',
      imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800',
      treatmentRecommendations: {
        create: [
          { title: 'Cultural Control', details: 'Maintain balanced Nitrogen application; apply Potassium in two split doses to strengthen plant cell walls.', treatmentType: 'Cultural' },
          { title: 'Field Sanitation', details: 'Destroy infected paddy stubble after harvest; remove weed hosts along field bunds.', treatmentType: 'Sanitation' },
          { title: 'Biological Treatment', details: 'Foliar spray of Pseudomonas fluorescens (10g/L) at 15-day intervals during early vegetative stage.', treatmentType: 'Biological' },
        ],
      },
    },
  });

  const riceBrownSpot = await prisma.disease.create({
    data: {
      cropId: rice.id,
      name: 'Brown Spot',
      category: 'Fungal (Bipolaris oryzae)',
      symptoms: 'Small oval or circular sesame seed-like brown spots with yellow halos scattered over leaf blades. Reduced seed germination and spotted grains.',
      causes: 'Nutritional deficiency (especially Potassium and Manganese) combined with water stress.',
      favorableConditions: 'Unirrigated dry paddy fields, nutrient-deficient soils, temperatures around 25-30°C.',
      prevention: 'Apply balanced soil NPK + Micronutrients. Ensure regular field irrigation to prevent soil drying.',
      severity: 'MODERATE',
      imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800',
      treatmentRecommendations: {
        create: [
          { title: 'Soil Nutrition', details: 'Apply Potash (MOP) and Zinc Sulfate at active tillering phase.', treatmentType: 'Cultural' },
          { title: 'Sanitation', details: 'Use certified disease-free seeds and hot-water seed treatment at 52°C for 10 min.', treatmentType: 'Sanitation' },
          { title: 'Bio-Control', details: 'Seed treatment with Trichoderma viride @ 4g/kg seed.', treatmentType: 'Biological' },
        ],
      },
    },
  });

  // --- Tomato Diseases ---
  const tomatoEarlyBlight = await prisma.disease.create({
    data: {
      cropId: tomato.id,
      name: 'Tomato Early Blight',
      category: 'Fungal (Alternaria solani)',
      symptoms: 'Dark brown concentric target-board rings on older lower leaves, leaf yellowing, premature defoliation, and sunken dark lesions near fruit stem.',
      causes: 'Rain splashing, wind-borne spores, and crop residue carrying overwintered fungal mycelium.',
      favorableConditions: 'Warm temperature (24–29°C) accompanied by heavy rainfall, dew, or high humidity.',
      prevention: 'Rotate crops with non-solanaceous crops. Prune lower branches up to 30 cm from ground level. Mulch soil surface.',
      severity: 'MODERATE',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      treatmentRecommendations: {
        create: [
          { title: 'Pruning & Canopy Care', details: 'Remove bottom 30 cm yellowing leaves to improve airflow and stop splash infection.', treatmentType: 'Cultural' },
          { title: 'Sanitation', details: 'Dispose of infected leaves in sealed compost or burn outside field boundary.', treatmentType: 'Sanitation' },
          { title: 'Biological Spray', details: 'Foliar application of Bacillus subtilis or Trichoderma harzianum @ 5g/L water.', treatmentType: 'Biological' },
        ],
      },
    },
  });

  const tomatoLateBlight = await prisma.disease.create({
    data: {
      cropId: tomato.id,
      name: 'Tomato Late Blight',
      category: 'Oomycete (Phytophthora infestans)',
      symptoms: 'Water-soaked dark green/black greasy spots on leaf tips with white cottony mold underneath. Rapid vine decay and brown leathery fruit rot.',
      causes: 'Wind-blown spores in wet foggy weather causing field-wide canopy collapse within 48-72 hours.',
      favorableConditions: 'Cool night temperature (10–18°C), high humidity (>90%), and leaf wetness.',
      prevention: 'Plant resistant hybrids. Use protective rain shelters or drip irrigation to keep foliage dry.',
      severity: 'SEVERE',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      treatmentRecommendations: {
        create: [
          { title: 'Water Control', details: 'Immediately stop overhead irrigation; install drip lines beneath silver mulch.', treatmentType: 'Cultural' },
          { title: 'Sanitation', details: 'Uproot severely rotted plants immediately to prevent field-wide destruction.', treatmentType: 'Sanitation' },
          { title: 'Bio-Protection', details: 'Prophylactic spray of Copper Hydroxide or bio-fungicide before heavy monsoon showers.', treatmentType: 'Biological' },
        ],
      },
    },
  });

  // --- Chilli Diseases ---
  const chilliAnthracnose = await prisma.disease.create({
    data: {
      cropId: chilli.id,
      name: 'Chilli Anthracnose / Fruit Rot',
      category: 'Fungal (Colletotrichum capsici)',
      symptoms: 'Circular sunken dark brown lesions on green and red chilli fruits with black concentric acervuli dots. Die-back of twig tips.',
      causes: 'Seed-borne fungal inoculum spread by rain splashes and infected crop debris.',
      favorableConditions: 'High humidity (>80%), frequent rainfall, and warm temperatures around 28-30°C during fruiting.',
      prevention: 'Use certified disease-free seeds. Treat seeds with bio-agents. Ensure proper field drainage.',
      severity: 'SEVERE',
      imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800',
      treatmentRecommendations: {
        create: [
          { title: 'Fruit Sanitation', details: 'Pick affected spotted fruits early and destroy to prevent spore dissemination.', treatmentType: 'Sanitation' },
          { title: 'Biological Spray', details: 'Foliar spray of Pseudomonas fluorescens @ 10g/L or Trichoderma viride @ 5g/L at flower initiation.', treatmentType: 'Biological' },
          { title: 'Canopy Management', details: 'Maintain 60x45 cm plant spacing for adequate aeration between chilli bushes.', treatmentType: 'Cultural' },
        ],
      },
    },
  });

  const chilliLeafCurl = await prisma.disease.create({
    data: {
      cropId: chilli.id,
      name: 'Chilli Leaf Curl Virus (ChLCV)',
      category: 'Viral (Geminiviridae transmitted by Whitefly)',
      symptoms: 'Upward curling of leaves, puckering, reduced leaf size, stunting of plants, and flower drop leading to bushy sterile growth.',
      causes: 'Transmitted by Whitefly vector (*Bemisia tabaci*) from infected weed hosts.',
      favorableConditions: 'Dry warm dry weather encouraging high whitefly vector population.',
      prevention: 'Raise seedlings under 40-mesh insect net. Install yellow sticky traps (15/acre) in field.',
      severity: 'SEVERE',
      imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800',
      treatmentRecommendations: {
        create: [
          { title: 'Vector Control Traps', details: 'Erect yellow sticky cards at canopy height to capture whiteflies.', treatmentType: 'Cultural' },
          { title: 'Sanitation', details: 'Rough out severely stunted viral-infected plants in sealed plastic bags.', treatmentType: 'Sanitation' },
          { title: 'Botanical Spray', details: 'Foliar spray of Neem Oil (10,000 ppm) @ 3ml/L water to deter sucking pests.', treatmentType: 'Biological' },
        ],
      },
    },
  });

  console.log('🦠 Seeded Realistic Crop Diseases & IPM Recommendations');

  // 6. Seed Pre-calculated 13-Stage Crop Calendar Events for Demo User
  const plantingDate = new Date();
  plantingDate.setDate(plantingDate.getDate() - 20); // 20 days ago

  const rice13TaskTemplates = [
    { stage: 'Land Preparation', offsetDays: -10, name: 'Deep Plowing & Basal FYM Incorporation', priority: 'HIGH', desc: 'Plow field to 20 cm depth and incorporate 5 t/ha FYM compost.' },
    { stage: 'Seed Selection', offsetDays: -5, name: 'Certified Paddy Seed Selection', priority: 'MEDIUM', desc: 'Select certified high-yielding Basmati / Swarna seed variety.' },
    { stage: 'Seed Treatment', offsetDays: -2, name: 'Carbendazim Seed Treatment', priority: 'HIGH', desc: 'Soak seeds in bio-fungicide slurry for 12 hours prior to nursery bed.' },
    { stage: 'Nursery Preparation', offsetDays: 0, name: 'Wet Nursery Bed Setup & Sowing', priority: 'HIGH', desc: 'Prepare 10 cm raised wet nursery beds and broadcast sprouted seeds.' },
    { stage: 'Sowing / Transplanting', offsetDays: 20, name: 'Main Field Paddy Transplanting', priority: 'HIGH', desc: 'Transplant 20-25 day seedlings at 20x15 cm spacing with 2-3 seedlings/hill.' },
    { stage: 'Germination', offsetDays: 25, name: 'Nursery Emergence & Thin Moisture Check', priority: 'MEDIUM', desc: 'Ensure nursery bed retains saturation without submerging shoot tips.' },
    { stage: 'Early Growth', offsetDays: 35, name: 'First Weeding & Basal Nitrogen Top-Dressing', priority: 'MEDIUM', desc: 'Perform manual weeding and top-dress 35 kg Urea per acre.' },
    { stage: 'Vegetative Growth', offsetDays: 50, name: 'Active Tillering Water Management', priority: 'HIGH', desc: 'Maintain 3-5 cm standing water layer across all paddy basins.' },
    { stage: 'Flowering', offsetDays: 70, name: 'Panicle Initiation & Potash Application', priority: 'HIGH', desc: 'Top-dress MOP (Potash) and monitor leaf tips for blast lesions.' },
    { stage: 'Fruit / Grain Development', offsetDays: 85, name: 'Milky Grain Stage Inspection', priority: 'MEDIUM', desc: 'Check for gundhi bug infestation and sheath blight symptoms.' },
    { stage: 'Maturity', offsetDays: 110, name: 'Terminal Field Drainage', priority: 'HIGH', desc: 'Drain standing field water completely 10 days before harvesting.' },
    { stage: 'Harvest', offsetDays: 125, name: 'Paddy Mechanical Harvesting', priority: 'HIGH', desc: 'Harvest when 85% grains turn golden yellow and grain moisture is 18-20%.' },
    { stage: 'Post-Harvest', offsetDays: 130, name: 'Sun Drying & Grain Storage', priority: 'MEDIUM', desc: 'Sun-dry harvested paddy grains to 12-14% moisture before bagging.' },
  ];

  for (const t of rice13TaskTemplates) {
    const scheduledDate = new Date(plantingDate.getTime() + t.offsetDays * 86400000);
    const isPast = scheduledDate < new Date();

    await prisma.cropCalendarEvent.create({
      data: {
        userId: demoUser.id,
        farmId: demoFarm.id,
        cropId: rice.id,
        plantingDate,
        activityName: t.name,
        stage: t.stage,
        scheduledDate,
        status: isPast ? 'COMPLETED' : 'PENDING',
        completedDate: isPast ? scheduledDate : null,
        priority: t.priority,
        description: t.desc,
        waterRequirement: 'Maintain 2-5 cm standing water in paddy basin',
        fertilizerTask: t.stage.includes('Growth') || t.stage.includes('Flowering') ? 'Top-dress Nitrogen & Potash' : 'None',
        soilConsiderations: 'Clay loam water retention optimal',
        diseaseMonitoring: 'Inspect leaf blades for blast lesions & sheath rot',
        pestMonitoring: 'Monitor stem borer egg masses & whitefly vectors',
        weatherConsiderations: 'Postpone spraying if rain probability exceeds 50%',
        recommendation: t.desc,
      },
    });
  }

  console.log('📅 Seeded 13-Stage Crop Calendar Events for Demo User');

  // 7. Seed Soil Record
  await prisma.soilRecord.create({
    data: {
      userId: demoUser.id,
      farmId: demoFarm.id,
      location: 'Kottayam Sector 2',
      soilType: 'Clay Loam',
      ph: 6.4,
      moisture: 45.2,
      nitrogen: 220,
      phosphorus: 42,
      potassium: 195,
      organicMatter: 2.8,
      healthScore: 86.5,
      recommendations: 'Soil condition is highly optimal for Rice and Tomato cultivation. Apply 50 kg/ha organic compost to maintain organic carbon level.',
    },
  });

  // 8. Seed Weather Record & Alerts
  await prisma.weatherRecord.create({
    data: {
      location: 'Kottayam, Kerala',
      temperature: 28.5,
      feelsLike: 31.0,
      humidity: 78,
      windSpeed: 12.4,
      pressure: 1012,
      cloudPercentage: 40,
      rainProbability: 35,
      condition: 'Partly Cloudy',
      icon: '02d',
    },
  });

  await prisma.weatherAlert.create({
    data: {
      title: 'Moderate Humidity Alert',
      severity: 'WARNING',
      description: 'Relative humidity expected to reach 85% overnight. Heightened risk for fungal spore germination on Tomato and Chilli foliage.',
      recommendedAction: 'Inspect crop canopy for early blight and anthracnose spots. Ensure adequate row ventilation.',
      location: 'Kottayam, Kerala',
      validUntil: new Date(Date.now() + 86400000 * 2),
    },
  });

  // 9. Seed Market Commodity Prices (Rice, Tomato, Chilli)
  await prisma.marketPrice.createMany({
    data: [
      { cropId: rice.id, cropName: 'Rice (Sona Masoori)', market: 'Kottayam Central Mandi', location: 'Kottayam', currentPrice: 38.5, previousPrice: 36.0, priceChange: 2.5, unit: 'INR/kg' },
      { cropId: tomato.id, cropName: 'Tomato (Hybrid F1)', market: 'Ernakulam Wholesale Market', location: 'Ernakulam', currentPrice: 24.0, previousPrice: 28.0, priceChange: -4.0, unit: 'INR/kg' },
      { cropId: chilli.id, cropName: 'Chilli (Red Dry)', market: 'Guntur Spice Mandi', location: 'Guntur', currentPrice: 185.0, previousPrice: 172.0, priceChange: 13.0, unit: 'INR/kg' },
    ],
  });

  console.log('✅ FarmPilot AI Database Seeding Finished Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
