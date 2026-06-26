export function getPostStats(posts) {
  const postsPerUser = {};

  posts.forEach((post) => {
    postsPerUser[post.userId] =
      (postsPerUser[post.userId] || 0) + 1;
  });

  const leaderboard = Object.entries(postsPerUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId, count]) => ({
      user: `User ${userId}`,
      postCount: count,             // ✅ renamed to postCount per spec
    }));

  return {
    totalPosts: posts.length,
    topPoster: leaderboard[0],      // ✅ extra stat card
    leaderboard,
  };
}