type StatCardProps = {
  label: string;
  value: number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <section className="card" style={{ padding: "1rem", display: "grid", gap: "0.35rem" }}>
      <small style={{ color: "var(--muted)" }}>{label}</small>
      <strong style={{ fontSize: "1.6rem" }}>{value}</strong>
      {hint ? <small style={{ color: "var(--muted)" }}>{hint}</small> : null}
    </section>
  );
}