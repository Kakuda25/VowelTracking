/**
 * VowelTracker用のカスタムエラークラス
 */

export enum ErrorCode {
  CAMERA_NOT_AVAILABLE = 'CAMERA_NOT_AVAILABLE',
  CAMERA_PERMISSION_DENIED = 'CAMERA_PERMISSION_DENIED',
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  DETECTION_FAILED = 'DETECTION_FAILED',
}

export class VowelTrackerError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'VowelTrackerError';
    Object.setPrototypeOf(this, VowelTrackerError.prototype);
  }
}

