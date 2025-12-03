import {
  FaceLandmarker,
  FilesetResolver,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision';
import type { FaceLandmarkResult } from '../types';
import { VowelTrackerError, ErrorCode } from '../utils/errors';

/**
 * MediaPipe FaceLandmarkerのラッパークラス
 * 顔ランドマーク検出を管理します。
 */
export class FaceLandmarkerWrapper {
  private faceLandmarker: FaceLandmarker | null = null;
  private isInitialized = false;

  /**
   * MediaPipeモデルを初期化
   * @param modelPath - モデルファイルのパス
   */
  async initialize(modelPath: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm'
      );

      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: false,
      });

      this.isInitialized = true;
    } catch (error) {
      const err = error as Error;
      throw new VowelTrackerError(
        `MediaPipeモデルの読み込みに失敗しました: ${err.message}`,
        ErrorCode.MODEL_LOAD_FAILED,
        err
      );
    }
  }

  /**
   * ビデオフレームから顔ランドマークを検出
   * @param videoElement - ビデオ要素
   * @returns 検出された顔ランドマーク（検出失敗時はnull）
   */
  detect(videoElement: HTMLVideoElement): FaceLandmarkResult | null {
    if (!this.isInitialized || !this.faceLandmarker) {
      throw new VowelTrackerError(
        'FaceLandmarker is not initialized. Call initialize() first.',
        ErrorCode.NOT_INITIALIZED
      );
    }

    if (
      videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA ||
      videoElement.videoWidth === 0 ||
      videoElement.videoHeight === 0
    ) {
      return null;
    }

    try {
      const result = this.faceLandmarker.detectForVideo(
        videoElement,
        performance.now()
      );

      if (result.faceLandmarks.length === 0) {
        return null;
      }

      const landmarks = result.faceLandmarks[0];
      const faceBlendshapes = result.faceBlendshapes?.[0]?.categories;

      return {
        landmarks: landmarks.map((landmark: NormalizedLandmark) => ({
          x: landmark.x,
          y: landmark.y,
          z: landmark.z ?? 0,
        })),
        faceBlendshapes: faceBlendshapes?.map((blendshape) => ({
          score: blendshape.score,
          categoryName: blendshape.categoryName,
        })),
      };
    } catch (error) {
      const err = error as Error;
      throw new VowelTrackerError(
        `顔ランドマークの検出に失敗しました: ${err.message}`,
        ErrorCode.DETECTION_FAILED,
        err
      );
    }
  }

  /**
   * リソースを解放
   */
  dispose(): void {
    this.faceLandmarker = null;
    this.isInitialized = false;
  }
}

