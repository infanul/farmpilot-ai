'use client';

import React, { useState } from 'react';
import { Sprout, CheckCircle2, ChevronRight, Info, X, Droplets, TestTube, Bug, Sun, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface StageDetail {
  id: number;
  name: string;
  iconName: string;
  durationDays: string;
  description: string;
  waterRequirement: string;
  fertilizerTask: string;
  soilConsiderations: string;
  diseaseRisks: string;
  pestRisks: string;
  weatherConsiderations: string;
  farmerTasks: string[];
}

const STAGES: StageDetail[] = [
  {
    id: 1,
    name: 'Planting',
    iconName: '🌱',
    durationDays: '1-10 Days',
    description: 'Initial seed sowing or nursery seedling transplantation into well-ploughed, enriched field soil.',
    waterRequirement: 'Maintain 2 cm soft moisture layer. Avoid flooding young seedlings.',
    fertilizerTask: 'Basal application of well-decomposed FYM organic compost + Single Super Phosphate.',
    soilConsiderations: 'Optimal soil temperature 25-32°C, pH 6.0-6.8.',
    diseaseRisks: 'Damping off, Pythium seed rot.',
    pestRisks: 'Cutworms, seed maggots.',
    weatherConsiderations: 'Avoid sowing prior to heavy rain to prevent seed displacement.',
    farmerTasks: ['Prepare raised nursery beds', 'Soak seeds with Trichoderma bio-fungicide', 'Irrigate gently'],
  },
  {
    id: 2,
    name: 'Germination',
    iconName: '🌿',
    durationDays: '10-20 Days',
    description: 'Emergence of first true green leaves and root system establishment.',
    waterRequirement: 'Keep soil moist (40-50% moisture). Drip irrigation recommended.',
    fertilizerTask: 'First starter Nitrogen top-dressing or liquid Bio-fertilizer drench.',
    soilConsiderations: 'Ensure good drainage; avoid soil crusting.',
    diseaseRisks: 'Root rot, seedling blight.',
    pestRisks: 'Flea beetles, thrips.',
    weatherConsiderations: 'Moderate sunlight required (6-8 hrs/day).',
    farmerTasks: ['Gap filling for missed seedlings', 'First manual weeding around seedling base'],
  },
  {
    id: 3,
    name: 'Vegetative',
    iconName: '🌾',
    durationDays: '20-55 Days',
    description: 'Rapid leaf canopy expansion, stem elongation, and tillering.',
    waterRequirement: 'Peak water demand (5-7 mm/day). Maintain active moist zone.',
    fertilizerTask: 'Main Urea Nitrogen split dose + Zinc Sulphate foliar application.',
    soilConsiderations: 'Loosen topsoil for aeration.',
    diseaseRisks: 'Rice Blast, Tomato Early Blight, Chilli Anthracnose.',
    pestRisks: 'Stem borer, leaf folder, whiteflies.',
    weatherConsiderations: 'High humidity (>85%) increases fungal spore germination.',
    farmerTasks: ['Erect bamboo stakes for tomato/chilli support', 'Apply recommended bio-pesticide spray'],
  },
  {
    id: 4,
    name: 'Flowering',
    iconName: '🌼',
    durationDays: '55-80 Days',
    description: 'Panicle initiation, flower bud opening, and fruit set emergence.',
    waterRequirement: 'Critical flowering moisture stage. Water stress causes flower drop!',
    fertilizerTask: 'Muriate of Potash (MOP) + Solubor Boron 0.2% spray for fruit retention.',
    soilConsiderations: 'Avoid heavy nitrogen application during bloom.',
    diseaseRisks: 'Powdery mildew, bacterial wilt.',
    pestRisks: 'Fruit borer, thrips, aphids.',
    weatherConsiderations: 'High heat (>36°C) causes pollen sterility.',
    farmerTasks: ['Spray Solubor Boron for flower setting', 'Inspect under leaves for aphid clusters'],
  },
  {
    id: 5,
    name: 'Maturity',
    iconName: '🌾',
    durationDays: '80-110 Days',
    description: 'Grain filling/fruit ripening stage where green pods turn vibrant target color.',
    waterRequirement: 'Gradually reduce irrigation. Drain standing water 10 days before harvest.',
    fertilizerTask: 'No further chemical fertilizer. Optional Potassium Silicate foliar coat.',
    soilConsiderations: 'Allow soil surface to dry out for machinery/harvest access.',
    diseaseRisks: 'Fruit rot, grain discolouration.',
    pestRisks: 'Stink bugs, birds.',
    weatherConsiderations: 'Dry sunny weather optimal for sugar & dry matter accumulation.',
    farmerTasks: ['Terminal field drainage', 'Prepare harvest crates and threshing area'],
  },
  {
    id: 6,
    name: 'Harvest',
    iconName: '🚜',
    durationDays: '110-125 Days',
    description: 'Final picking of mature crop at optimal moisture content for market sale.',
    waterRequirement: 'Zero irrigation during active picking.',
    fertilizerTask: 'Post-harvest organic compost replenishment for next crop cycle.',
    soilConsiderations: 'Soil aeration plowing post harvest.',
    diseaseRisks: 'Post-harvest fungal molds during storage.',
    pestRisks: 'Storage granary weevils.',
    weatherConsiderations: 'Harvest on dry bright clear mornings.',
    farmerTasks: ['Pick at breaker/red ripe stage', 'Solar dry paddy grains to 12% moisture', 'Grade & package'],
  },
];

export const CropGrowthTimeline: React.FC = () => {
  const { t } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<StageDetail | null>(null);
  const activeStageId = 3; // Vegetative stage active demo

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            Interactive Crop Growth Timeline & Agronomic Stages
          </h3>
          <p className="text-xs text-slate-400">Click any growth stage to reveal stage requirements, water needs, and IPM guidance</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-farm-950 px-3 py-1 rounded-full border border-farm-800">
          Current: Vegetative Stage (Day 48)
        </span>
      </div>

      {/* Visual Timeline Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
        {STAGES.map((stage) => {
          const isActive = stage.id === activeStageId;
          const isPast = stage.id < activeStageId;

          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative group ${
                isActive
                  ? 'bg-gradient-to-b from-farm-900/80 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/40 scale-105'
                  : isPast
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-80 hover:opacity-100 hover:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{stage.iconName}</span>
                {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isActive && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <p className="text-xs font-extrabold text-white truncate">{stage.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{stage.durationDays}</p>
              <span className="text-[10px] text-farm-400 font-semibold group-hover:underline mt-2 inline-flex items-center gap-0.5">
                Details <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Modal / Drawer for Selected Stage */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-3xl p-3 rounded-2xl bg-farm-950 border border-farm-800">
                  {selectedStage.iconName}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Stage {selectedStage.id}: {selectedStage.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedStage.durationDays}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/40">
              {selectedStage.description}
            </p>

            {/* Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                <p className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" /> Water Requirement
                </p>
                <p className="text-slate-300 leading-relaxed">{selectedStage.waterRequirement}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <TestTube className="w-4 h-4" /> Fertilizer & Nutrition
                </p>
                <p className="text-slate-300 leading-relaxed">{selectedStage.fertilizerTask}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                <p className="font-bold text-rose-400 flex items-center gap-1.5">
                  <Bug className="w-4 h-4" /> Disease & Pest Risks
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Risks: {selectedStage.diseaseRisks} | Pests: {selectedStage.pestRisks}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sun className="w-4 h-4" /> Weather & Soil
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {selectedStage.weatherConsiderations} ({selectedStage.soilConsiderations})
                </p>
              </div>
            </div>

            {/* Farmer Action Checklist */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recommended Farmer Actions</h4>
              <div className="space-y-1.5">
                {selectedStage.farmerTasks.map((task, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
