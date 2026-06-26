'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import SectionTitle from "../shared/SectionTitle";

export default function TriviaPanel({ triviaStats }) {
  const difficultyCounts = triviaStats?.difficultyCounts ?? [];

  const easy   = difficultyCounts.find((d) => d.difficulty === "easy")?.count ?? 0;
  const medium = difficultyCounts.find((d) => d.difficulty === "medium")?.count ?? 0;
  const hard   = difficultyCounts.find((d) => d.difficulty === "hard")?.count ?? 0;
  const total  = easy + medium + hard;

  const questions = triviaStats?.questions ?? [];

  const data = [
    { name: "Easy",   value: easy },
    { name: "Medium", value: medium },
    { name: "Hard",   value: hard },
  ];

  const colors = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="w-full">
      <SectionTitle title="Trivia Analytics" />

      {/* SCORE CARDS */}
      <div className="flex gap-2.5 mb-4">
        {[
          { label: 'Total Questions', val: total },
          { label: 'Easy', val: easy },
          { label: 'Medium', val: medium },
          { label: 'Hard', val: hard },
        ].map((item, idx) => (
          <div key={idx} className="flex-1 p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-center">
            <p className="m-0 text-sm text-[var(--text-secondary)]">{item.label}</p>
            <strong className="text-xl text-[var(--text-primary)]">{item.val}</strong>
          </div>
        ))}
      </div>

      {/* DONUT CHART */}
      <div className="w-full bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm box-border">
        <p className="m-0 mb-2.5 font-semibold text-[15px] text-[var(--text-primary)]">
          Questions by Difficulty
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              innerRadius={60}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* QUESTION LIST */}
      <div className="w-full bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm box-border mt-4">
        <p className="m-0 mb-2.5 font-semibold text-[15px] text-[var(--text-primary)]">
          Question Results
        </p>

        {questions.length > 0 ? (
          <ul className="m-0 pl-5 text-[14px] text-[var(--text-secondary)]">
            {questions.map((q, idx) => (
              <li key={idx} className="mb-2">
                <span>{q.question}</span>{" "}
                <strong className={q.answer === "True" ? "text-green-500" : "text-red-500"}>
                  ({q.answer})
                </strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-slate-400 m-0">
            No trivia data available — API may be rate limited. Try refreshing in a moment.
          </p>
        )}
      </div>
    </div>
  );
}
