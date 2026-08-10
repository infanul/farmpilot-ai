import { PrismaClient } from '@prisma/client';
import { WeatherService } from './weatherService';

const prisma = new PrismaClient();

export class CalendarService {
  /**
   * Generates a complete 13-stage agronomic calendar for Rice, Banana, Tomato, or Chilli
   */
  public static async generateCalendarForCrop(
    userId: string,
    farmId: string | null,
    cropId: string,
    plantingDateStr: string
  ) {
    const crop = await prisma.crop.findUnique({ where: { id: cropId } });
    if (!crop) throw new Error('Crop not found');

    const plantingDate = new Date(plantingDateStr);
    const cropName = crop.name.toLowerCase();

    // 13 Agronomic Stage Templates for Rice, Banana, Tomato, and Chilli
    let taskTemplates: Array<{
      stage: string;
      offsetDays: number;
      activityName: string;
      priority: string;
      description: string;
      waterRequirement: string;
      fertilizerTask: string;
      soilConsiderations: string;
      diseaseMonitoring: string;
      pestMonitoring: string;
      weatherConsiderations: string;
    }> = [];

    if (cropName.includes('rice')) {
      taskTemplates = [
        {
          stage: 'Land Preparation',
          offsetDays: -10,
          activityName: 'Deep Plowing & Basal FYM Incorporation',
          priority: 'HIGH',
          description: 'Plow field to 20 cm depth and incorporate 5 t/ha FYM compost + basal NPK before puddling.',
          waterRequirement: 'Initial soaking irrigation required',
          fertilizerTask: 'Basal NPK 40:60:40 kg/ha',
          soilConsiderations: 'Test soil pH (5.5-6.5 optimal); puddling creates impervious hardpan',
          diseaseMonitoring: 'Check field bunds for weed hosts',
          pestMonitoring: 'Monitor soil grub activity during plowing',
          weatherConsiderations: 'Ensure good field drainage before heavy pre-monsoon rains',
        },
        {
          stage: 'Seed Selection',
          offsetDays: -5,
          activityName: 'Certified High-Yield Variety Selection',
          priority: 'MEDIUM',
          description: 'Procure certified clean seeds (Basmati / Swarna / MTU 1010) from registered seeds outlet.',
          waterRequirement: 'N/A',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Select seed suitability for clay loam or alluvial soil',
          diseaseMonitoring: 'Ensure seeds are free from brown spot discolorations',
          pestMonitoring: 'Inspect seed bags for store grain weevils',
          weatherConsiderations: 'Store seed bags in dry shaded location',
        },
        {
          stage: 'Seed Treatment',
          offsetDays: -2,
          activityName: 'Bio-Fungicide & Carbendazim Seed Soak',
          priority: 'HIGH',
          description: 'Soak seeds in Carbendazim solution (2g/kg) or Trichoderma viride (4g/kg) for 12 hours.',
          waterRequirement: 'Clean soaking water required',
          fertilizerTask: 'Seed treatment bio-agents',
          soilConsiderations: 'Prevents soil-borne seedling rot in wet bed nursery',
          diseaseMonitoring: 'Prevents seedling blast and brown spot carrying over',
          pestMonitoring: 'N/A',
          weatherConsiderations: 'Keep soaking container shaded from direct midday heat',
        },
        {
          stage: 'Nursery Preparation',
          offsetDays: 0,
          activityName: 'Wet Bed Nursery Layout & Seed Sowing',
          priority: 'HIGH',
          description: 'Prepare 10 cm raised wet nursery beds, apply compost, and broadcast sprouted seeds uniformly.',
          waterRequirement: 'Keep nursery bed saturated with 1 cm water layer',
          fertilizerTask: 'Apply 1 kg Nitrogen per 100 sq.m nursery bed',
          soilConsiderations: 'Fine seedbed tilth required for rapid root anchoring',
          diseaseMonitoring: 'Watch for nursery damping-off lesions',
          pestMonitoring: 'Cover with thin nylon net to deter bird pecking',
          weatherConsiderations: 'Avoid seed broadcasting right before torrential downpour',
        },
        {
          stage: 'Sowing / Transplanting',
          offsetDays: 20,
          activityName: 'Main Field Paddy Seedling Transplanting',
          priority: 'HIGH',
          description: 'Uproot 20-25 day old nursery seedlings and transplant 2-3 seedlings per hill at 20x15 cm spacing.',
          waterRequirement: 'Maintain 2 cm standing water during transplanting',
          fertilizerTask: 'Zinc Sulfate application 25 kg/ha if deficient',
          soilConsiderations: 'Puddled mud consistency facilitates smooth hand insertion',
          diseaseMonitoring: 'Check seedling root tips for nematode galls',
          pestMonitoring: 'Inspect seedling leaves for thrips curling',
          weatherConsiderations: 'Transplant during cool morning or evening hours',
        },
        {
          stage: 'Germination',
          offsetDays: 25,
          activityName: 'Nursery Emergence & Thin Moisture Check',
          priority: 'MEDIUM',
          description: 'Ensure nursery bed retains saturation without submerging green shoot tips.',
          waterRequirement: 'Saturated mud; drain excess rainwater',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Prevent soil crusting',
          diseaseMonitoring: 'Monitor for pythium root rot',
          pestMonitoring: 'Check for leafhoppers on shoot tips',
          weatherConsiderations: 'Drain nursery bed during heavy downpours',
        },
        {
          stage: 'Early Growth',
          offsetDays: 35,
          activityName: 'First Weed Management & Nitrogen Top-Dressing',
          priority: 'MEDIUM',
          description: 'Perform cono-weeder passing or hand weeding; top-dress 35 kg Urea/acre in standing water.',
          waterRequirement: 'Maintain 2-3 cm standing water',
          fertilizerTask: 'Top-dress 35 kg Urea per acre',
          soilConsiderations: 'Aerates soil around seedling hills',
          diseaseMonitoring: 'Inspect leaf blades for small spindle blast spots',
          pestMonitoring: 'Check for yellow stem borer egg masses on leaf tips',
          weatherConsiderations: 'Apply fertilizer on sunny morning after dew clears',
        },
        {
          stage: 'Vegetative Growth',
          offsetDays: 50,
          activityName: 'Active Tillering Water Management',
          priority: 'HIGH',
          description: 'Maintain 3-5 cm standing water layer across all paddy basins to maximize tiller density.',
          waterRequirement: 'Critical standing water phase (3-5 cm depth)',
          fertilizerTask: 'Second split Nitrogen application',
          soilConsiderations: 'Prevent soil cracking to preserve root system',
          diseaseMonitoring: 'Inspect sheath bases for sheath blight snake-skin spots',
          pestMonitoring: 'Monitor Brown Plant Hopper (BPH) numbers at hill bases',
          weatherConsiderations: 'High atmospheric humidity increases sheath blight risk',
        },
        {
          stage: 'Flowering',
          offsetDays: 70,
          activityName: 'Panicle Initiation & Potash Top-Dressing',
          priority: 'HIGH',
          description: 'Top-dress Potash (MOP) 30 kg/acre at panicle emergence to enhance grain weight.',
          waterRequirement: 'Continuous 5 cm standing water level required',
          fertilizerTask: 'Apply Potash (MOP) + Micronutrients',
          soilConsiderations: 'High Potash absorption phase',
          diseaseMonitoring: 'Crucial blast monitoring stage on flag leaf and neck node',
          pestMonitoring: 'Check for rice gundhi bug emitting foul odor at dusk',
          weatherConsiderations: 'High temperature (>36°C) causes spikelet sterility',
        },
        {
          stage: 'Fruit / Grain Development',
          offsetDays: 85,
          activityName: 'Milky Grain Stage Inspection & Protection',
          priority: 'MEDIUM',
          description: 'Inspect grain heads as milky sap solidifies into dough stage. Keep field moist.',
          waterRequirement: 'Moist field soil; alternate wetting and drying',
          fertilizerTask: 'Foliar spray 1% Potassium Nitrate if needed',
          soilConsiderations: 'Keep soil moist without deep stagnation',
          diseaseMonitoring: 'Check grain heads for false smut orange balls',
          pestMonitoring: 'Spray bio-pesticide if gundhi bug population exceeds 2 bugs/hill',
          weatherConsiderations: 'Windy storms cause crop lodging; ensure field perimeter support',
        },
        {
          stage: 'Maturity',
          offsetDays: 110,
          activityName: 'Terminal Field Drainage & Grain Ripening',
          priority: 'HIGH',
          description: 'Drain standing field water completely 10 days prior to planned harvesting to harden soil.',
          waterRequirement: 'Stop irrigation; drain all standing basin water',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Soil firming enables heavy combine harvester access',
          diseaseMonitoring: 'Monitor mature panicles for neck rot collapse',
          pestMonitoring: 'Rodent control along field bunds',
          weatherConsiderations: 'Clear sunny dry weather needed for golden ripening',
        },
        {
          stage: 'Harvest',
          offsetDays: 125,
          activityName: 'Paddy Mechanical / Manual Harvesting',
          priority: 'HIGH',
          description: 'Harvest crop when 85% of panicles turn golden yellow and grain moisture drops below 20%.',
          waterRequirement: 'Dry field condition',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Dry soil avoids grain mud contamination',
          diseaseMonitoring: 'N/A',
          pestMonitoring: 'N/A',
          weatherConsiderations: 'Schedule harvest on dry sunny day to prevent wet grain spoilage',
        },
        {
          stage: 'Post-Harvest',
          offsetDays: 130,
          activityName: 'Sun Drying, Threshing & Moisture Storage',
          priority: 'MEDIUM',
          description: 'Thresh panicles and sun-dry paddy grains to 12-14% moisture content before bagging in gunny sacks.',
          waterRequirement: 'N/A',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Incorporate remaining rice stubble back into soil',
          diseaseMonitoring: 'Prevent storage fungal mold by drying thoroughly',
          pestMonitoring: 'Store in clean granary lined with Neem leaf powder',
          weatherConsiderations: 'Cover drying grains with tarpaulins if sudden rain occurs',
        },
      ];
    } else if (cropName.includes('banana')) {
      taskTemplates = [
        {
          stage: 'Land Preparation',
          offsetDays: -15,
          activityName: 'Pit Digging & Organic Manure Filling',
          priority: 'HIGH',
          description: 'Dig 60x60x60 cm pits at 2x2m spacing; expose to sun for 10 days and fill with 10 kg FYM + Neem cake 250g.',
          waterRequirement: 'Initial pit soaking irrigation',
          fertilizerTask: 'Basal FYM 10 kg/pit + Neem cake 250g + SSP 200g',
          soilConsiderations: 'Deep fertile soil with good drainage ditches',
          diseaseMonitoring: 'Neem cake prevents soil-borne fusarium Panama wilt',
          pestMonitoring: 'Treat pits against rhizome weevils',
          weatherConsiderations: 'Dig pits before pre-monsoon rains begin',
        },
        {
          stage: 'Seed Selection',
          offsetDays: -5,
          activityName: 'Tissue Culture Plantlet / Sword Sucker Selection',
          priority: 'MEDIUM',
          description: 'Procure certified virus-free Grand Naine or Nendran tissue culture plantlets (or 1.5-2 kg healthy sword suckers).',
          waterRequirement: 'N/A',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Select virus-indexed clean material',
          diseaseMonitoring: 'Ensure suckers have zero vascular discoloration or bunchy top virus symptoms',
          pestMonitoring: 'Inspect sucker bases for borer tunnel holes',
          weatherConsiderations: 'Keep plantlets in shaded nursery before planting',
        },
        {
          stage: 'Seed Treatment',
          offsetDays: -2,
          activityName: 'Bio-Fungicide Sucker Paring & Prencil Soak',
          priority: 'HIGH',
          description: 'Pare sucker roots and dip in Pseudomonas fluorescens (10g/L) + Trichoderma viride (10g/L) slurry for 30 mins.',
          waterRequirement: 'Soaking bucket clean water',
          fertilizerTask: 'Bio-agent sucker coat',
          soilConsiderations: 'Protects emerging roots in pit',
          diseaseMonitoring: 'Prevents Panama wilt & Erwinia head rot',
          pestMonitoring: 'N/A',
          weatherConsiderations: 'Perform sucker soak in shaded area',
        },
        {
          stage: 'Nursery Preparation',
          offsetDays: 0,
          activityName: 'Secondary Nursery Hardening (for TC plantlets)',
          priority: 'MEDIUM',
          description: 'Harden tissue culture plantlets under 50% shade net for 2 weeks prior to field planting.',
          waterRequirement: 'Mist spray daily',
          fertilizerTask: 'Foliar spray 19:19:19 (2g/L) at 7 days',
          soilConsiderations: 'Polybag soil mix',
          diseaseMonitoring: 'Check leaves for early Sigatoka flecks',
          pestMonitoring: 'Keep under aphid-proof net shelter',
          weatherConsiderations: 'Protect from heavy wind gusts',
        },
        {
          stage: 'Sowing / Transplanting',
          offsetDays: 15,
          activityName: 'Main Field Pit Planting & Staking',
          priority: 'HIGH',
          description: 'Plant tissue culture plantlet / sucker in pit center, press soil firmly, and irrigate immediately.',
          waterRequirement: 'Immediate basin watering @ 15 L/plant',
          fertilizerTask: 'Basal bio-fertilizer application',
          soilConsiderations: 'Do not bury stem collar deeper than nursery polybag depth',
          diseaseMonitoring: 'Inspect plantlets for root rot',
          pestMonitoring: 'Check for early grasshopper feeding',
          weatherConsiderations: 'Plant during cloud cover or late afternoon hours',
        },
        {
          stage: 'Germination',
          offsetDays: 30,
          activityName: 'New Leaf Emergence & Gap Filling',
          priority: 'MEDIUM',
          description: 'Check for first new green leaf unrolling; replace any failing suckers in pits.',
          waterRequirement: 'Drip irrigate 15 L/plant every 2 days',
          fertilizerTask: 'First split Nitrogen dose (50g Urea/plant)',
          soilConsiderations: 'Keep basin weed-free',
          diseaseMonitoring: 'Check heart leaves for rot',
          pestMonitoring: 'Inspect leaf undersides for aphid colonies',
          weatherConsiderations: 'Drain excess monsoon water from basin rings',
        },
        {
          stage: 'Early Growth',
          offsetDays: 60,
          activityName: 'Desuckering & Ring Weeding',
          priority: 'MEDIUM',
          description: 'Prune unwanted side suckers (retain only main mother plant); earthing up around stem base.',
          waterRequirement: 'Regular drip irrigation',
          fertilizerTask: 'Second split NPK dose (Urea 50g + MOP 50g/plant)',
          soilConsiderations: 'Mound soil 15 cm high around pseudostem',
          diseaseMonitoring: 'Inspect lower leaves for Sigatoka yellow spots',
          pestMonitoring: 'Check pseudostem base for aphid clusters',
          weatherConsiderations: 'De-sucker during dry weather',
        },
        {
          stage: 'Vegetative Growth',
          offsetDays: 120,
          activityName: 'Active Vegetative Canopy Growth & Micronutrient Spray',
          priority: 'HIGH',
          description: 'Spray Zinc Sulfate 0.5% + Ferrous Sulfate 0.2% foliar feed; continue monthly NPK split application.',
          waterRequirement: 'Peak water demand (20 L/plant/day)',
          fertilizerTask: 'Third split NPK fertigation (Urea 100g + MOP 100g/plant)',
          soilConsiderations: 'Maintain deep moist root zone',
          diseaseMonitoring: 'De-trash spotted lower leaves to control Sigatoka spread',
          pestMonitoring: 'Inspect pseudostem bore holes for banana stem weevil oozing gum',
          weatherConsiderations: 'Ensure drainage channels clear before heavy monsoons',
        },
        {
          stage: 'Flowering',
          offsetDays: 210,
          activityName: 'Bunch Shooting / Flowering & Male Bud Removal',
          priority: 'HIGH',
          description: 'Bunch emerges from pseudostem crown. Remove male flower bud (denavelling) after last hand opens.',
          waterRequirement: 'Critical flowering water phase (25 L/plant/day)',
          fertilizerTask: 'Final split Potash application (MOP 150g/plant)',
          soilConsiderations: 'Potash absorption peaks during bunch formation',
          diseaseMonitoring: 'Check emerging bunch for cigar end rot',
          pestMonitoring: 'Spray bio-pesticide for thrips causing rust on fingers',
          weatherConsiderations: 'High temperature (>36°C) causes sunscald on upper bunch hands',
        },
        {
          stage: 'Fruit / Grain Development',
          offsetDays: 240,
          activityName: 'Propping Bamboo Support & Bunch Sleeving',
          priority: 'HIGH',
          description: 'Prop heavy bearing pseudostem with double bamboo poles; sleeve bunch with blue perforated polythene cover.',
          waterRequirement: 'Maintain 20 L/plant/day drip irrigation',
          fertilizerTask: 'Foliar spray 1% Potassium Nitrate on bunch fingers',
          soilConsiderations: 'Prevent pseudostem uprooting',
          diseaseMonitoring: 'Bunch sleeving prevents bird damage & fruit spot fungi',
          pestMonitoring: 'Polythene sleeve protects fingers against fruit flies',
          weatherConsiderations: 'Sturdy bamboo propping prevents wind lodging during monsoon gusts',
        },
        {
          stage: 'Maturity',
          offsetDays: 300,
          activityName: 'Bunch Maturity Inspection & Finger Rounding Check',
          priority: 'HIGH',
          description: 'Inspect bunch fingers; harvest when angular ridges round off to 75-80% full maturity.',
          waterRequirement: 'Reduce drip irrigation to 10 L/plant/day',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Keep basin firm for harvesting access',
          diseaseMonitoring: 'Inspect bunch for crown rot',
          pestMonitoring: 'Check for fruit flies on ripe hands',
          weatherConsiderations: 'Harvest on dry morning before sun heats fruit skin',
        },
        {
          stage: 'Harvest',
          offsetDays: 330,
          activityName: 'Bunch Cutting & Shaded Packing Transport',
          priority: 'HIGH',
          description: 'Cut bunch using sharp curved knife leaving 30 cm stalk peduncle; carry gently to shaded packing shed.',
          waterRequirement: 'Stop irrigation to mother plant',
          fertilizerTask: 'Select 1 healthy follower sucker for ratoon crop',
          soilConsiderations: 'Avoid dragging bunch on bare soil',
          diseaseMonitoring: 'Disinfect cutting knives',
          pestMonitoring: 'Inspect bunch crates before transport',
          weatherConsiderations: 'Transport in padded shaded vehicle',
        },
        {
          stage: 'Post-Harvest',
          offsetDays: 360,
          activityName: 'Ratoon Management & Pseudostem Chopping',
          priority: 'MEDIUM',
          description: 'Chop harvested mother pseudostem at 1m height; leave to release nutrients to follower sucker.',
          waterRequirement: 'Drip irrigate follower sucker @ 15 L/day',
          fertilizerTask: 'Apply FYM 10 kg + NPK split to ratoon sucker',
          soilConsiderations: 'Mulch pseudostem pieces around ratoon sucker base',
          diseaseMonitoring: 'Clear diseased leaf debris from mat base',
          pestMonitoring: 'Treat ratoon mat against banana weevil',
          weatherConsiderations: 'Incorporate organic pseudostem mulch before summer dry spell',
        },
      ];
    } else if (cropName.includes('tomato')) {
      taskTemplates = [
        {
          stage: 'Land Preparation',
          offsetDays: -10,
          activityName: 'Raised Bed Preparation & Mulch Layout',
          priority: 'HIGH',
          description: 'Plow land deeply, construct 1m wide raised beds, incorporate FYM 10 t/ha, and lay drip lines with silver-black mulch.',
          waterRequirement: 'Irrigate raised beds before planting',
          fertilizerTask: 'Basal FYM 10 t/ha + NPK 50:60:60 kg/ha',
          soilConsiderations: 'Sandy loam tilth with pH 6.0-7.0',
          diseaseMonitoring: 'Soil solarization for damping-off pathogens',
          pestMonitoring: 'Soil grub treatment',
          weatherConsiderations: 'Ensure bed drainage slopes toward perimeter ditches',
        },
        {
          stage: 'Seed Selection',
          offsetDays: -5,
          activityName: 'Hybrid F1 Tomato Seed Selection',
          priority: 'MEDIUM',
          description: 'Procure high-yielding bacterial wilt resistant F1 hybrid seeds.',
          waterRequirement: 'N/A',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Target high organic matter sandy loam',
          diseaseMonitoring: 'Select seeds certified resistant to Leaf Curl Virus (ToLCV)',
          pestMonitoring: 'N/A',
          weatherConsiderations: 'Store seeds in cool shaded drawer',
        },
        {
          stage: 'Seed Treatment',
          offsetDays: -2,
          activityName: 'Pseudomonas Seed Soak & Bio-Drenching',
          priority: 'HIGH',
          description: 'Soak seeds in Pseudomonas fluorescens (10g/L) for 30 mins to prevent early seedling rot.',
          waterRequirement: 'Clean soaking tray water',
          fertilizerTask: 'Bio-agent seed dressing',
          soilConsiderations: 'Protects root zone against damping-off fungal spores',
          diseaseMonitoring: 'Prevents early bacterial wilt colonization',
          pestMonitoring: 'N/A',
          weatherConsiderations: 'Perform in shade',
        },
        {
          stage: 'Nursery Preparation',
          offsetDays: 0,
          activityName: 'Pro-Tray Coco-Peat Nursery Sowing',
          priority: 'HIGH',
          description: 'Fill 98-cell pro-trays with sterilized coco-peat, sow 1 seed per cell, and cover under 50% shade net.',
          waterRequirement: 'Mist spray pro-trays daily with fine nozzle',
          fertilizerTask: 'Light Humic acid drench at day 10',
          soilConsiderations: 'Sterile coco-peat medium',
          diseaseMonitoring: 'Check pro-trays for seedling collar rot',
          pestMonitoring: 'Cover pro-trays with fine nylon mesh to keep whiteflies out',
          weatherConsiderations: 'Protect pro-trays from rain splash and scorching sun',
        },
        {
          stage: 'Sowing / Transplanting',
          offsetDays: 25,
          activityName: 'Field Transplanting on Mulched Beds',
          priority: 'HIGH',
          description: 'Transplant 25-day seedlings into punched mulch holes at 60x45 cm spacing during evening hours.',
          waterRequirement: 'Immediate drip irrigation post-transplanting',
          fertilizerTask: 'Starter fertigation 19:19:19 NPK',
          soilConsiderations: 'Firm soil around seedling plug to eliminate air pockets',
          diseaseMonitoring: 'Inspect seedling stem bases for root rot',
          pestMonitoring: 'Check for cutworms in soil near seedling stems',
          weatherConsiderations: 'Transplant in late afternoon to minimize transplant shock',
        },
        {
          stage: 'Germination',
          offsetDays: 30,
          activityName: 'Seedling Root Anchoring & Emergence Check',
          priority: 'MEDIUM',
          description: 'Monitor newly transplanted seedlings for root anchoring and replace any damaged plugs.',
          waterRequirement: 'Drip irrigate 30 mins daily',
          fertilizerTask: 'Root drenching with Humic Acid (2 ml/L)',
          soilConsiderations: 'Maintain bed soil moisture at 40-50%',
          diseaseMonitoring: 'Check for seedling wilt',
          pestMonitoring: 'Inspect leaf undersides for thrips',
          weatherConsiderations: 'Avoid flooding raised bed furrows',
        },
        {
          stage: 'Early Growth',
          offsetDays: 40,
          activityName: 'Weeding & Initial Side-Dressing',
          priority: 'MEDIUM',
          description: 'Clear furrow weeds, prune early basal suckers, and fertigate split Nitrogen.',
          waterRequirement: 'Drip irrigate every 2 days',
          fertilizerTask: 'Fertigate 12:61:0 (MAP) for root expansion',
          soilConsiderations: 'Mulch film prevents weed competition on bed tops',
          diseaseMonitoring: 'Inspect bottom leaves for concentric Early Blight target spots',
          pestMonitoring: 'Install yellow sticky traps for whitefly monitoring',
          weatherConsiderations: 'Postpone foliar fertigation if rain expected',
        },
        {
          stage: 'Vegetative Growth',
          offsetDays: 50,
          activityName: 'Bamboo Staking & Trellising Setup',
          priority: 'HIGH',
          description: 'Erect 2m bamboo stakes along bed edges and tie horizontal twine to support heavy fruiting branches.',
          waterRequirement: 'Drip irrigate 45 mins every 2 days',
          fertilizerTask: 'Fertigate NPK 20:20:20 + Micronutrients',
          soilConsiderations: 'Deep root zone moisture retention',
          diseaseMonitoring: 'Prune bottom leaves up to 30 cm from ground to prevent fungal splash',
          pestMonitoring: 'Check for Tuta absoluta leaf miner pinholes',
          weatherConsiderations: 'Ensure sturdy bamboo tying against gusty afternoon winds',
        },
        {
          stage: 'Flowering',
          offsetDays: 65,
          activityName: 'Flowering Stage Micronutrient & Boron Spray',
          priority: 'HIGH',
          description: 'Foliar spray Solubor Boron (1g/L) + Planofix to enhance flower retention and prevent flower drop.',
          waterRequirement: 'Maintain uniform soil moisture; avoid dry-wet soil fluctuations',
          fertilizerTask: 'Foliar spray Boron (1g/L) & Calcium Nitrate',
          soilConsiderations: 'Maintain consistent soil moisture to enable Calcium uptake',
          diseaseMonitoring: 'Inspect flower clusters for botrytis gray mold',
          pestMonitoring: 'Check for Helicoverpa fruit borer eggs on upper leaves',
          weatherConsiderations: 'High temperature (>32°C) causes flower drop; irrigate in evening',
        },
        {
          stage: 'Fruit / Grain Development',
          offsetDays: 80,
          activityName: 'Fruit Set Fertigation & Calcium Spray',
          priority: 'HIGH',
          description: 'Fertigate Potash (0:0:50) and spray Calcium Nitrate (2g/L) to prevent blossom end rot.',
          waterRequirement: 'Regular drip irrigation; avoid flooding',
          fertilizerTask: 'Calcium Nitrate + Potash fertigation',
          soilConsiderations: 'Calcium mobility depends on steady water flow',
          diseaseMonitoring: 'Check green fruits for Late Blight greasy rot patches',
          pestMonitoring: 'Spray Bt (Bacillus thuringiensis) for fruit borer larvae',
          weatherConsiderations: 'Heavy rainfall during fruiting triggers fruit cracking; adjust drip duration',
        },
        {
          stage: 'Maturity',
          offsetDays: 95,
          activityName: 'First Harvest Pick & Quality Grading',
          priority: 'HIGH',
          description: 'Pick firm fruits at pink/breaker stage every 3 days using clean shears.',
          waterRequirement: 'Reduce drip duration slightly to enhance fruit Brix sugar level',
          fertilizerTask: 'Final Potassium split application',
          soilConsiderations: 'Keep bed furrows dry for picking access',
          diseaseMonitoring: 'Inspect harvested fruits for anthracnose spots',
          pestMonitoring: 'Check picking crates for fruit borer larvae',
          weatherConsiderations: 'Harvest early morning before sun heats fruit skin',
        },
        {
          stage: 'Harvest',
          offsetDays: 110,
          activityName: 'Peak Harvesting Phase (Multiple Pickings)',
          priority: 'HIGH',
          description: 'Continue manual harvesting every 3-4 days; grade by size and color in shaded packing shed.',
          waterRequirement: 'Light drip irrigation every 3 days',
          fertilizerTask: 'Maintain Potassium fertigation to sustain harvest size',
          soilConsiderations: 'Avoid heavy foot traffic on wet mulch beds',
          diseaseMonitoring: 'Monitor old foliage for late season powdery mildew',
          pestMonitoring: 'Maintain yellow sticky traps in field',
          weatherConsiderations: 'Transport harvested crates in covered vehicle during afternoon heat',
        },
        {
          stage: 'Post-Harvest',
          offsetDays: 125,
          activityName: 'Vine Clearing, Mulch Removal & Field Sanitation',
          priority: 'MEDIUM',
          description: 'Uproot spent tomato vines, collect drip lateral lines, remove mulch film, and plow field.',
          waterRequirement: 'N/A',
          fertilizerTask: 'Incorporate green manure crop before next cycle',
          soilConsiderations: 'Deep tillage exposes soil-borne pests to heat',
          diseaseMonitoring: 'Burn diseased plant residue outside field',
          pestMonitoring: 'Destroy overwintering pupae through deep summer plowing',
          weatherConsiderations: 'Perform field clearing before pre-monsoon rains begin',
        },
      ];
    } else {
      // Chilli templates
      taskTemplates = [
        {
          stage: 'Land Preparation',
          offsetDays: -10,
          activityName: 'Field Plowing & Organic Humus Integration',
          priority: 'HIGH',
          description: 'Deep plow loamy soil 25 cm deep and mix FYM 10 t/ha + Neem cake 250 kg/ha on 60 cm raised beds.',
          waterRequirement: 'Pre-irrigate bed furrows',
          fertilizerTask: 'Basal FYM 10 t/ha + Neem cake 250 kg/ha',
          soilConsiderations: 'Loamy soil with optimal pH 6.0-7.2',
          diseaseMonitoring: 'Neem cake suppresses soil-borne phytophthora wilt',
          pestMonitoring: 'Neem cake deters soil nematodes and white grubs',
          weatherConsiderations: 'Ensure good field slope for heavy rain drainage',
        },
        {
          stage: 'Seed Selection',
          offsetDays: -5,
          activityName: 'Wilt-Resistant Hybrid Chilli Seed Procurement',
          priority: 'MEDIUM',
          description: 'Select certified high-pungency chilli seed varieties resistant to Anthracnose and leaf curl virus.',
          waterRequirement: 'N/A',
          fertilizerTask: 'N/A',
          soilConsiderations: 'Deep loamy soil preference',
          diseaseMonitoring: 'Certified disease-free seed lot',
          pestMonitoring: 'N/A',
          weatherConsiderations: 'Store in dry place',
        },
        {
          stage: 'Seed Treatment',
          offsetDays: -2,
          activityName: 'Trichoderma Viride Seed Dressing',
          priority: 'HIGH',
          description: 'Treat seeds with Trichoderma viride (4g/kg seed) or Imidacloprid (5g/kg) to deter nursery pests.',
          waterRequirement: 'Slurry water',
          fertilizerTask: 'Bio-control seed coat',
          soilConsiderations: 'Protects root emergence in nursery beds',
          diseaseMonitoring: 'Prevents damping-off fungal disease',
          pestMonitoring: 'Systemic seed dressing protects seedlings from early thrips',
          weatherConsiderations: 'Dry seeds in shade before sowing',
        },
        {
          stage: 'Nursery Preparation',
          offsetDays: 0,
          activityName: 'Pro-Tray Nursery Sowing Under Insect Net',
          priority: 'HIGH',
          description: 'Sow treated seeds in 98-cell pro-trays filled with coco-peat under 40-mesh insect net shade shelter.',
          waterRequirement: 'Daily morning misting',
          fertilizerTask: 'Foliar 19:19:19 (2g/L) at 15 days',
          soilConsiderations: 'Sterilized coco-peat medium',
          diseaseMonitoring: 'Inspect seedling stems for pythium damping-off',
          pestMonitoring: 'Insect net prevents whitefly entry and early virus infection',
          weatherConsiderations: 'Protect pro-trays from heavy downpours',
        },
        {
          stage: 'Sowing / Transplanting',
          offsetDays: 30,
          activityName: 'Main Field Transplanting & Spacing',
          priority: 'HIGH',
          description: 'Transplant 30-35 day sturdy seedlings on raised beds at 60x45 cm spacing.',
          waterRequirement: 'Irrigate immediately post-transplanting',
          fertilizerTask: 'Basal NPK 40:60:60 kg/ha',
          soilConsiderations: 'Firm soil around seedling root ball',
          diseaseMonitoring: 'Check seedling roots for bacterial wilt discoloration',
          pestMonitoring: 'Inspect shoot tips for flea beetles',
          weatherConsiderations: 'Transplant during overcast sky or late evening',
        },
        {
          stage: 'Germination',
          offsetDays: 35,
          activityName: 'Seedling Establishment & Gap Filling',
          priority: 'MEDIUM',
          description: 'Inspect field 5 days post-transplanting and replace any weak or dead seedlings.',
          waterRequirement: 'Light irrigation every 2-3 days',
          fertilizerTask: 'Root activator humic acid drench',
          soilConsiderations: 'Maintain bed soil moisture at 45%',
          diseaseMonitoring: 'Check for root rot in low-lying spots',
          pestMonitoring: 'Check for cutworms near soil surface',
          weatherConsiderations: 'Avoid heavy furrow standing water',
        },
        {
          stage: 'Early Growth',
          offsetDays: 45,
          activityName: 'First Inter-Cultivation & Sticky Trap Installation',
          priority: 'MEDIUM',
          description: 'Hand weed bed tops and erect 15 yellow sticky traps per acre at canopy level.',
          waterRequirement: 'Drip irrigate every 3 days',
          fertilizerTask: 'Top-dress 30 kg Urea per acre',
          soilConsiderations: 'Aerates root zone',
          diseaseMonitoring: 'Inspect lower leaves for cercospora leaf spots',
          pestMonitoring: 'Yellow traps capture whiteflies and winged aphids',
          weatherConsiderations: 'Perform weeding on sunny dry afternoon',
        },
        {
          stage: 'Vegetative Growth',
          offsetDays: 60,
          activityName: 'Side Branch Pruning & Fertigation Split',
          priority: 'HIGH',
          description: 'Prune weak side shoots up to 15 cm height to encourage bush expansion; fertigate Potash & Nitrogen.',
          waterRequirement: 'Maintain steady soil moisture',
          fertilizerTask: 'Fertigate NPK 20:20:20 + Magnesium Sulfate',
          soilConsiderations: 'Keep root zone well-drained',
          diseaseMonitoring: 'Inspect foliage for powdery mildew white patches on leaf undersides',
          pestMonitoring: 'Check for chilli thrips causing leaf curling upward (boat shape)',
          weatherConsiderations: 'Dry warm weather accelerates thrips infestation; inspect closely',
        },
        {
          stage: 'Flowering',
          offsetDays: 75,
          activityName: 'Flowering Micronutrient & Nitrobenzene Foliar Spray',
          priority: 'HIGH',
          description: 'Foliar spray Nitrobenzene (2 ml/L) + Boron (1g/L) at flower initiation to maximize flower set.',
          waterRequirement: 'Avoid soil water stress during flowering',
          fertilizerTask: 'Foliar Micronutrients + Boron (1g/L)',
          soilConsiderations: 'Prevent soil drought during flower initiation',
          diseaseMonitoring: 'Monitor flower stalks for anthracnose dieback spots',
          pestMonitoring: 'Check flower buds for midge larvae causing flower drop',
          weatherConsiderations: 'High wind (>25 km/h) causes flower drop; ensure shelter windbreaks',
        },
        {
          stage: 'Fruit / Grain Development',
          offsetDays: 95,
          activityName: 'Fruit Set Development & Anthracnose Protection',
          priority: 'HIGH',
          description: 'Foliar spray bio-control Pseudomonas fluorescens (10g/L) to protect developing green fruits against anthracnose.',
          waterRequirement: 'Regular drip irrigation; do not let soil dry completely',
          fertilizerTask: 'Fertigate Potash (0:0:50) for fruit firmness',
          soilConsiderations: 'Balanced root zone nutrition',
          diseaseMonitoring: 'Check green and turning pods for sunken dark anthracnose spots',
          pestMonitoring: 'Inspect fruit pods for fruit borer entry holes',
          weatherConsiderations: 'High humidity (>80%) accelerates anthracnose fungal spread; spray bio-agents',
        },
        {
          stage: 'Maturity',
          offsetDays: 115,
          activityName: 'Green / Red Pod Color Maturity Inspection',
          priority: 'HIGH',
          description: 'Inspect pod maturity; decide harvest destination (fresh green vegetable vs fully red dry spice).',
          waterRequirement: 'Reduce irrigation frequency to encourage red pod color conversion',
          fertilizerTask: 'Final Potassium split application',
          soilConsiderations: 'Dry bed furrows for picking access',
          diseaseMonitoring: 'Inspect ripe pods for wet soft rot',
          pestMonitoring: 'N/A',
          weatherConsiderations: 'Sunny dry weather promotes rapid red color conversion',
        },
        {
          stage: 'Harvest',
          offsetDays: 130,
          activityName: 'Multi-Pick Pod Harvesting (Every 7 Days)',
          priority: 'HIGH',
          description: 'Harvest mature chilli pods with stalks attached every 7-10 days in clean baskets.',
          waterRequirement: 'Light drip irrigation post each pick',
          fertilizerTask: 'Maintain light Potash fertigation post picking',
          soilConsiderations: 'Avoid pulling plants while plucking pods',
          diseaseMonitoring: 'Sort out any anthracnose-spotted pods immediately',
          pestMonitoring: 'Keep picking baskets clean',
          weatherConsiderations: 'Pick after morning dew has dried off pods',
        },
        {
          stage: 'Post-Harvest',
          offsetDays: 145,
          activityName: 'Solar Pod Drying & Moisture Storage Packaging',
          priority: 'MEDIUM',
          description: 'Spread red chillies on clean polythene tarpaulins; solar dry to 10% moisture before gunny packing.',
          waterRequirement: 'N/A',
          fertilizerTask: 'Clear chilli crop debris and incorporate compost',
          soilConsiderations: 'Summer soil plowing',
          diseaseMonitoring: 'Thorough drying prevents aflatoxin storage molds',
          pestMonitoring: 'Store packed gunny bags on raised wooden pallets',
          weatherConsiderations: 'Cover drying chilli yards during sudden rains',
        },
      ];
    }

    // 2. Persist 13-stage events in Database
    const createdEvents = [];

    for (const tmpl of taskTemplates) {
      const scheduledDate = new Date(plantingDate.getTime() + tmpl.offsetDays * 86400000);
      const isPast = scheduledDate < new Date();

      const event = await prisma.cropCalendarEvent.create({
        data: {
          userId,
          farmId,
          cropId,
          plantingDate,
          activityName: tmpl.activityName,
          stage: tmpl.stage,
          scheduledDate,
          status: isPast ? 'COMPLETED' : 'PENDING',
          completedDate: isPast ? scheduledDate : null,
          priority: tmpl.priority,
          description: tmpl.description,
          waterRequirement: tmpl.waterRequirement,
          fertilizerTask: tmpl.fertilizerTask,
          soilConsiderations: tmpl.soilConsiderations,
          diseaseMonitoring: tmpl.diseaseMonitoring,
          pestMonitoring: tmpl.pestMonitoring,
          weatherConsiderations: tmpl.weatherConsiderations,
          recommendation: tmpl.description,
        },
      });
      createdEvents.push(event);
    }

    return createdEvents;
  }

