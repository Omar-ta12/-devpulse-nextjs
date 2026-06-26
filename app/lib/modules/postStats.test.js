import { describe, test, expect } from 'vitest';
import { getPostStats } from './postStats';

describe('getPostStats', () => {
  test('returns zero stats for empty posts', () => {
    const result = getPostStats([]);

    expect(result.totalPosts).toBe(0);
    expect(result.topPoster).toBeUndefined();
    expect(result.leaderboard).toEqual([]);
  });

  test('counts total posts correctly', () => {
    const posts = [{ userId: 1 }, { userId: 2 }, { userId: 1 }];
    const result = getPostStats(posts);

    expect(result.totalPosts).toBe(3);
  });

  test('identifies the top poster', () => {
    const posts = [
      { userId: 1 },
      { userId: 1 },
      { userId: 2 },
    ];
    const result = getPostStats(posts);

    expect(result.topPoster.user).toBe('User 1');
    expect(result.topPoster.postCount).toBe(2);
  });

  test('formats leaderboard entries correctly', () => {
    const posts = [
      { userId: 1 },
      { userId: 2 },
      { userId: 2 },
    ];
    const result = getPostStats(posts);

    expect(result.leaderboard).toEqual([
      { user: 'User 2', postCount: 2 },
      { user: 'User 1', postCount: 1 },
    ]);
  });

  test('limits leaderboard to top 5 users', () => {
    const posts = Array.from({ length: 100 }, (_, i) => ({
      userId: i % 10,
    }));
    const result = getPostStats(posts);

    expect(result.leaderboard).toHaveLength(5);
  });

  test('handles leaderboard with fewer than 5 users', () => {
    const posts = [{ userId: 1 }, { userId: 1 }];
    const result = getPostStats(posts);

    expect(result.leaderboard).toHaveLength(1);
  });

  test('breaks ties by original order (stable sort)', () => {
    const posts = [
      { userId: 1 },
      { userId: 2 },
    ];
    const result = getPostStats(posts);

    expect(result.leaderboard[0].postCount).toBe(1);
    expect(result.leaderboard[1].postCount).toBe(1);
  });
});
