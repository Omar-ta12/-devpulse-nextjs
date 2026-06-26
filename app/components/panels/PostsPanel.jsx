'use client';

import { useState, useEffect } from 'react';
import { useSavedPosts } from '../../hooks/useSavedPosts';
import PostCard from '../shared/PostCard';
import SectionTitle from '../shared/SectionTitle';
import { Loader2, Inbox } from 'lucide-react';

const TABS = [
  { key: 'all', label: 'All Posts' },
  { key: 'saved', label: 'My Posts' },
];

export default function PostsPanel({ initialPosts = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState(initialPosts);
  
  // Note: in the original frontend, fetchPosts() was called inside useEffect.
  // In Next.js App Router, we fetch initialPosts on the server and pass them down.
  
  const { savedPosts, savePost, isSaved, loading: savedLoading, savingId } = useSavedPosts();

  const displayedPosts =
    activeTab === 'all'
      ? posts
      : savedPosts.map((sp) => ({ id: sp.postId, title: sp.title, body: sp.body, userId: sp.userId }));

  return (
    <div className="w-full">
      <SectionTitle title="Posts" />

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-[var(--border)]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 text-sm transition-colors rounded-none border-b-2 mb-[-1px] ${
              activeTab === tab.key
                ? 'font-semibold text-blue-500 border-blue-500'
                : 'font-medium text-[var(--text-secondary)] border-transparent hover:text-blue-400'
            }`}
          >
            {tab.label}
            {tab.key === 'saved' && savedPosts.length > 0 && (
              <span className="text-[11px] font-semibold text-white bg-blue-500 rounded-full px-2 py-0.5 leading-relaxed">
                {savedPosts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'saved' && savedLoading && (
        <div className="flex flex-col items-center justify-center py-16 px-5 gap-3">
          <Loader2 size={28} className="animate-spin text-blue-500" />
          <p className="text-sm text-[var(--text-secondary)] text-center max-w-[320px] m-0">
            Loading posts…
          </p>
        </div>
      )}

      {!(activeTab === 'saved' && savedLoading) && displayedPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-5 gap-3">
          <Inbox size={40} className="text-slate-300" />
          <p className="text-sm text-[var(--text-secondary)] text-center max-w-[320px] m-0">
            {activeTab === 'saved'
              ? "You haven't saved any posts yet. Browse All Posts and hit Save."
              : 'No posts found.'}
          </p>
        </div>
      )}

      {!(activeTab === 'saved' && savedLoading) && displayedPosts.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 w-full">
          {displayedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              saved={isSaved(post.id)}
              saving={savingId === post.id}
              onSave={savePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