  /**
   * Evaluates pending events against live/cached weather data for smart advisories
   */
  public static async getSmartCalendarEvents(userId: string) {
    const events = await prisma.cropCalendarEvent.findMany({
      where: { userId },
      include: { crop: true, farm: true },
      orderBy: { scheduledDate: 'asc' },
    });

    let liveWeather: any = null;
    try {
      liveWeather = await WeatherService.getWeather();
    } catch (e) {
      console.warn('⚠️ Live weather unavailable; returning standard calendar without weather overlays');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const evaluatedEvents = events.map((ev) => {
      let weatherImpact = ev.weatherImpact;
      let isSmartAdjusted = ev.isSmartAdjusted;
      let recommendation = ev.recommendation || ev.description;

      if (liveWeather) {
        const actLower = ev.activityName.toLowerCase();
        const schedDate = new Date(ev.scheduledDate);
        schedDate.setHours(0, 0, 0, 0);

        const isToday = schedDate.getTime() === today.getTime();

        if (ev.status === 'PENDING' && (isToday || schedDate < today)) {
          if (liveWeather.rainProbability >= 50 && (actLower.includes('fertil') || actLower.includes('irrigation') || actLower.includes('spray'))) {
            weatherImpact = `🌧️ High Rain Risk (${liveWeather.rainProbability}%). Postpone fertigation/spraying to avoid runoff loss.`;
            isSmartAdjusted = true;
          } else if (liveWeather.humidity >= 85 && (actLower.includes('disease') || actLower.includes('blight') || actLower.includes('anthracnose') || actLower.includes('sigatoka'))) {
            weatherImpact = `🍄 High Humidity Alert (${liveWeather.humidity}%). Spore germination risk high today. Inspect foliage.`;
            isSmartAdjusted = true;
          } else if (liveWeather.temperature >= 35 && (actLower.includes('irrigation') || actLower.includes('transplanting'))) {
            weatherImpact = `🌡️ Extreme Heat Warning (${liveWeather.temperature}°C). Perform irrigation or transplanting in cool late evening.`;
            isSmartAdjusted = true;
          }
        }
      }

      return {
        ...ev,
        weatherImpact,
        isSmartAdjusted,
        recommendation,
      };
    });

    return evaluatedEvents;
  }
}
