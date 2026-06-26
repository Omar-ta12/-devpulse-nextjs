export default function Badge({ text }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/15 text-[var(--text-primary)] text-sm font-semibold">
      {text}
    </span>
  );
}
