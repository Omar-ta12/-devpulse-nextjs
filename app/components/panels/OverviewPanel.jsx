import StatCard from '../shared/StatCard';
import SectionTitle from '../shared/SectionTitle';
import { Users, FileText, Globe, HelpCircle } from 'lucide-react';

export default function OverviewPanel({ userStats, postStats, triviaStats, countryStats }) {
  const totalQuestions = triviaStats?.questions?.length ?? 0;

  return (
    <div className="w-full">
      <SectionTitle title="Overview" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full">
        <StatCard
          title="Total Users"
          value={userStats?.totalUsers ?? 0}
          icon={Users}
        />

        <StatCard
          title="Total Posts"
          value={postStats?.totalPosts ?? 0}
          icon={FileText}
        />

        <StatCard
          title="Trivia Questions"
          value={totalQuestions}
          icon={HelpCircle}
        />

        <StatCard
          title="Asian Countries"
          value={countryStats?.totalCountries ?? 0}
          icon={Globe}
        />
      </div>
    </div>
  );
}
