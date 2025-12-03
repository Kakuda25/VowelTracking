/**
 * 検出可能な母音の種類
 */
export type Vowel = 'closed' | 'a' | 'i' | 'u' | 'e' | 'o';

/**
 * 母音検出時のコールバック関数
 */
export type VowelDetectionCallback = (vowel: Vowel) => void;

/**
 * VowelTrackerの設定オプション
 */
export interface VowelTrackerOptions {
  /**
   * MediaPipeモデルファイルのパス
   * @default './models/face_landmarker.task'
   */
  modelPath?: string;

  /**
   * 母音が検出された際に呼び出されるコールバック関数
   */
  onVowelDetected?: VowelDetectionCallback;

  /**
   * 検出の信頼度閾値（0.0 - 1.0）
   * @default 0.5
   */
  confidenceThreshold?: number;

  /**
   * 検出間隔（ミリ秒）
   * @default 100
   */
  detectionInterval?: number;
}

/**
 * MediaPipe FaceLandmarkerの結果型
 */
export interface FaceLandmarkResult {
  landmarks: Array<{ x: number; y: number; z: number }>;
  faceBlendshapes?: Array<{ score: number; categoryName: string }>;
}

