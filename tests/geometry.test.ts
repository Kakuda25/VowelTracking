import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculateAngle,
  calculateCentroid,
} from '../module/utils/geometry';

describe('Geometry utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 3, y: 4 };
      const distance = calculateDistance(p1, p2);
      expect(distance).toBe(5);
    });

    it('should handle 3D points', () => {
      const p1 = { x: 0, y: 0, z: 0 };
      const p2 = { x: 1, y: 1, z: 1 };
      const distance = calculateDistance(p1, p2);
      expect(distance).toBeCloseTo(Math.sqrt(3), 5);
    });
  });

  describe('calculateAngle', () => {
    it('should calculate angle between three points', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 0, y: 1 };
      const p3 = { x: 1, y: 1 };
      const angle = calculateAngle(p1, p2, p3);
      expect(angle).toBeCloseTo(Math.PI / 2, 5);
    });
  });

  describe('calculateCentroid', () => {
    it('should calculate centroid of points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 2 },
        { x: 2, y: 2 },
      ];
      const centroid = calculateCentroid(points);
      expect(centroid.x).toBe(1);
      expect(centroid.y).toBe(1);
    });

    it('should handle empty array', () => {
      const centroid = calculateCentroid([]);
      expect(centroid.x).toBe(0);
      expect(centroid.y).toBe(0);
    });
  });
});

