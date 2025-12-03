/**
 * 幾何計算ユーティリティ関数
 */

export interface Point {
  x: number;
  y: number;
  z?: number;
}

/**
 * 2点間のユークリッド距離を計算
 */
export function calculateDistance(
  p1: Point,
  p2: Point
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = (p2.z ?? 0) - (p1.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * 3点から角度を計算（ラジアン）
 * p2を頂点とする角度
 */
export function calculateAngle(
  p1: Point,
  p2: Point,
  p3: Point
): number {
  const v1x = p1.x - p2.x;
  const v1y = p1.y - p2.y;
  const v2x = p3.x - p2.x;
  const v2y = p3.y - p2.y;

  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  const cosAngle = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
}

/**
 * 点の配列から重心を計算
 */
export function calculateCentroid(points: Point[]): Point {
  if (points.length === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  const sum = points.reduce(
    (acc, p) => ({
      x: acc.x + p.x,
      y: acc.y + p.y,
      z: (acc.z ?? 0) + (p.z ?? 0),
    }),
    { x: 0, y: 0, z: 0 }
  );

  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
    z: sum.z / points.length,
  };
}

/**
 * 2点間の距離を正規化（0-1の範囲）
 */
export function normalizeDistance(
  distance: number,
  maxDistance: number
): number {
  return Math.min(1, Math.max(0, distance / maxDistance));
}

