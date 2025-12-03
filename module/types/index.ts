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

  /**
   * カメラ制約
   */
  cameraConstraints?: MediaStreamConstraints;

  /**
   * 平滑化ウィンドウサイズ
   * @default 5
   */
  smoothingWindowSize?: number;

  /**
   * デバッグモード
   * @default false
   */
  debug?: boolean;
}

/**
 * MediaPipe FaceLandmarkerの結果型
 */
export interface FaceLandmarkResult {
  landmarks: Array<{ x: number; y: number; z: number }>;
  faceBlendshapes?: Array<{ score: number; categoryName: string }>;
}

/**
 * 口の特徴量
 */
export interface MouthFeatures {
  verticalOpening: number;
  horizontalWidth: number;
  aspectRatio: number;
  roundness: number;
  jawOpening: number;
}

/**
 * 母音検出結果
 */
export interface VowelDetectionResult {
  vowel: Vowel;
  confidence: number;
  features?: MouthFeatures;
}

/**
 * デバッグ情報
 */
export interface DebugInfo {
  fps: number;
  landmarks: Array<{ x: number; y: number; z: number }>;
  mouthFeatures: MouthFeatures;
  detectionResult: VowelDetectionResult;
  processingTime: number;
}
