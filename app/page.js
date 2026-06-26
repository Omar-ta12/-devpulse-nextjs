import { getUserStats } from "./lib/modules/userStats";
import { getPostStats } from "./lib/modules/postStats";
import { getProductivityStats } from "./lib/modules/productivityStats";
import { triviaScorer } from "./lib/modules/triviaStats";
import { getCountryStats } from "./lib/modules/countryStats";

import DashboardClient from "./components/DashboardClient";

export default async function DashboardPage() {
  const startTime = performance.now();

  let users = [];
  let posts = [];
  let todos = [];
  let trivia = { results: [] };
  let countries = [];
  const errors = [];

  try {
    const [userRes, postRes, todoRes, triviaRes, countryRes] = await Promise.allSettled([
      fetch("https://jsonplaceholder.typicode.com/users", { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject('Users failed')),
      fetch("https://jsonplaceholder.typicode.com/posts", { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject('Posts failed')),
      fetch("https://jsonplaceholder.typicode.com/todos", { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject('Todos failed')),
      fetch("https://opentdb.com/api.php?amount=10&type=boolean", { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject('Trivia failed')),
      fetch(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/countries` : "http://localhost:3000/api/countries", { cache: 'force-cache' }).then(r => r.ok ? r.json() : Promise.reject('Countries failed'))
    ]);

    if (userRes.status === 'fulfilled') users = userRes.value; else errors.push(userRes.reason);
    if (postRes.status === 'fulfilled') posts = postRes.value; else errors.push(postRes.reason);
    if (todoRes.status === 'fulfilled') todos = todoRes.value; else errors.push(todoRes.reason);
    if (triviaRes.status === 'fulfilled') trivia = triviaRes.value; else errors.push(triviaRes.reason);
    if (countryRes.status === 'fulfilled') countries = countryRes.value; else errors.push(countryRes.reason);

  } catch (err) {
    errors.push(err.message);
  }

  const dashboardData = {
    userStats: getUserStats(users),
    postStats: getPostStats(posts),
    productivityStats: getProductivityStats(todos),
    triviaStats: triviaScorer(trivia),
    countryStats: getCountryStats(countries),
  };

  const endTime = performance.now();
  const loadTime = ((endTime - startTime) / 1000).toFixed(2);

  return (
    <DashboardClient 
      initialData={dashboardData} 
      initialErrors={errors} 
      initialLoadTime={loadTime} 
      initialPosts={posts}
    />
  );
}
