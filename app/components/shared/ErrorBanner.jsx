export default function ErrorBanner({ message }) {
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 mb-5 text-left" role="alert">
      <span className="shrink-0 w-5.5 h-5.5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
        !
      </span>
      <div>
        <p className="m-0 text-[13px] font-semibold text-red-800 uppercase tracking-wide">
          Partial load error
        </p>
        <p className="mt-1 text-sm text-red-700 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
