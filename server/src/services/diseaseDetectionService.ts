import { PrismaClient } from '@prisma/client';
import { DiseaseDetectionResult } from '../types';
import { ImageValidator } from './imageValidator';
import { InferenceService } from './inferenceService';

const prisma = new PrismaClient();

export class DiseaseDetectionService {
  /**
   * ML-ready crop disease detection pipeline with validation & threshold evaluation
   */
  public static async analyzeCropImage(
    imageBuffer: Buffer,
    filename: string,
    imageUrl: string,
    userId?: string,
    userCropHint?: string
  ): Promise<DiseaseDetectionResult> {
    // 1. Image Quality & Format Validation
    const validation = ImageValidator.validateImageBuffer(imageBuffer, filename);
    if (!validation.isValid) {
      const rejectedResult: DiseaseDetectionResult = {
        imageUrl,
        detectedDisease: 'Scan Rejected: Quality Check Failed',
        confidence: 0,
        confidenceLevel: 'REJECTED',
        rejectionReason: validation.rejectionReason,
        cropName: userCropHint || 'Unknown Crop',
        symptoms: ['Image validation criteria failed.'],
        causes: [validation.message || 'Poor image resolution or lighting.'],
        immediateActions: ['Retake leaf photo in direct natural daylight.', 'Focus closely on the affected leaf area.'],
        prevention: ['Keep camera steady and clean camera lens.'],
        treatmentGuidance: {
          cultural: ['Ensure leaf is centered and dry before taking the photo.'],
          sanitation: [],
          biological: [],
          expertAdvice: validation.message || 'Please upload a clearer image for accurate diagnosis.',
        },
        isModelPending: false,
        isExpertVerificationRecommended: true,
        isLowConfidence: true,
      };

      if (userId) {
        await prisma.diseaseScan.create({
          data: {
            userId,
            imageUrl,
            cropName: rejectedResult.cropName,
            detectedDisease: rejectedResult.detectedDisease,
            confidence: 0,
            confidenceLevel: 'REJECTED',
            rejectionReason: validation.rejectionReason,
            symptomsObserved: JSON.stringify(rejectedResult.symptoms),
            causesIdentified: JSON.stringify(rejectedResult.causes),
            immediateActions: JSON.stringify(rejectedResult.immediateActions),
            preventionSummary: JSON.stringify(rejectedResult.prevention),
            treatmentGuidance: JSON.stringify(rejectedResult.treatmentGuidance),
            status: 'REJECTED',
            isExpertVerificationRecommended: true,
          },
        });
      }

      return rejectedResult;
    }

    // 2. Execute Pluggable ML Model Prediction Interface
    const prediction = await InferenceService.predict(imageBuffer, filename, userCropHint);

    // 3. Evaluate Confidence Thresholds
    if (prediction.confidenceLevel === 'LOW') {
      const lowConfResult: DiseaseDetectionResult = {
        imageUrl,
        detectedDisease: 'Uncertain Symptom / Low Confidence',
        confidence: prediction.confidence,
        confidenceLevel: 'LOW',
        severity: 'MILD',
        cropName: prediction.cropName,
        symptoms: ['Symptoms are unclear or ambiguous in the provided photograph.'],
        causes: ['Indistinct spot morphology or distance from leaf surface.'],
        immediateActions: [
          'Take a closer photo of a single affected leaf.',
          'Consult local agricultural extension officer for hands-on field inspection.',
        ],
        prevention: ['Inspect nearby leaves for early spot development.'],
        treatmentGuidance: {
          cultural: ['Keep foliage dry and maintain plant spacing.'],
          sanitation: [],
          biological: [],
          expertAdvice: `Model confidence is low (${prediction.confidence}%). We do not force a diagnosis. Please re-photograph or consult a local agronomy expert.`,
        },
        modelId: prediction.modelId,
        modelVersion: prediction.modelVersion,
        isModelPending: prediction.isModelPending,
        isExpertVerificationRecommended: true,
        isLowConfidence: true,
      };

      if (userId) {
        await prisma.diseaseScan.create({
          data: {
            userId,
            imageUrl,
            cropName: lowConfResult.cropName,
            detectedDisease: lowConfResult.detectedDisease,
            confidence: prediction.confidence,
            confidenceLevel: 'LOW',
            symptomsObserved: JSON.stringify(lowConfResult.symptoms),
            causesIdentified: JSON.stringify(lowConfResult.causes),
            immediateActions: JSON.stringify(lowConfResult.immediateActions),
            preventionSummary: JSON.stringify(lowConfResult.prevention),
            treatmentGuidance: JSON.stringify(lowConfResult.treatmentGuidance),
            modelId: prediction.modelId,
            modelVersion: prediction.modelVersion,
            status: 'COMPLETED',
            isExpertVerificationRecommended: true,
          },
        });
      }

      return lowConfResult;
    }

    // 4. Fetch Structured Agronomic Knowledge Base Entry from DB
    const diseaseObj = await prisma.disease.findFirst({
      where: {
        name: { contains: prediction.detectedDisease },
      },
      include: {
        crop: true,
        treatmentRecommendations: true,
      },
    });

    let symptoms: string[] = ['Dark spots on leaf blades', 'Lesion halo formation'];
    let causes: string[] = ['Fungal/bacterial inoculum combined with favorable humidity'];
    let prevention: string[] = ['Crop rotation and sanitation', 'Avoid overhead watering'];
    let immediateActions: string[] = ['Prune heavily infected lower leaves', 'Improve row spacing ventilation'];

    const culturalTreatments: string[] = [];
    const sanitationTreatments: string[] = [];
    const biologicalTreatments: string[] = [];

    if (diseaseObj) {
      symptoms = diseaseObj.symptoms.split('. ').filter(Boolean);
      causes = diseaseObj.causes.split('. ').filter(Boolean);
      prevention = diseaseObj.prevention.split('. ').filter(Boolean);

      diseaseObj.treatmentRecommendations.forEach((rec) => {
        if (rec.treatmentType === 'Cultural') culturalTreatments.push(rec.details);
        else if (rec.treatmentType === 'Sanitation') sanitationTreatments.push(rec.details);
        else if (rec.treatmentType === 'Biological') biologicalTreatments.push(rec.details);
      });
    }

    const expertAdviceNotice = prediction.isExpertVerificationRecommended
      ? `Confidence is ${prediction.confidence}% (${prediction.confidenceLevel}). Diagnosis is likely. Local agricultural extension officer verification is recommended.`
      : 'Diagnosis based on agronomic features. Always follow locally approved product labels and consult local agricultural extension officers before chemical application.';

    const result: DiseaseDetectionResult = {
      imageUrl,
      detectedDisease: diseaseObj ? diseaseObj.name : prediction.detectedDisease,
      confidence: prediction.confidence,
      confidenceLevel: prediction.confidenceLevel,
      severity: prediction.severity,
      cropName: diseaseObj ? diseaseObj.crop.name : prediction.cropName,
      symptoms,
      causes,
      immediateActions,
      prevention,
      treatmentGuidance: {
        cultural: culturalTreatments.length ? culturalTreatments : ['Improve canopy ventilation', 'Avoid overhead watering'],
        sanitation: sanitationTreatments.length ? sanitationTreatments : ['Remove heavily infected leaves in sealed bags'],
        biological: biologicalTreatments.length ? biologicalTreatments : ['Foliar spray with Trichoderma or Pseudomonas bio-agents'],
        expertAdvice: expertAdviceNotice,
      },
      modelId: prediction.modelId,
      modelVersion: prediction.modelVersion,
      isModelPending: prediction.isModelPending,
      isExpertVerificationRecommended: prediction.isExpertVerificationRecommended,
      isLowConfidence: false,
    };

    // 5. Save Scan History in DB
    if (userId) {
      const createdScan = await prisma.diseaseScan.create({
        data: {
          userId,
          diseaseId: diseaseObj ? diseaseObj.id : null,
          imageUrl,
          cropName: result.cropName,
          detectedDisease: result.detectedDisease,
          confidence: result.confidence,
          confidenceLevel: result.confidenceLevel,
          severity: result.severity,
          symptomsObserved: JSON.stringify(result.symptoms),
          causesIdentified: JSON.stringify(result.causes),
          immediateActions: JSON.stringify(result.immediateActions),
          preventionSummary: JSON.stringify(result.prevention),
          treatmentGuidance: JSON.stringify(result.treatmentGuidance),
          modelId: prediction.modelId,
          modelVersion: prediction.modelVersion,
          isExpertVerificationRecommended: result.isExpertVerificationRecommended,
          status: 'COMPLETED',
        },
      });
      result.id = createdScan.id;
      result.createdAt = createdScan.createdAt.toISOString();
    }

    return result;
  }

