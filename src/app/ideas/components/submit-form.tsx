"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DETAIL_MAX, NAME_MAX, TITLE_MAX, TITLE_MIN } from "@/lib/ideas/limits";
import type { Idea } from "@/lib/ideas/db";

type Outcome =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "published" }
  | { kind: "held" }
  | { kind: "rejected"; reason: string }
  | { kind: "error"; message: string };

export function SubmitForm({
  onPublished,
  onDuplicate,
}: {
  onPublished: (idea: Idea) => void;
  onDuplicate: (ideaId: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [name, setName] = useState("");
  const [outcome, setOutcome] = useState<Outcome>({ kind: "idle" });

  const tooShort = title.trim().length > 0 && title.trim().length < TITLE_MIN;
  const canSend = title.trim().length >= TITLE_MIN && outcome.kind !== "checking";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setOutcome({ kind: "checking" });

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), detail: detail.trim(), name: name.trim() }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setOutcome({
          kind: "error",
          message: "That is a few ideas for one day. Come back tomorrow.",
        });
        return;
      }
      if (!res.ok) {
        setOutcome({
          kind: "error",
          message: "Something broke on my side. Try again in a minute.",
        });
        return;
      }

      if (data.status === "rejected") {
        setOutcome({ kind: "rejected", reason: data.reason || "That one does not fit here." });
        return;
      }
      if (data.status === "duplicate") {
        setTitle("");
        setDetail("");
        setOutcome({ kind: "idle" });
        onDuplicate(data.ideaId);
        return;
      }
      if (data.status === "held") {
        setTitle("");
        setDetail("");
        setOutcome({ kind: "held" });
        return;
      }

      setTitle("");
      setDetail("");
      setOutcome({ kind: "published" });
      onPublished(data.idea as Idea);
    } catch {
      setOutcome({
        kind: "error",
        message: "Could not reach the server. Check your connection and try again.",
      });
    }
  }

  return (
    <form onSubmit={submit} className="surface-card p-5 sm:p-6">
      <label htmlFor="idea-title" className="block font-body text-base text-silver">
        What should I build or explain next?
      </label>

      <input
        id="idea-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={TITLE_MAX}
        placeholder="Claude Code that writes my newsletter"
        /* text-base is load bearing: under 16px iOS Safari zooms the page on focus */
        className="mt-3 min-h-[44px] w-full rounded-xl border border-hairline bg-navy-raised px-4 py-3 font-body text-base text-silver placeholder:text-silver-muted/70 focus:border-vivid-blue/60 focus:outline-none"
      />

      <textarea
        id="idea-detail"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        maxLength={DETAIL_MAX}
        rows={3}
        placeholder="Anything else about it (optional)"
        /* resize-none: the drag grabber renders outside the rounded corner and is
           useless on a phone anyway, which is where most of this traffic is */
        className="mt-2.5 w-full resize-none rounded-xl border border-hairline bg-navy-raised px-4 py-3 font-body text-base text-silver placeholder:text-silver-muted/70 focus:border-vivid-blue/60 focus:outline-none"
      />

      <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <input
          id="idea-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={NAME_MAX}
          placeholder="Your name (optional)"
          className="min-h-[44px] w-full rounded-xl border border-hairline bg-navy-raised px-4 py-3 font-body text-base text-silver placeholder:text-silver-muted/70 focus:border-vivid-blue/60 focus:outline-none sm:flex-1"
        />
        <Button type="submit" size="md" disabled={!canSend} className="w-full min-h-[44px] sm:w-auto">
          {outcome.kind === "checking" ? "Checking your idea" : "Add it to the board"}
        </Button>
      </div>

      {tooShort ? (
        <p className="mt-3 font-body text-sm text-silver-muted">
          A few more words, so people know what they are voting for.
        </p>
      ) : null}

      {outcome.kind === "published" ? (
        <p className="mt-3 font-body text-base text-vivid-blue">
          It is on the board, with your vote on it.
        </p>
      ) : null}

      {outcome.kind === "held" ? (
        <p className="mt-3 font-body text-base text-silver">
          Got it. This one needs a quick look from me, it will show up shortly.
        </p>
      ) : null}

      {outcome.kind === "rejected" ? (
        <p className="mt-3 font-body text-base text-silver [overflow-wrap:anywhere]">
          {outcome.reason}
        </p>
      ) : null}

      {outcome.kind === "error" ? (
        <p className="mt-3 font-body text-base text-silver">{outcome.message}</p>
      ) : null}
    </form>
  );
}
