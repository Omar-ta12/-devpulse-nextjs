import { Bookmark, BookmarkCheck } from 'lucide-react';

export default function PostCard({ post, saved, saving, onSave }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-shadow">
      <span className="inline-block w-fit text-[11px] font-semibold text-blue-500 bg-blue-500/10 border border-blue-500/25 rounded-full px-2.5 py-0.5 tracking-wide">
        User {post.userId}
      </span>

      <h3 className="m-0 text-sm font-semibold text-[var(--text-primary)] leading-snug capitalize">
        {post.title}
      </h3>

      <p className="m-0 text-[13px] text-[var(--text-secondary)] leading-relaxed flex-grow">
        {post.body}
      </p>

      <button
        onClick={() => !saved && !saving && onSave(post)}
        disabled={saved || saving}
        className={`mt-1 self-start inline-flex items-center px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
          saved
            ? 'text-green-600 bg-green-500/15 border border-green-400/35 cursor-default'
            : 'text-white bg-blue-500 hover:bg-blue-600 border-transparent cursor-pointer'
        }`}
        title={saved ? 'Already saved' : 'Save this post'}
      >
        {saved ? (
          <>
            <BookmarkCheck size={15} className="mr-1.5" />
            Saved
          </>
        ) : saving ? (
          'Saving…'
        ) : (
          <>
            <Bookmark size={15} className="mr-1.5" />
            Save
          </>
        )}
      </button>
    </div>
  );
}
