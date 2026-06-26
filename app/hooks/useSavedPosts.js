'use client';

import { useState, useEffect, useCallback } from 'react';
import apiFetch from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

export function useSavedPosts() {
  const { isAuthenticated } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const loadSavedPosts = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedPosts([]);
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch('/api/saved-posts');
      if (!res.ok) throw new Error('Failed to load saved posts');
      const data = await res.json();
      setSavedPosts(data);
    } catch {
      setSavedPosts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSavedPosts();
  }, [loadSavedPosts]);

  const savePost = useCallback(async (post) => {
    if (!isAuthenticated) return;

    setSavingId(post.id);
    try {
      const res = await apiFetch('/api/saved-posts', {
        method: 'POST',
        body: JSON.stringify({
          postId: post.id,
          title: post.title,
          body: post.body,
          userId: post.userId,
        }),
      });

      if (res.status === 409) {
        // Already saved - just resync state
        await loadSavedPosts();
        return;
      }

      if (!res.ok) throw new Error('Failed to save post');

      const saved = await res.json();
      setSavedPosts((prev) => [saved, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  }, [isAuthenticated, loadSavedPosts]);

  const isSaved = useCallback(
    (postId) => savedPosts.some((p) => p.postId === postId),
    [savedPosts]
  );

  return { savedPosts, savePost, isSaved, loading, savingId };
}
