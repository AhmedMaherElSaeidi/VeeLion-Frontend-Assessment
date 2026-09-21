import type { ActivityLog } from "@/types/api";

type ActivityItemProps = {
  item: ActivityLog;
  deleting: boolean;
  onDelete: (item: ActivityLog) => void;
};

export function ActivityItem({ item, deleting, onDelete }: ActivityItemProps) {
  return (
    <li
      className="card"
      style={{
        padding: "0.85rem",
        display: "grid",
        gap: "0.4rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "start" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{item.action || "(no action)"}</p>
        <span className="badge">{new Date(item.when).toLocaleString()}</span>
      </div>

      <small style={{ color: "var(--muted)" }}>{item.info || "(no info)"}</small>

      <div style={{ display: "flex", gap: "0.5rem",justifyContent: "end" }}>
        <button
          type="button"
          className="button danger-button"
          onClick={() => onDelete(item)}
          disabled={deleting}
          aria-label={`Delete entry ${item.action || item.id}`}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}