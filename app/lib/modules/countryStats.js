export function getCountryStats(countries) {
  const sortedCountries = [...countries].sort(
    (a, b) => b.population - a.population
  );

  return {
    totalCountries: countries.length,
    totalPopulation: countries.reduce(
      (sum, country) => sum + country.population,
      0
    ),
    topCountries: sortedCountries.slice(0, 5),  // ✅ top 5 for chart
    allCountries: sortedCountries,               // ✅ all countries for grid
  };
}