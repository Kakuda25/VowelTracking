/**
 * デフォルト設定値
 */
export const DEFAULT_CONFIG = {
  MODEL_PATH: './models/face_landmarker.task',
  CONFIDENCE_THRESHOLD: 0.5,
  DETECTION_INTERVAL: 100,
} as const;

/**
 * 母音判定に使用する顔のランドマークインデックス
 * MediaPipe FaceLandmarkerの468個のランドマークから口周りのポイントを定義
 */
export const MOUTH_LANDMARKS_INDICES = {
  UPPER_LIP_TOP: 13,
  UPPER_LIP_BOTTOM: 312,
  LOWER_LIP_TOP: 308,
  LOWER_LIP_BOTTOM: 14,
  MOUTH_LEFT: 61,
  MOUTH_RIGHT: 291,
  MOUTH_CENTER_TOP: 0,
  MOUTH_CENTER_BOTTOM: 17,
  JAW_BOTTOM: 152,
  JAW_TOP: 10,
} as const;

