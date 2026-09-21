"use client";

import { useCallback, useEffect, useState } from "react";
import type { TasksSummary } from "@/types/api";

export type ReportsWindowInput = {
  hours?: string;
  minutes?: string;
  seconds?: string;
};

function buildQuery(window?: ReportsWindowInput): string {
  const params = new URLSearchParams();

  if (window?.hours) params.set("hours", window.hours);
  if (window?.minutes) params.set("minutes", window.minutes);
  if (window?.seconds) params.set("seconds", window.seconds);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useReports() {
  const [summary, setSummary] = useState<TasksSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [appliedWindow, setAppliedWindow] = useState<ReportsWindowInput>({});

  const fetchSummary = useCallback(async (nextWindow?: ReportsWindowInput) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/reports${buildQuery(nextWindow)}`);

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(body?.error?.message || `Request failed with ${response.status}`);
      }

      const data = (await response.json()) as TasksSummary;
      setSummary(data);
      setAppliedWindow(nextWindow ?? {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the tasks summary right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    appliedWindow,
    fetchSummary,
  };
}
