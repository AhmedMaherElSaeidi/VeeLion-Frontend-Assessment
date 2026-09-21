import type { ActivityLog } from "@/types/api";
import { ActivityItem } from "@/components/activity/ActivityItem";

type ActivityListProps = {
  activity: ActivityLog[];
  deletingActivityId: string;
  onDelete: (item: ActivityLog) => void;
};

export function ActivityList({ activity, deletingActivityId, onDelete }: ActivityListProps) {
  if (activity.length === 0) {
    return (
      <section className="card" style={{ padding: "1rem" }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>No activity matches this search.</p>
      </section>
    );
  }

  return (
    <section aria-label="Activity list">
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.7rem" }}>
        {activity.map((item) => (
          <ActivityItem
            key={item.id}
            item={item}
            deleting={deletingActivityId === item.id}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}