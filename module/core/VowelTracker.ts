import type {
  VowelTrackerOptions,
  Vowel,
  VowelDetectionCallback,
  DebugInfo,
} from '../types';
import { DEFAULT_CONFIG } from '../config/constants';
import { CameraManager } from './CameraManager';
import { FaceLandmarkerWrapper } from './FaceLandmarkerWrapper';
import { VowelDetector } from './VowelDetector';
import { MovingAverageFilter } from '../utils/smoothing';
import { VowelTrackerError, ErrorCode } from '../utils/errors';

/**
 * 母音検出トラッカー
 * 
 * MediaPipe FaceLandmarkerを使用してカメラ映像から
 * リアルタイムで母音を検出します。
 */
export class VowelTracker {
  private options: Required<Omit<VowelTrackerOptions, 'cameraConstraints'>> & {
    cameraConstraints?: MediaStreamConstraints;
  };
  private cameraManager: CameraManager;
  private faceLandmarkerWrapper: FaceLandmarkerWrapper;
  private vowelDetector: VowelDetector;
  private isInitialized = false;
  private isRunning = false;
  private detectionTimer: number | null = null;
  private lastDetectedVowel: Vowel | null = null;
  private smoothingFilters: Map<string, MovingAverageFilter> = new Map();
  private debugInfo: DebugInfo | null = null;
  private frameCount = 0;
  private lastFpsTime = performance.now();

  constructor(options: VowelTrackerOptions = {}) {
    this.options = {
      modelPath: options.modelPath ?? DEFAULT_CONFIG.MODEL_PATH,
      onVowelDetected: options.onVowelDetected ?? (() => {}),
      confidenceThreshold:
        options.confidenceThreshold ?? DEFAULT_CONFIG.CONFIDENCE_THRESHOLD,
      detectionInterval:
        options.detectionInterval ?? DEFAULT_CONFIG.DETECTION_INTERVAL,
      smoothingWindowSize: options.smoothingWindowSize ?? 5,
      debug: options.debug ?? false,
      cameraConstraints: options.cameraConstraints,
    };

    this.cameraManager = new CameraManager();
    this.faceLandmarkerWrapper = new FaceLandmarkerWrapper();
    this.vowelDetector = new VowelDetector(this.options.confidenceThreshold);

    if (this.options.smoothingWindowSize > 0) {
      this.smoothingFilters.set('verticalOpening', new MovingAverageFilter(this.options.smoothingWindowSize));
      this.smoothingFilters.set('horizontalWidth', new MovingAverageFilter(this.options.smoothingWindowSize));
      this.smoothingFilters.set('aspectRatio', new MovingAverageFilter(this.options.smoothingWindowSize));
      this.smoothingFilters.set('roundness', new MovingAverageFilter(this.options.smoothingWindowSize));
      this.smoothingFilters.set('jawOpening', new MovingAverageFilter(this.options.smoothingWindowSize));
    }
  }

  /**
   * MediaPipeモデルを初期化
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.faceLandmarkerWrapper.initialize(this.options.modelPath);
      this.isInitialized = true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * カメラを起動してビデオ要素に接続
   * @param videoElement - ビデオ表示用のHTML要素
   */
  async startCamera(videoElement: HTMLVideoElement): Promise<void> {
    await this.cameraManager.start(
      videoElement,
      this.options.cameraConstraints
    );
  }

  /**
   * ビデオ要素から母音検出を開始
   */
  start(videoElement: HTMLVideoElement): void {
    if (!this.isInitialized) {
      throw new VowelTrackerError(
        'VowelTracker is not initialized. Call initialize() first.',
        ErrorCode.NOT_INITIALIZED
      );
    }

    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastDetectedVowel = null;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();
    this.startDetectionLoop(videoElement);
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
    this.lastDetectedVowel = null;
  }

  /**
   * カメラを停止
   */
  stopCamera(): void {
    this.cameraManager.stop();
  }

  /**
   * リソースを解放
   */
  dispose(): void {
    this.stop();
    this.stopCamera();
    this.faceLandmarkerWrapper.dispose();
    this.isInitialized = false;
    this.smoothingFilters.forEach((filter) => filter.reset());
  }

  /**
   * デバッグ情報を取得
   */
  getDebugInfo(): DebugInfo | null {
    return this.debugInfo;
  }

  /**
   * 検出ループを開始
   */
  private startDetectionLoop(videoElement: HTMLVideoElement): void {
    this.detectionTimer = window.setInterval(() => {
      const startTime = performance.now();

      try {
        const landmarks = this.faceLandmarkerWrapper.detect(videoElement);
        if (!landmarks) {
          return;
        }

        const result = this.vowelDetector.detect(landmarks);

        if (result.confidence < this.options.confidenceThreshold) {
          return;
        }

        if (result.vowel !== this.lastDetectedVowel) {
          this.lastDetectedVowel = result.vowel;
          this.options.onVowelDetected(result.vowel);
        }

        if (this.options.debug) {
          this.updateDebugInfo(
            landmarks,
            result,
            performance.now() - startTime
          );
        }
      } catch (error) {
        if (this.options.debug) {
          console.error('Detection error:', error);
        }
      }
    }, this.options.detectionInterval);
  }

  /**
   * デバッグ情報を更新
   */
  private updateDebugInfo(
    landmarks: import('../types').FaceLandmarkResult,
    result: import('../types').VowelDetectionResult,
    processingTime: number
  ): void {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFpsTime;

    if (elapsed >= 1000) {
      const fps = (this.frameCount * 1000) / elapsed;
      this.frameCount = 0;
      this.lastFpsTime = now;

      this.debugInfo = {
        fps: Math.round(fps),
        landmarks: landmarks.landmarks,
        mouthFeatures: result.features ?? {
          verticalOpening: 0,
          horizontalWidth: 0,
          aspectRatio: 0,
          roundness: 0,
          jawOpening: 0,
        },
        detectionResult: result,
        processingTime,
      };
    }
  }
}
