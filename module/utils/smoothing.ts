/**
 * 移動平均フィルタ（ノイズ除去用）
 */
export class MovingAverageFilter {
  private buffer: number[] = [];
  private readonly windowSize: number;

  constructor(windowSize: number = 5) {
    if (windowSize <= 0) {
      throw new Error('Window size must be greater than 0');
    }
    this.windowSize = windowSize;
  }

  /**
   * 新しい値を追加して平滑化された値を返す
   */
  add(value: number): number {
    this.buffer.push(value);

    if (this.buffer.length > this.windowSize) {
      this.buffer.shift();
    }

    const sum = this.buffer.reduce((acc, val) => acc + val, 0);
    return sum / this.buffer.length;
  }

  /**
   * フィルタをリセット
   */
  reset(): void {
    this.buffer = [];
  }

  /**
   * 現在の平均値を取得（新しい値を追加せず）
   */
  getAverage(): number {
    if (this.buffer.length === 0) {
      return 0;
    }
    const sum = this.buffer.reduce((acc, val) => acc + val, 0);
    return sum / this.buffer.length;
  }
}

