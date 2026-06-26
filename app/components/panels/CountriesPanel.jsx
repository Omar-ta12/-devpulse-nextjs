'use client';

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import SectionTitle from "../shared/SectionTitle";
import StatCard from "../shared/StatCard";
import { Globe, Users } from "lucide-react";

export default function CountriesPanel({ countryStats }) {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const allCountries = countryStats?.allCountries || [];
  const top5 = countryStats?.topCountries || [];

  const filteredCountries = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = top5.map((country) => ({
    country: country.name.common,
    population: country.population,
  }));

  return (
    <div className="w-full">
      <SectionTitle title="Countries" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-4 w-full">
        <StatCard
          title="Total Countries"
          value={countryStats?.totalCountries ?? 0}
          icon={Globe}
        />
        <StatCard
          title="Total Population"
          value={countryStats?.totalPopulation?.toLocaleString() ?? 0}
          icon={Users}
        />
      </div>

      <div className="w-full bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm box-border mb-4">
        <p className="m-0 mb-4 font-semibold text-[15px] text-[var(--text-primary)]">
          Top 5 Asian Countries by Population
        </p>

        <div className="w-full h-[350px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="country"
                tick={{ fill: "var(--text-secondary)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fill: "var(--text-secondary)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                contentStyle={{
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              />
              <Bar dataKey="population" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 w-full">
        <div className="relative flex-1 min-w-[280px]">
          <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors duration-200 ${searchFocused ? 'text-blue-500' : 'text-slate-400'}`}>
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full py-3 pr-4 pl-10 text-sm text-[var(--text-primary)] bg-[var(--surface)] border rounded-lg outline-none transition-all duration-200 ${
              searchFocused
                ? 'border-blue-300 ring-4 ring-blue-500/10'
                : 'border-[var(--border)] shadow-sm'
            }`}
          />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-sm shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Showing <strong className="font-bold text-[var(--text-primary)]">{filteredCountries.length}</strong> {filteredCountries.length === 1 ? "country" : "countries"}
          </span>
        </div>
      </div>

      {filteredCountries.length === 0 ? (
        <div className="w-full bg-[var(--surface)] rounded-xl px-5 py-8 border border-[var(--border)] shadow-sm text-center">
          <p className="m-0 font-semibold text-base text-[var(--text-primary)]">
            No countries match your search
          </p>
          <p className="m-0 mt-1.5 text-sm text-[var(--text-secondary)]">
            Try a different name or clear the search field
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 w-full">
          {filteredCountries.map((country, idx) => (
            <div key={idx} className="bg-[var(--surface)] rounded-lg p-3.5 border border-[var(--border)] shadow-sm flex flex-col gap-1">
              <p className="m-0 font-semibold text-[15px] text-[var(--text-primary)]">
                {country.name.common}
              </p>
              <p className="m-0 text-[13px] text-[var(--text-secondary)]">
                Population: <strong className="text-[var(--text-primary)]">{country.population.toLocaleString()}</strong>
              </p>
              {country.capital?.[0] && (
                <p className="m-0 text-[13px] text-[var(--text-secondary)]">
                  Capital: <strong className="text-[var(--text-primary)]">{country.capital[0]}</strong>
                </p>
              )}
              <p className="m-0 text-[13px] text-[var(--text-secondary)]">
                Region: <strong className="text-[var(--text-primary)]">{country.region}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
