"use client";

import { useReports } from "@/hooks/useReports";
import type { ReportsWindowInput } from "@/hooks/useReports";
import { ReportsWindowForm } from "@/components/reports/ReportsWindowForm";
import { StatCard } from "@/components/reports/StatCard";

function formatWindowLabel(window: ReportsWindowInput): string {
  const hasCustomWindow = Boolean(window.hours || window.minutes || window.seconds);

  if (!hasCustomWindow) {
    return "last 24h (default)";
  }

  const parts: string[] = [];
  if (window.hours) parts.push(`${window.hours}h`);
  if (window.minutes) parts.push(`${window.minutes}m`);
  if (window.seconds) parts.push(`${window.seconds}s`);

  return `last ${parts.join(" ")}`;
}

export function ReportsDashboard() {
  const { summary, loading, error, appliedWindow, fetchSummary } = useReports();

  return (
    <section className="stack">
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Reports</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          A quick summary of tasks and recent activity.
        </p>
      </header>

      <ReportsWindowForm onApply={fetchSummary} applying={loading} />

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading summary...</p>
        </section>
      ) : null}

      {error ? (
        <section className="card" style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}>
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--danger)" }}>{error}</p>
          <button type="button" className="button" onClick={() => fetchSummary(appliedWindow)}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error && summary ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <StatCard label="Total tasks" value={summary.total} />
            <StatCard
              label="Recent activity"
              value={summary.recentActivityCount}
              hint={formatWindowLabel(appliedWindow)}
            />
          </div>

          <section className="card" style={{ padding: "1rem" }}>
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.05rem" }}>
              Tasks by status
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <StatCard label="To do" value={summary.byStatus.todo} />
              <StatCard label="In progress" value={summary.byStatus["in-progress"]} />
              <StatCard label="Done" value={summary.byStatus.done} />
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}