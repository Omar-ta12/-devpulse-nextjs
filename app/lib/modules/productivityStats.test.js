import { describe, test, expect } from 'vitest';
import { getProductivityStats } from './productivityStats';

describe('getProductivityStats', () => {
  test('returns empty array for no todos', () => {
    const result = getProductivityStats([]);
    expect(result).toEqual([]);
  });

  test('calculates 100% completion when all todos are done', () => {
    const todos = [
      { userId: '1', completed: true },
      { userId: '1', completed: true },
    ];
    const result = getProductivityStats(todos);

    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe('1');
    expect(result[0].percentage).toBe(100);
  });

  test('calculates 0% completion when no todos are done', () => {
    const todos = [
      { userId: '1', completed: false },
      { userId: '1', completed: false },
    ];
    const result = getProductivityStats(todos);

    expect(result[0].percentage).toBe(0);
  });

  test('calculates correct percentage for mixed completion', () => {
    const todos = [
      { userId: '1', completed: true },
      { userId: '1', completed: true },
      { userId: '1', completed: false },
      { userId: '1', completed: false },
    ];
    const result = getProductivityStats(todos);

    expect(result[0].percentage).toBe(50);
  });

  test('rounds percentage to nearest integer', () => {
    const todos = [
      { userId: '1', completed: true },
      { userId: '1', completed: false },
      { userId: '1', completed: false },
    ];
    const result = getProductivityStats(todos);

    expect(result[0].percentage).toBe(33);
  });

  test('sorts users by completion percentage descending', () => {
    const todos = [
      { userId: 'low', completed: false },
      { userId: 'low', completed: false },
      { userId: 'high', completed: true },
      { userId: 'high', completed: true },
      { userId: 'mid', completed: true },
      { userId: 'mid', completed: false },
    ];
    const result = getProductivityStats(todos);

    expect(result[0].userId).toBe('high');
    expect(result[1].userId).toBe('mid');
    expect(result[2].userId).toBe('low');
  });

  test('handles multiple users with correct counts', () => {
    const todos = [
      { userId: '1', completed: true },
      { userId: '2', completed: false },
    ];
    const result = getProductivityStats(todos);

    expect(result).toHaveLength(2);
  });
});
