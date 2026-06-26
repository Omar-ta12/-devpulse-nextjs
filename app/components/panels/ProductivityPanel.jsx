'use client';

import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import SectionTitle from "../shared/SectionTitle";
import StatCard from "../shared/StatCard";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

const getColor = (value) => {
  if (value >= 80) return "#22c55e"; // green
  if (value >= 50) return "#f59e0b"; // amber
  return "#ef4444";                  // red
};

export default function ProductivityPanel({ productivityStats }) {
  const ranked = productivityStats ?? [];
  const chartData = ranked.slice(0, 10);

  const avgRate = ranked.length
    ? Math.round(ranked.reduce((sum, u) => sum + u.percentage, 0) / ranked.length)
    : 0;

  const highPerformers = ranked.filter((u) => u.percentage >= 80).length;
  const lowPerformers  = ranked.filter((u) => u.percentage < 50).length;

  return (
    <div className="w-full">
      <SectionTitle title="Productivity" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 w-full mb-4">
        <StatCard title="Avg Completion Rate" value={`${avgRate}%`} icon={Users} />
        <StatCard title="High Performers (≥80%)" value={highPerformers} icon={TrendingUp} />
        <StatCard title="Low Performers (<50%)" value={lowPerformers} icon={TrendingDown} />
      </div>

      <div className="w-full bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm box-border">
        <p className="m-0 mb-4 font-semibold text-[15px] text-[var(--text-primary)]">
          Completion Rate by User (Top 10)
        </p>

        <div className="flex flex-wrap gap-4 mb-3">
          {[
            { color: "#22c55e", label: "High (≥80%)" },
            { color: "#f59e0b", label: "Medium (50–79%)" },
            { color: "#ef4444", label: "Low (<50%)" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-xs text-[var(--text-secondary)]">{label}</span>
            </div>
          ))}
        </div>

        <div className="w-full h-[350px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis
                type="number"
                domain={[0, 100]}
                unit="%"
                tick={{ fill: "var(--text-secondary)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                dataKey="userId"
                type="category"
                width={60}
                tick={{ fill: "var(--text-secondary)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              />
              <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
