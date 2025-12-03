import { VowelTrackerError, ErrorCode } from '../utils/errors';

/**
 * デフォルトのカメラ制約
 */
const DEFAULT_CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    frameRate: { ideal: 30 },
    facingMode: 'user',
  },
  audio: false,
};

/**
 * カメラ管理クラス
 * Webカメラへのアクセスとビデオストリームの管理を行います。
 */
export class CameraManager {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  /**
   * カメラを起動してビデオ要素に接続
   * @param videoElement - ビデオ表示用のHTML要素
   * @param constraints - カメラ制約（解像度、フレームレートなど）
   */
  async start(
    videoElement: HTMLVideoElement,
    constraints?: MediaStreamConstraints
  ): Promise<void> {
    if (this.isActive()) {
      return;
    }

    const cameraConstraints = constraints ?? DEFAULT_CAMERA_CONSTRAINTS;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(
        cameraConstraints
      );
      this.videoElement = videoElement;
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();
    } catch (error) {
      const err = error as DOMException;
      let errorCode: ErrorCode;
      let errorMessage: string;

      switch (err.name) {
        case 'NotAllowedError':
          errorCode = ErrorCode.CAMERA_PERMISSION_DENIED;
          errorMessage = 'カメラへのアクセスが拒否されました。ブラウザの設定でカメラの使用を許可してください。';
          break;
        case 'NotFoundError':
          errorCode = ErrorCode.CAMERA_NOT_AVAILABLE;
          errorMessage = 'カメラデバイスが見つかりません。';
          break;
        case 'NotReadableError':
          errorCode = ErrorCode.CAMERA_NOT_AVAILABLE;
          errorMessage = 'カメラが他のアプリケーションで使用中です。';
          break;
        default:
          errorCode = ErrorCode.CAMERA_NOT_AVAILABLE;
          errorMessage = `カメラの起動に失敗しました: ${err.message}`;
      }

      throw new VowelTrackerError(errorMessage, errorCode, err);
    }
  }

  /**
   * カメラを停止してストリームを解放
   */
  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  /**
   * 現在のビデオ要素を取得
   */
  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  /**
   * カメラが起動中かどうか
   */
  isActive(): boolean {
    return this.stream !== null && this.videoElement !== null;
  }
}

