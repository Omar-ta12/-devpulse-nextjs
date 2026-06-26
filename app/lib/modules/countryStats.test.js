import { describe, test, expect } from 'vitest';
import { getCountryStats } from './countryStats';

describe('getCountryStats', () => {
  test('returns zero stats for empty array', () => {
    const result = getCountryStats([]);

    expect(result.totalCountries).toBe(0);
    expect(result.totalPopulation).toBe(0);
    expect(result.topCountries).toEqual([]);
    expect(result.allCountries).toEqual([]);
  });

  test('handles a single country', () => {
    const countries = [{ name: 'Luxembourg', population: 650000 }];
    const result = getCountryStats(countries);

    expect(result.totalCountries).toBe(1);
    expect(result.totalPopulation).toBe(650000);
    expect(result.topCountries).toHaveLength(1);
    expect(result.allCountries).toHaveLength(1);
  });

  test('sorts countries by population descending', () => {
    const countries = [
      { name: 'Small', population: 100 },
      { name: 'Large', population: 1000 },
      { name: 'Medium', population: 500 },
    ];
    const result = getCountryStats(countries);

    expect(result.allCountries[0].name).toBe('Large');
    expect(result.allCountries[1].name).toBe('Medium');
    expect(result.allCountries[2].name).toBe('Small');
  });

  test('returns top 5 most populous countries', () => {
    const countries = Array.from({ length: 10 }, (_, i) => ({
      name: `Country ${i}`,
      population: (i + 1) * 100,
    }));
    const result = getCountryStats(countries);

    expect(result.topCountries).toHaveLength(5);
    expect(result.topCountries[0].name).toBe('Country 9');
    expect(result.topCountries[4].name).toBe('Country 5');
  });

  test('returns all countries when count is less than 5', () => {
    const countries = [
      { name: 'A', population: 300 },
      { name: 'B', population: 200 },
    ];
    const result = getCountryStats(countries);

    expect(result.topCountries).toHaveLength(2);
    expect(result.allCountries).toHaveLength(2);
  });

  test('does not mutate the original array', () => {
    const original = [
      { name: 'Z', population: 10 },
      { name: 'A', population: 100 },
    ];
    const copy = [...original];
    getCountryStats(original);

    expect(original).toEqual(copy);
  });
});
