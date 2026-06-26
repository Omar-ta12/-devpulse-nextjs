'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import LoadingSpinner from "./shared/LoadingSpinner";
import ErrorBanner from "./shared/ErrorBanner";

import OverviewPanel from "./panels/OverviewPanel";
import UsersPanel from "./panels/UsersPanel";
import PostsPanel from "./panels/PostsPanel";
import ProductivityPanel from "./panels/ProductivityPanel";
import TriviaPanel from "./panels/TriviaPanel";
import CountriesPanel from "./panels/CountriesPanel";
import ContactPanel from "./panels/ContactPanel";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "productivity", label: "Productivity" },
  { id: "trivia", label: "Trivia" },
  { id: "countries", label: "Countries" },
  { id: "contact", label: "Contact" },
];

export default function DashboardClient({ initialData, initialErrors, initialLoadTime, initialPosts }) {
  const [activeTab, setActiveTab] = useState("overview");
  const { logout, user, isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const dark = theme === "dark";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text-primary)] font-sans py-5 pb-7 px-0 transition-colors duration-200">
      <div className="w-full max-w-[1600px] mx-auto px-6 box-border">
        {initialErrors.length > 0 && (
          <ErrorBanner message={initialErrors.join(", ")} />
        )}

        <header className="flex justify-between items-center flex-wrap gap-3 mb-5">
          <div>
            <h1 className="m-0 text-[28px] font-bold tracking-tight leading-tight text-[var(--text-primary)]">
              DevPulse Dashboard
            </h1>
            <p className="mt-1 m-0 text-[14px] text-slate-500">
              Real-time analytics across users, content, and regions
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {user && (
              <span className="text-[17px] text-slate-500 mr-2">
                👋 {user.name}
              </span>
            )}

            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 w-[110px] text-sm font-semibold text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] rounded-lg cursor-pointer transition-all hover:shadow-sm"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 w-[110px] text-sm font-semibold text-blue-500 hover:text-blue-700 bg-[var(--surface)] border border-[var(--border)] hover:border-blue-300 rounded-lg cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px]"
            >
              <span className="inline-block text-base leading-none">↻</span>
              Refresh
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 w-[110px] text-sm font-semibold text-white bg-red-500 hover:bg-red-600 border-none rounded-lg cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px]"
            >
              Logout
            </button>
          </div>
        </header>

        <nav
          className="flex flex-wrap gap-1.5 w-full p-1.5 bg-[var(--nav-bg)] rounded-xl mb-5 box-border"
          aria-label="Dashboard sections"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm whitespace-nowrap rounded-lg border-none cursor-pointer transition-all ${
                  isActive
                    ? "font-semibold text-[var(--text-primary)] bg-[var(--bg)] shadow-sm"
                    : "font-medium text-[var(--text-secondary)] bg-transparent hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <main className="w-full">
          {activeTab === "overview" && (
            <OverviewPanel
              userStats={initialData.userStats}
              postStats={initialData.postStats}
              triviaStats={initialData.triviaStats}
              countryStats={initialData.countryStats}
            />
          )}
          {activeTab === "users" && (
            <UsersPanel userStats={initialData.userStats} />
          )}
          {activeTab === "posts" && (
            <PostsPanel initialPosts={initialPosts} />
          )}
          {activeTab === "productivity" && (
            <ProductivityPanel productivityStats={initialData.productivityStats} />
          )}
          {activeTab === "trivia" && (
            <TriviaPanel triviaStats={initialData.triviaStats} />
          )}
          {activeTab === "countries" && (
            <CountriesPanel countryStats={initialData.countryStats} />
          )}
          {activeTab === "contact" && (
            <ContactPanel />
          )}
        </main>

        <footer className="mt-8 px-5 py-3.5 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm">
          <p className="m-0 text-[13px] text-[var(--text-secondary)]">
            Dashboard loaded in{" "}
            <span className="font-semibold text-blue-500 tabular-nums">
              {initialLoadTime}s
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
