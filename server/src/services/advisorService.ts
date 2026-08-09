import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdvisorService {
  /**
   * Agricultural AI Advisor query responder
   */
  public static async askAdvisor(cropId?: string, farmId?: string, question?: string) {
    const qLower = (question || '').toLowerCase();

    let cropName = 'General Crops';
    if (cropId) {
      const c = await prisma.crop.findUnique({ where: { id: cropId } });
      if (c) cropName = c.name;
    }

    let summary = 'Practical Agricultural Advisory';
    let recommendations: string[] = [];
    let precautions: string[] = [];
    let nextSteps: string[] = [];

    if (qLower.includes('yellow') || qLower.includes('chlorosis')) {
      summary = `Leaf Yellowing Assessment for ${cropName}`;
      recommendations = [
        'Inspect the lower (older) versus upper (younger) leaves. Lower leaf yellowing usually indicates Nitrogen or Magnesium deficiency.',
        'Check for over-watering or poor soil drainage. Waterlogged roots cannot take up Oxygen or nutrients.',
        'Prune heavily yellowed leaves to prevent secondary fungal infections.',
      ];
      precautions = [
        'Avoid applying heavy chemical fertilizers immediately before testing soil moisture.',
        'Do not overhead water yellowing leaves.',
      ];
      nextSteps = [
        'Perform a quick soil pH and NPK test or check your FarmPilot AI Soil Intelligence page.',
        'Take a clear photo of the leaf and upload it to FarmPilot AI Disease Scanner.',
      ];
    } else if (qLower.includes('rain') || qLower.includes('wet') || qLower.includes('flood')) {
      summary = `Heavy Rain Action Plan for ${cropName}`;
      recommendations = [
        'Clear all main and sub-drainage channels around your field plot.',
        'Postpone all planned top-dress fertilizer applications and pesticide spraying until fields dry.',
        'Stake or tie tall crops (like Tomato or Banana) to prevent wind lodging.',
      ];
      precautions = [
        'Never apply water-soluble Nitrogen before heavy downpours.',
      ],
      nextSteps = [
        'Monitor FarmPilot AI Live Weather Alerts.',
        'Inspect field perimeter 12 hours post-rain for water stagnation.',
      ];
    } else if (qLower.includes('irrigat') || qLower.includes('water')) {
      summary = `Irrigation & Water Management for ${cropName}`;
      recommendations = [
        cropName.toLowerCase().includes('rice')
          ? 'Maintain 2–5 cm standing water during tillering and panicle initiation. Drain completely 10 days before harvesting.'
          : cropName.toLowerCase().includes('tomato')
          ? 'Irrigate via drip every 2–3 days. Maintain uniform soil moisture; avoid dry-wet stress cycles to prevent fruit cracking.'
          : 'Provide 150–200 liters per palm during dry periods. Mulch the palm basin with organic biomass.',
      ];
      precautions = [
        'Avoid overhead sprinkler watering during high heat or flowering to prevent flower drop.',
      ];
      nextSteps = [
        'Check soil moisture percentage in your Soil Records tab.',
      ];
    } else {
      summary = `General Agricultural Advisory for ${cropName}`;
      recommendations = [
        'Ensure balanced NPK nutrition tailored to the specific crop growth phase.',
        'Maintain clean field borders and practice crop rotation where applicable.',
        'Monitor weather forecasts daily to align irrigation and spraying activities.',
      ];
      precautions = [
        'Always follow non-prescriptive, safe integrated pest management (IPM) guidelines.',
        'Consult local extension experts before adopting any chemical treatments.',
      ];
      nextSteps = [
        'Use FarmPilot AI Smart Calendar to keep track of upcoming field tasks.',
        'Scan any suspicious leaf symptoms with the FarmPilot AI Disease Scanner.',
      ];
    }

    return {
      cropName,
      question: question || 'General guidance request',
      summary,
      recommendations,
      precautions,
      nextSteps,
      timestamp: new Date().toISOString(),
    };
  }
}
