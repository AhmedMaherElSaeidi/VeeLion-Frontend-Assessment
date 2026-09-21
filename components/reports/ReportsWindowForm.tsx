"use client";

import { useState } from "react";
import type { ReportsWindowInput } from "@/hooks/useReports";

type ReportsWindowFormProps = {
  onApply: (window: ReportsWindowInput) => void;
  applying: boolean;
};

export function ReportsWindowForm({ onApply, applying }: ReportsWindowFormProps) {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onApply({
      hours: hours.trim() || undefined,
      minutes: minutes.trim() || undefined,
      seconds: seconds.trim() || undefined,
    });
  }

  function handleReset() {
    setHours("");
    setMinutes("");
    setSeconds("");
    onApply({});
  }

  return (
    <form
      className="card"
      style={{ padding: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "end" }}
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="window-hours" className="input-label">
          Hours
        </label>
        <input
          id="window-hours"
          className="input"
          type="number"
          min="0"
          placeholder="Hours"
          style={{ width: "6rem" }}
          value={hours}
          onChange={(event) => setHours(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="window-minutes" className="input-label">
          Minutes
        </label>
        <input
          id="window-minutes"
          className="input"
          type="number"
          min="0"
          placeholder="Minutes"
          style={{ width: "6rem" }}
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="window-seconds" className="input-label">
          Seconds
        </label>
        <input
          id="window-seconds"
          className="input"
          type="number"
          min="0"
          placeholder="Seconds"
          style={{ width: "6rem" }}
          value={seconds}
          onChange={(event) => setSeconds(event.target.value)}
        />
      </div>

      <button type="submit" className="button primary" disabled={applying}>
        {applying ? "Applying..." : "Apply window"}
      </button>

      <button type="button" className="button" onClick={handleReset} disabled={applying}>
        Reset to default (24h)
      </button>
    </form>
  );
}