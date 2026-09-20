"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ActivityLog } from "@/types/api";

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
  const [actionInput, setActionInput] = useState("");
  const [infoInput, setInfoInput] = useState("");
  const [creating, setCreating] = useState(false);

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

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const action = actionInput.trim();
    if (!action) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, info: infoInput.trim() || undefined }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const created = (await response.json()) as ActivityLog;
      setActivity((previous) => [...previous, created]);
      setActionInput("");
      setInfoInput("");
    } catch {
      setError("Could not add that entry.");
    } finally {
      setCreating(false);
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

      <form className="card" style={{ padding: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }} onSubmit={handleCreate}>
        <label htmlFor="activity-action" className="input-label">
          Action
        </label>
        <input
          id="activity-action"
          className="input"
          style={{ flex: "1 1 200px" }}
          placeholder="What happened? (e.g. reviewed task)"
          value={actionInput}
          onChange={(event) => setActionInput(event.target.value)}
        />
        <label htmlFor="activity-info" className="input-label">
          Details
        </label>
        <input
          id="activity-info"
          className="input"
          style={{ flex: "1 1 200px" }}
          placeholder="Details (optional)"
          value={infoInput}
          onChange={(event) => setInfoInput(event.target.value)}
        />
        <button type="submit" className="button primary" disabled={creating || !actionInput.trim()}>
          {creating ? "Logging..." : "Log it"}
        </button>
      </form>

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
