'use client';

import { useState } from 'react';

export default function StatCard({ title, value, icon: Icon }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`bg-[var(--surface)] rounded-xl px-6 py-5 border border-[var(--border)] transition-all duration-200 cursor-default ${
        hovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {Icon && (
        <div className="mb-3 text-blue-500">
          <Icon size={22} />
        </div>
      )}

      <h3 className="m-0 text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
        {title}
      </h3>

      <p className="mt-2.5 text-3xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
        {value}
      </p>
    </div>
  );
}
