"use client";

import { useActivity } from "@/hooks/useActivity";
import type { ActivityLog } from "@/types/api";
import { ActivityCreateForm } from "@/components/activity/ActivityCreateForm";
import { ActivityList } from "@/components/activity/ActivityList";

export function ActivityDashboard() {
  const {
    activity,
    filteredActivity,
    query,
    setQuery,
    loading,
    error,
    deletingActivityId,
    fetchActivity,
    createActivity,
    deleteActivity,
  } = useActivity();

  const handleDelete = (item: ActivityLog) => {
    if (window.confirm(`Delete "${item.action || "this entry"}"? This can't be undone.`)) {
      deleteActivity(item.id);
    }
  };

  return (
    <section className="stack">
      <header className="card" style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Activity Feed</h1>

        <label htmlFor="activity-search" className="input-label">
          Search activity
        </label>
        <input
          id="activity-search"
          className="input"
          placeholder="Search activity"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </header>

      <ActivityCreateForm onCreate={createActivity} />

      <section className="card" style={{ padding: "1rem" }}>
        <small style={{ color: "var(--muted)" }}>
          Total: {activity.length} | Visible: {filteredActivity.length}
        </small>
      </section>

      {loading ? (
        <section className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: 0 }}>Loading activity...</p>
        </section>
      ) : null}

      {error ? (
        <section className="card" style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}>
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "var(--danger)" }}>{error}</p>
          <button type="button" className="button" onClick={fetchActivity}>
            Retry
          </button>
        </section>
      ) : null}

      {!loading && !error ? (
        <ActivityList
          activity={filteredActivity}
          deletingActivityId={deletingActivityId}
          onDelete={handleDelete}
        />
      ) : null}
    </section>
  );
}