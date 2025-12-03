import { describe, it, expect } from 'vitest';
import { MovingAverageFilter } from '../module/utils/smoothing';

describe('MovingAverageFilter', () => {
  it('should calculate moving average', () => {
    const filter = new MovingAverageFilter(3);
    expect(filter.add(1)).toBe(1);
    expect(filter.add(2)).toBe(1.5);
    expect(filter.add(3)).toBe(2);
    expect(filter.add(4)).toBe(3);
  });

  it('should reset filter', () => {
    const filter = new MovingAverageFilter(3);
    filter.add(1);
    filter.add(2);
    filter.reset();
    expect(filter.getAverage()).toBe(0);
  });

  it('should throw error for invalid window size', () => {
    expect(() => new MovingAverageFilter(0)).toThrow();
    expect(() => new MovingAverageFilter(-1)).toThrow();
  });
});

