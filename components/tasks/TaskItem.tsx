import type { Task } from "@/types/api";

type TaskItemProps = {
  task: Task;
  busy: boolean;
  deleting: boolean;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskItem({ task, busy, deleting, onToggle, onDelete }: TaskItemProps) {
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
        <p style={{ margin: 0, fontWeight: 600 }}>{task.title}</p>
        <span className="badge">{task.completed ? "Completed" : "Pending"}</span>
      </div>

      <small style={{ color: "var(--muted)" }}>
        Updated: {new Date(task.updatedAt).toLocaleString()}
      </small>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          className="button"
          onClick={() => onToggle(task)}
          disabled={busy || deleting}
          aria-label={`Mark ${task.title} as ${task.completed ? "pending" : "completed"}`}
        >
          {busy ? "Saving..." : task.completed ? "Mark as Pending" : "Mark as Completed"}
        </button>

        <button
          type="button"
          className="button danger-button"
          onClick={() => onDelete(task)}
          disabled={busy || deleting}
          aria-label={`Delete ${task.title}`}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}