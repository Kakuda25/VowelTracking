import type {
  FaceLandmarkResult,
  MouthFeatures,
  VowelDetectionResult,
  Vowel,
} from '../types';
import { MOUTH_LANDMARKS_INDICES } from '../config/constants';
import { calculateDistance } from '../utils/geometry';

/**
 * 母音検出器
 * 顔ランドマークから口の形状を分析し、母音を判定します。
 */
export class VowelDetector {
  private readonly confidenceThreshold: number;

  constructor(confidenceThreshold: number = 0.5) {
    this.confidenceThreshold = confidenceThreshold;
  }

  /**
   * 顔ランドマークから母音を判定
   */
  detect(landmarks: FaceLandmarkResult): VowelDetectionResult {
    const features = this.calculateMouthFeatures(landmarks);
    return this.classifyVowel(features);
  }

  /**
   * 口の特徴量を計算
   */
  private calculateMouthFeatures(
    landmarks: FaceLandmarkResult
  ): MouthFeatures {
    const { landmarks: points } = landmarks;

    if (points.length < 468) {
      throw new Error('Invalid landmarks: expected 468 points');
    }

    const upperLipTop = points[MOUTH_LANDMARKS_INDICES.UPPER_LIP_TOP];
    const lowerLipBottom = points[MOUTH_LANDMARKS_INDICES.LOWER_LIP_BOTTOM];
    const mouthLeft = points[MOUTH_LANDMARKS_INDICES.MOUTH_LEFT];
    const mouthRight = points[MOUTH_LANDMARKS_INDICES.MOUTH_RIGHT];
    const jawBottom = points[MOUTH_LANDMARKS_INDICES.JAW_BOTTOM];
    const jawTop = points[MOUTH_LANDMARKS_INDICES.JAW_TOP];

    const verticalOpening = calculateDistance(upperLipTop, lowerLipBottom);
    const horizontalWidth = calculateDistance(mouthLeft, mouthRight);
    const aspectRatio =
      horizontalWidth > 0 ? verticalOpening / horizontalWidth : 0;
    const jawOpening = calculateDistance(jawTop, jawBottom);

    const roundness = this.calculateRoundness(points);

    return {
      verticalOpening,
      horizontalWidth,
      aspectRatio,
      roundness,
      jawOpening,
    };
  }

  /**
   * 唇の丸み具合を計算
   */
  private calculateRoundness(
    points: Array<{ x: number; y: number; z: number }>
  ): number {
    const upperLipBottom = points[MOUTH_LANDMARKS_INDICES.UPPER_LIP_BOTTOM];
    const lowerLipTop = points[MOUTH_LANDMARKS_INDICES.LOWER_LIP_TOP];
    const mouthCenterTop = points[MOUTH_LANDMARKS_INDICES.MOUTH_CENTER_TOP];
    const mouthCenterBottom =
      points[MOUTH_LANDMARKS_INDICES.MOUTH_CENTER_BOTTOM];

    const centerDistance = calculateDistance(mouthCenterTop, mouthCenterBottom);
    const lipDistance = calculateDistance(upperLipBottom, lowerLipTop);

    if (centerDistance === 0) {
      return 0;
    }

    return Math.min(1, lipDistance / centerDistance);
  }

  /**
   * 特徴量から母音を分類
   */
  private classifyVowel(features: MouthFeatures): VowelDetectionResult {
    const scores: Array<{ vowel: Vowel; score: number }> = [];

    scores.push({
      vowel: 'closed',
      score: this.scoreClosed(features),
    });
    scores.push({
      vowel: 'a',
      score: this.scoreA(features),
    });
    scores.push({
      vowel: 'i',
      score: this.scoreI(features),
    });
    scores.push({
      vowel: 'u',
      score: this.scoreU(features),
    });
    scores.push({
      vowel: 'e',
      score: this.scoreE(features),
    });
    scores.push({
      vowel: 'o',
      score: this.scoreO(features),
    });

    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];

    return {
      vowel: best.vowel,
      confidence: best.score,
      features,
    };
  }

  private scoreClosed(features: MouthFeatures): number {
    const verticalScore =
      features.verticalOpening < 0.02 ? 1 - features.verticalOpening * 50 : 0;
    const jawScore = features.jawOpening < 0.1 ? 1 - features.jawOpening * 10 : 0;
    return (verticalScore + jawScore) / 2;
  }

  private scoreA(features: MouthFeatures): number {
    const verticalScore =
      features.verticalOpening > 0.15
        ? Math.min(1, (features.verticalOpening - 0.15) * 5)
        : 0;
    const aspectScore =
      features.aspectRatio > 0.8 ? Math.min(1, features.aspectRatio * 1.25) : 0;
    const jawScore =
      features.jawOpening > 0.3 ? Math.min(1, (features.jawOpening - 0.3) * 2) : 0;
    return (verticalScore * 0.4 + aspectScore * 0.3 + jawScore * 0.3);
  }

  private scoreI(features: MouthFeatures): number {
    const verticalScore =
      features.verticalOpening < 0.08 ? 1 - features.verticalOpening * 12.5 : 0;
    const widthScore =
      features.horizontalWidth > 0.3
        ? Math.min(1, (features.horizontalWidth - 0.3) * 5)
        : 0;
    const aspectScore =
      features.aspectRatio < 0.3 ? 1 - features.aspectRatio * 3.33 : 0;
    return (verticalScore * 0.3 + widthScore * 0.4 + aspectScore * 0.3);
  }

  private scoreU(features: MouthFeatures): number {
    const verticalScore =
      features.verticalOpening < 0.1 ? 1 - features.verticalOpening * 10 : 0;
    const widthScore =
      features.horizontalWidth < 0.2 ? 1 - features.horizontalWidth * 5 : 0;
    const roundScore =
      features.roundness > 0.7
        ? Math.min(1, (features.roundness - 0.7) * 3.33)
        : 0;
    return (verticalScore * 0.3 + widthScore * 0.3 + roundScore * 0.4);
  }

  private scoreE(features: MouthFeatures): number {
    const verticalScore =
      features.verticalOpening >= 0.08 && features.verticalOpening <= 0.12
        ? 1 - Math.abs(features.verticalOpening - 0.1) * 20
        : 0;
    const widthScore =
      features.horizontalWidth > 0.25
        ? Math.min(1, (features.horizontalWidth - 0.25) * 4)
        : 0;
    const aspectScore =
      features.aspectRatio >= 0.4 && features.aspectRatio <= 0.6
        ? 1 - Math.abs(features.aspectRatio - 0.5) * 10
        : 0;
    return (verticalScore * 0.4 + widthScore * 0.3 + aspectScore * 0.3);
  }

  private scoreO(features: MouthFeatures): number {
    const verticalScore =
      features.verticalOpening >= 0.1 && features.verticalOpening <= 0.15
        ? 1 - Math.abs(features.verticalOpening - 0.125) * 20
        : 0;
    const widthScore =
      features.horizontalWidth < 0.25 ? 1 - features.horizontalWidth * 4 : 0;
    const roundScore =
      features.roundness > 0.6
        ? Math.min(1, (features.roundness - 0.6) * 2.5)
        : 0;
    return (verticalScore * 0.3 + widthScore * 0.3 + roundScore * 0.4);
  }
}

