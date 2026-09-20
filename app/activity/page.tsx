"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ActivityLog } from "@/types/api";
import { ActivityCreateForm } from "@/components/activity/ActivityCreateForm";

function formatTime(value: string) {
  return new Date(value).toLocaleString();
}

function filterActivity(items: ActivityLog[], query: string) {
  if (!query) {
    return items;
  }

  const lower = query.toLowerCase();
  return items.filter(
    (item) =>
      (item.action || "").toLowerCase().includes(lower) ||
      (item.info || "").toLowerCase().includes(lower)
  );
}

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/activity");
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const data = (await response.json()) as ActivityLog[];
        if (!cancelled) {
          setActivity(data || []);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load activity right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredActivity = useMemo(
    () => filterActivity(activity, query),
    [activity, query]
  );

  async function handleCreate(action: string, info: string): Promise<boolean> {
    try {
      setError("");

      const response = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info ? { action, info } : { action }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const created = (await response.json()) as ActivityLog;
      setActivity((previous) => [...previous, created]);
      return true;
    } catch {
      setError("Could not add that entry.");
      return false;
    }
  }

  return (
    <main className="stack">
      <nav>
        <Link href="/" className="button">
          Back
        </Link>
      </nav>

      <section className="card" style={{ padding: "1rem" }}>
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
      </section>

      <ActivityCreateForm onCreate={handleCreate} />

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
        <section
          className="card"
          style={{ padding: "1rem", borderColor: "#e3b4c0", background: "#fff8fa" }}
        >
          <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
        </section>
      ) : null}

      {!loading && !error ? (
        filteredActivity.length === 0 ? (
          <section className="card" style={{ padding: "1rem" }}>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              No activity matches this search.
            </p>
          </section>
        ) : (
          <section className="card" style={{ padding: "1rem" }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.7rem" }}>
              {filteredActivity.map((item) => (
                <li
                  key={item.id}
                  style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.6rem" }}
                >
                  <div style={{ fontWeight: 600 }}>{item.action || "(no action)"}</div>
                  <div>{item.info || "(no info)"}</div>
                  <small style={{ color: "var(--muted)" }}>{formatTime(item.when)}</small>
                </li>
              ))}
            </ul>
          </section>
        )
      ) : null}
    </main>
  );
}