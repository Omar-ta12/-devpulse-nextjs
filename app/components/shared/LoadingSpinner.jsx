export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans gap-6">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
      <div className="text-center">
        <p className="m-0 text-lg font-semibold text-slate-900 tracking-tight">
          Loading DevPulse Dashboard
        </p>
        <p className="mt-2 text-sm text-slate-500 animate-pulse">
          Fetching analytics data…
        </p>
      </div>
    </div>
  );
}
