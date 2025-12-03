/**
 * VowelTracking - 母音判定モジュール
 * 
 * MediaPipe Tasks Visionを使用してリアルタイムで母音を検出します。
 * 閉口、あ、い、う、え、おの6つの状態を判定できます。
 */

export { VowelTracker } from './core/VowelTracker';
export { CameraManager } from './core/CameraManager';
export { FaceLandmarkerWrapper } from './core/FaceLandmarkerWrapper';
export { VowelDetector } from './core/VowelDetector';
export { MovingAverageFilter } from './utils/smoothing';
export { VowelTrackerError, ErrorCode } from './utils/errors';
export type {
  Vowel,
  VowelDetectionCallback,
  VowelTrackerOptions,
  FaceLandmarkResult,
  MouthFeatures,
  VowelDetectionResult,
  DebugInfo,
} from './types';

