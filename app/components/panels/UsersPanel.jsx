import Badge from '../shared/Badge';
import SectionTitle from '../shared/SectionTitle';
import StatCard from '../shared/StatCard';
import { Users, Mail, Building2, Globe } from 'lucide-react';

export default function UsersPanel({ userStats }) {
  return (
    <div className="w-full">
      <SectionTitle title="Users" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 w-full mb-4">
        <StatCard title="Total Users" value={userStats?.totalUsers ?? 0} icon={Users} />
        <StatCard title=".biz Emails" value={userStats?.bizUsers ?? 0} icon={Mail} />
        <StatCard title="Companies" value={userStats?.companies ?? 0} icon={Building2} />
        <StatCard title="Has Website" value={userStats?.hasWebsite ?? 0} icon={Globe} />
      </div>

      <div className="w-full bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm mb-4">
        <p className="m-0 mb-3 font-semibold text-[15px] text-[var(--text-primary)]">
          Companies
        </p>
        <div className="flex flex-wrap gap-2">
          {userStats?.companyList?.map((company, idx) => (
            <Badge key={idx} text={company} />
          ))}
        </div>
      </div>

      <div className="w-full bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm mb-4">
        <p className="m-0 mb-3 font-semibold text-[15px] text-[var(--text-primary)]">
          Website Check
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 bg-[var(--surface)] rounded-lg py-3.5 px-4 border border-[var(--border)] shadow-sm flex flex-col gap-1">
            <p className="m-0 text-[13px] text-[var(--text-secondary)]">Has Website</p>
            <strong className="text-xl text-green-500">
              {userStats?.hasWebsite ?? 0}
            </strong>
          </div>
          <div className="flex-1 bg-[var(--surface)] rounded-lg py-3.5 px-4 border border-[var(--border)] shadow-sm flex flex-col gap-1">
            <p className="m-0 text-[13px] text-[var(--text-secondary)]">No Website</p>
            <strong className="text-xl text-red-500">
              {(userStats?.totalUsers ?? 0) - (userStats?.hasWebsite ?? 0)}
            </strong>
          </div>
        </div>
      </div>

      <div className="w-full bg-[var(--surface)] rounded-xl p-5 border border-[var(--border)] shadow-sm">
        <p className="m-0 mb-3 font-semibold text-[15px] text-[var(--text-primary)]">
          .biz Users
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {userStats?.bizUserList?.map((user, idx) => (
            <div key={idx} className="bg-[var(--surface)] rounded-lg py-3.5 px-4 border border-[var(--border)] shadow-sm flex flex-col gap-1">
              <p className="m-0 font-semibold text-[15px] text-[var(--text-primary)]">
                {user.name}
              </p>
              <p className="m-0 text-[13px] text-[var(--text-secondary)]">
                {user.email}
              </p>
              <p className="m-0 text-[13px] text-[var(--text-secondary)]">
                {user.company.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
