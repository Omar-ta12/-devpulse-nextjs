import { describe, test, expect } from 'vitest';
import { getUserStats } from './userStats';

function makeUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    company: { name: 'Default Inc', catchPhrase: '', bs: '' },
    website: 'example.com',
    ...overrides,
  };
}

describe('getUserStats', () => {
  test('returns zero stats for empty array', () => {
    const result = getUserStats([]);

    expect(result.totalUsers).toBe(0);
    expect(result.bizUsers).toBe(0);
    expect(result.bizUserList).toEqual([]);
    expect(result.companies).toBe(0);
    expect(result.companyList).toEqual([]);
    expect(result.hasWebsite).toBe(0);
  });

  test('counts total users correctly', () => {
    const users = [makeUser(), makeUser()];
    const result = getUserStats(users);

    expect(result.totalUsers).toBe(2);
  });

  test('counts users with .biz emails', () => {
    const users = [
      makeUser({ email: 'a@biz.biz' }),
      makeUser({ email: 'b@other.com' }),
      makeUser({ email: 'c@biz.biz' }),
    ];
    const result = getUserStats(users);

    expect(result.bizUsers).toBe(2);
  });

  test('returns the actual biz user objects', () => {
    const bizUser = makeUser({ id: 42, email: 'admin@biz.biz' });
    const users = [bizUser, makeUser({ email: 'other@foo.com' })];
    const result = getUserStats(users);

    expect(result.bizUserList).toHaveLength(1);
    expect(result.bizUserList[0].id).toBe(42);
  });

  test('returns empty biz list when no .biz emails', () => {
    const users = [makeUser({ email: 'a@foo.com' }), makeUser({ email: 'b@bar.org' })];
    const result = getUserStats(users);

    expect(result.bizUsers).toBe(0);
    expect(result.bizUserList).toEqual([]);
  });

  test('counts unique company names', () => {
    const users = [
      makeUser({ company: { name: 'Alpha Corp' } }),
      makeUser({ company: { name: 'Beta Inc' } }),
      makeUser({ company: { name: 'Alpha Corp' } }),
    ];
    const result = getUserStats(users);

    expect(result.companies).toBe(2);
  });

  test('returns the list of unique company names', () => {
    const users = [
      makeUser({ company: { name: 'Alpha Corp' } }),
      makeUser({ company: { name: 'Beta Inc' } }),
    ];
    const result = getUserStats(users);

    expect(result.companyList).toContain('Alpha Corp');
    expect(result.companyList).toContain('Beta Inc');
    expect(result.companyList).toHaveLength(2);
  });

  test('counts users with a truthy website', () => {
    const users = [
      makeUser({ website: 'https://example.com' }),
      makeUser({ website: '' }),
      makeUser({ website: 'http://other.com' }),
    ];
    const result = getUserStats(users);

    expect(result.hasWebsite).toBe(2);
  });

  test('does not count users with null or undefined website', () => {
    const users = [
      makeUser({ website: null }),
      makeUser({ website: undefined }),
    ];
    const result = getUserStats(users);

    expect(result.hasWebsite).toBe(0);
  });
});
