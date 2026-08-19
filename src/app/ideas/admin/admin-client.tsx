"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Idea, IdeaEvent, IdeaStatus } from "@/lib/ideas/db";

const STATUSES: IdeaStatus[] = ["live", "hidden", "planned", "filming", "published"];

const inputClass =
  "min-h-[44px] w-full rounded-xl border border-hairline bg-navy-raised px-4 py-3 font-body text-base text-silver placeholder:text-silver-muted/70 focus:border-vivid-blue/60 focus:outline-none";

async function call(body: Record<string, unknown>) {
  const res = await fetch("/api/ideas/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

export function AdminLogin() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        const { ok } = await call({ action: "login", secret });
        if (ok) router.refresh();
        else setError("nope.");
      }}
      className="surface-card mx-auto mt-20 max-w-sm p-6"
    >
      <label htmlFor="admin-secret" className="font-body text-base text-silver">
        admin
      </label>
      <input
        id="admin-secret"
        type="password"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className={`${inputClass} mt-3`}
      />
      <Button type="submit" className="mt-3 w-full">
        in
      </Button>
      {error ? <p className="mt-3 font-body text-base text-silver">{error}</p> : null}
    </form>
  );
}

function IdeaRow({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [status, setStatus] = useState<IdeaStatus>(idea.status);
  const [videoUrl, setVideoUrl] = useState(idea.video_url ?? "");
  const [busy, setBusy] = useState(false);

  const dirty = status !== idea.status || videoUrl !== (idea.video_url ?? "");

  return (
    <li className="surface-card p-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 rounded-lg border border-hairline px-2.5 py-1 font-body text-sm tabular-nums text-silver">
          {idea.votes_count}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-body text-base text-silver [overflow-wrap:anywhere]">
            {idea.title}
          </p>
          {idea.detail ? (
            <p className="mt-1 font-body text-sm text-silver-muted [overflow-wrap:anywhere]">
              {idea.detail}
            </p>
          ) : null}
          <p className="mt-1 font-body text-xs text-silver-muted">
            {idea.source} - {new Date(idea.created_at).toISOString().slice(0, 10)}
            {idea.author_name ? ` - ${idea.author_name}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as IdeaStatus)}
          aria-label="status"
          className={`${inputClass} sm:w-40`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {status === "published" ? (
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="youtube url"
            aria-label="video url"
            className={`${inputClass} sm:flex-1`}
          />
        ) : null}

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={!dirty || busy}
            className="min-h-[44px]"
            onClick={async () => {
              setBusy(true);
              await call({ action: "update", id: idea.id, status, video_url: videoUrl });
              setBusy(false);
              router.refresh();
            }}
          >
            save
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            className="min-h-[44px]"
            onClick={async () => {
              setBusy(true);
              await call({ action: "delete", id: idea.id });
              setBusy(false);
              router.refresh();
            }}
          >
            delete
          </Button>
        </div>
      </div>
    </li>
  );
}

export function AdminPanel({ ideas, events }: { ideas: Idea[]; events: IdeaEvent[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-2xl text-silver">ideas admin</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim()) return;
          await call({ action: "create", title, detail });
          setTitle("");
          setDetail("");
          router.refresh();
        }}
        className="surface-card mt-6 p-4"
      >
        <p className="font-body text-base text-silver">add one of your own titles</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
          className={`${inputClass} mt-3`}
        />
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="detail (optional)"
          className={`${inputClass} mt-2`}
        />
        <Button type="submit" className="mt-3 w-full sm:w-auto">
          add
        </Button>
      </form>

      <h2 className="mt-10 font-body text-base text-silver-muted">
        {ideas.length} ideas
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {ideas.map((idea) => (
          <IdeaRow key={idea.id} idea={idea} />
        ))}
      </ul>

      <h2 className="mt-10 font-body text-base text-silver-muted">recent activity</h2>
      <ul className="mt-4 flex flex-col gap-2">
        {events.map((e) => (
          <li
            key={e.id}
            className="rounded-xl border border-hairline px-4 py-3 font-body text-sm text-silver-muted [overflow-wrap:anywhere]"
          >
            <span className="text-silver">{e.kind}</span> - {e.ip ?? "no ip"} -{" "}
            {new Date(e.created_at).toISOString().replace("T", " ").slice(0, 16)}
            {e.payload ? (
              <span className="block text-xs">{JSON.stringify(e.payload)}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
