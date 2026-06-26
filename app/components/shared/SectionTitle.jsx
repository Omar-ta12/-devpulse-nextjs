export default function SectionTitle({ title }) {
  return (
    <div className="mb-4">
      <h2 className="m-0 text-[22px] font-semibold text-[var(--text-primary)] tracking-tight leading-snug">
        {title}
      </h2>
      <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-sm mt-2" />
    </div>
  );
}
