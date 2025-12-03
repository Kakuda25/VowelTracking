import { describe, it, expect } from 'vitest';
import { VowelDetector } from '../module/core/VowelDetector';
import type { FaceLandmarkResult } from '../module/types';

describe('VowelDetector', () => {
  const detector = new VowelDetector(0.5);

  function createMockLandmarks(
    verticalOpening: number,
    horizontalWidth: number,
    jawOpening: number = 0.2
  ): FaceLandmarkResult {
    const landmarks = Array(468).fill(null).map(() => ({
      x: Math.random(),
      y: Math.random(),
      z: 0,
    }));

    landmarks[13] = { x: 0.5, y: 0.5 - verticalOpening / 2, z: 0 };
    landmarks[14] = { x: 0.5, y: 0.5 + verticalOpening / 2, z: 0 };
    landmarks[61] = { x: 0.5 - horizontalWidth / 2, y: 0.5, z: 0 };
    landmarks[291] = { x: 0.5 + horizontalWidth / 2, y: 0.5, z: 0 };
    landmarks[152] = { x: 0.5, y: 0.5 + jawOpening, z: 0 };
    landmarks[10] = { x: 0.5, y: 0.5 - jawOpening, z: 0 };
    landmarks[312] = { x: 0.5, y: 0.5 - verticalOpening / 2 + 0.01, z: 0 };
    landmarks[308] = { x: 0.5, y: 0.5 + verticalOpening / 2 - 0.01, z: 0 };
    landmarks[0] = { x: 0.5, y: 0.5 - verticalOpening / 2, z: 0 };
    landmarks[17] = { x: 0.5, y: 0.5 + verticalOpening / 2, z: 0 };

    return { landmarks };
  }

  it('should detect closed mouth', () => {
    const landmarks = createMockLandmarks(0.01, 0.15);
    const result = detector.detect(landmarks);
    expect(result.vowel).toBe('closed');
  });

  it('should detect "a" vowel', () => {
    const landmarks = createMockLandmarks(0.2, 0.2, 0.4);
    const result = detector.detect(landmarks);
    expect(result.vowel).toBe('a');
  });

  it('should detect "i" vowel', () => {
    const landmarks = createMockLandmarks(0.05, 0.35);
    const result = detector.detect(landmarks);
    expect(result.vowel).toBe('i');
  });

  it('should return confidence score', () => {
    const landmarks = createMockLandmarks(0.01, 0.15);
    const result = detector.detect(landmarks);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should include features in result', () => {
    const landmarks = createMockLandmarks(0.1, 0.2);
    const result = detector.detect(landmarks);
    expect(result.features).toBeDefined();
    expect(result.features?.verticalOpening).toBeGreaterThan(0);
    expect(result.features?.horizontalWidth).toBeGreaterThan(0);
  });
});

