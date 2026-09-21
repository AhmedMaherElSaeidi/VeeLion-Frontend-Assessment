import Link from "next/link";
import { ActivityDashboard } from "@/components/activity/ActivityDashboard";

export default function ActivityPage() {
  return (
    <main className="stack">
      <nav>
        <Link href="/" className="button">
          Back
        </Link>
      </nav>
      <ActivityDashboard />
    </main>
  );
}