  /**
   * Get Farmer Scan History
   */
  public static async getScanHistory(userId: string): Promise<DiseaseDetectionResult[]> {
    const scans = await prisma.diseaseScan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return scans.map((s) => {
      let symptoms: string[] = [];
      let causes: string[] = [];
      let immediateActions: string[] = [];
      let prevention: string[] = [];
      let treatmentGuidance = { cultural: [], sanitation: [], biological: [], expertAdvice: '' };

      try { symptoms = JSON.parse(s.symptomsObserved); } catch (e) { symptoms = [s.symptomsObserved]; }
      try { causes = JSON.parse(s.causesIdentified); } catch (e) { causes = [s.causesIdentified]; }
      try { immediateActions = JSON.parse(s.immediateActions); } catch (e) { immediateActions = []; }
      try { prevention = JSON.parse(s.preventionSummary); } catch (e) { prevention = [s.preventionSummary]; }
      try { treatmentGuidance = JSON.parse(s.treatmentGuidance); } catch (e) { treatmentGuidance = { cultural: [], sanitation: [], biological: [], expertAdvice: '' }; }

      return {
        id: s.id,
        imageUrl: s.imageUrl,
        detectedDisease: s.detectedDisease,
        confidence: s.confidence,
        confidenceLevel: (s.confidenceLevel as any) || 'HIGH',
        rejectionReason: s.rejectionReason || undefined,
        severity: s.severity || undefined,
        cropName: s.cropName,
        symptoms,
        causes,
        immediateActions,
        prevention,
        treatmentGuidance,
        modelId: s.modelId,
        modelVersion: s.modelVersion,
        isExpertVerificationRecommended: s.isExpertVerificationRecommended,
        isLowConfidence: s.confidenceLevel === 'LOW' || s.confidenceLevel === 'REJECTED',
        createdAt: s.createdAt.toISOString(),
      };
    });
  }
}
