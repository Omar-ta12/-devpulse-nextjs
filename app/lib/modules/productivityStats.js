export function getProductivityStats(todos) {
  const stats = {};

  todos.forEach((todo) => {
    if (!stats[todo.userId]) {
      stats[todo.userId] = { total: 0, completed: 0 };
    }
    stats[todo.userId].total++;
    if (todo.completed) {
      stats[todo.userId].completed++;
    }
  });

  const completionRates = Object.entries(stats).map(
    ([userId, data]) => ({
      userId,
      percentage: Math.round((data.completed / data.total) * 100), // ✅ rounded
    })
  );

  // ✅ sort descending so top performers show first
  return completionRates.sort((a, b) => b.percentage - a.percentage);
}