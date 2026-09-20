"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ActivityLog } from "@/types/api";

function filterActivity(items: ActivityLog[], query: string) {
  if (!query) {
    return items;
  }

  const lower = query.toLowerCase();
  return items.filter(
    (item) =>
      (item.action || "").toLowerCase().includes(lower) ||
      (item.info || "").toLowerCase().includes(lower),
  );
}

export function useActivity() {
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/activity");
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const data = (await response.json()) as ActivityLog[];
      setActivity(data || []);
    } catch {
      setError("Could not load activity right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createActivity = useCallback(async (action: string, info: string): Promise<boolean> => {
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
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const filteredActivity = useMemo(() => filterActivity(activity, query), [activity, query]);

  return {
    activity,
    filteredActivity,
    query,
    setQuery,
    loading,
    error,
    fetchActivity,
    createActivity,
  };
}
