"use client";

import { useState } from "react";

type ActivityCreateFormProps = {
  onCreate: (action: string, info: string) => Promise<boolean>;
};

export function ActivityCreateForm({ onCreate }: ActivityCreateFormProps) {
  const [actionInput, setActionInput] = useState("");
  const [infoInput, setInfoInput] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const action = actionInput.trim();
    if (!action) {
      return;
    }

    setCreating(true);
    const success = await onCreate(action, infoInput.trim());
    setCreating(false);

    if (success) {
      setActionInput("");
      setInfoInput("");
    }
  }

  return (
    <form
      className="card"
      style={{ padding: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
      onSubmit={handleSubmit}
    >
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
  );
}