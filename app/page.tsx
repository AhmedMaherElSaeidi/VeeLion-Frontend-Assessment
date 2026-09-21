import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header className="stack" style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>VeeLion Frontend Assessment</h1>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Task management, activity tracking, and reporting, built against the provided backend.
        </p>
      </header>

      <section className="stack" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Link href="/tasks" className="card nav-card" style={{ padding: "1.25rem", display: "block" }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.4rem" }}>Task Dashboard</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            View, filter, and update the status of your tasks.
          </p>
        </Link>

        <Link href="/activity" className="card nav-card" style={{ padding: "1.25rem", display: "block" }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.4rem" }}>Activity Feed</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            Browse and search the running log of what's happened.
          </p>
        </Link>

        <Link href="/reports" className="card nav-card" style={{ padding: "1.25rem", display: "block" }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.4rem" }}>Reports</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            A snapshot of tasks by status and recent activity.
          </p>
        </Link>
      </section>
    </main>
  );
}
