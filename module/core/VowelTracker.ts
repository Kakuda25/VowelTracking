import type {
  VowelTrackerOptions,
  Vowel,
  VowelDetectionCallback,
} from '../types';
import { DEFAULT_CONFIG } from '../config/constants';

/**
 * 母音検出トラッカー
 * 
 * MediaPipe FaceLandmarkerを使用してカメラ映像から
 * リアルタイムで母音を検出します。
 */
export class VowelTracker {
  private options: Required<VowelTrackerOptions>;
  private isInitialized = false;
  private isRunning = false;
  private detectionTimer: number | null = null;

  constructor(options: VowelTrackerOptions = {}) {
    this.options = {
      modelPath: options.modelPath ?? DEFAULT_CONFIG.MODEL_PATH,
      onVowelDetected: options.onVowelDetected ?? (() => {}),
      confidenceThreshold:
        options.confidenceThreshold ?? DEFAULT_CONFIG.CONFIDENCE_THRESHOLD,
      detectionInterval:
        options.detectionInterval ?? DEFAULT_CONFIG.DETECTION_INTERVAL,
    };
  }

  /**
   * MediaPipeモデルを初期化
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // TODO: MediaPipe FaceLandmarkerの初期化を実装
    this.isInitialized = true;
  }

  /**
   * ビデオ要素から母音検出を開始
   */
  start(videoElement: HTMLVideoElement): void {
    if (!this.isInitialized) {
      throw new Error(
        'VowelTracker is not initialized. Call initialize() first.'
      );
    }

    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    // TODO: 検出ループの実装
  }

  /**
   * 母音検出を停止
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.detectionTimer !== null) {
      clearInterval(this.detectionTimer);
      this.detectionTimer = null;
    }

    this.isRunning = false;
  }

  /**
   * リソースを解放
   */
  dispose(): void {
    this.stop();
    this.isInitialized = false;
  }
}

