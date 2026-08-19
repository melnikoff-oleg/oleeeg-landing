-- /ideas board schema. Run once in the Supabase SQL editor.
--
-- Tables are prefixed `yt_` so they cannot collide with anything else living in
-- the same Supabase project. RLS is enabled with NO policies on purpose: the
-- site talks to these tables only through the service-role key from server-side
-- route handlers, so the anon key can read nothing even if it leaks.

create table if not exists yt_idea (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  detail       text,
  author_name  text,
  -- live | hidden | planned | filming | published
  status       text not null default 'live',
  video_url    text,
  -- visitor | oleg
  source       text not null default 'visitor',
  votes_count  int  not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists yt_idea_vote (
  idea_id    uuid not null references yt_idea(id) on delete cascade,
  voter_id   text not null,
  ip_hash    text not null,
  created_at timestamptz not null default now(),
  -- One vote per idea per browser, enforced by the database rather than by
  -- application code that could race with itself on two concurrent requests.
  primary key (idea_id, voter_id)
);

create table if not exists yt_idea_event (
  id         bigserial primary key,
  -- submit | submit_rejected | submit_duplicate | voted | unvoted | admin
  kind       text not null,
  idea_id    uuid,
  voter_id   text,
  ip         text,
  country    text,
  user_agent text,
  payload    jsonb,
  created_at timestamptz not null default now()
);

-- The per-IP daily caps count rows in this table, so this index is what keeps
-- the two write endpoints cheap as the log grows.
create index if not exists yt_idea_event_ip_created_idx
  on yt_idea_event (ip, created_at desc);

create index if not exists yt_idea_status_votes_idx
  on yt_idea (status, votes_count desc);

-- Keep the denormalized counter honest. Doing this in a trigger (rather than
-- reading a count on every render, or incrementing from the route handler)
-- means the number can never drift and two simultaneous votes cannot lose one
-- another.
create or replace function yt_idea_sync_votes() returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update yt_idea set votes_count = votes_count + 1 where id = new.idea_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update yt_idea set votes_count = greatest(votes_count - 1, 0) where id = old.idea_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists yt_idea_vote_sync on yt_idea_vote;
create trigger yt_idea_vote_sync
  after insert or delete on yt_idea_vote
  for each row execute function yt_idea_sync_votes();

alter table yt_idea       enable row level security;
alter table yt_idea_vote  enable row level security;
alter table yt_idea_event enable row level security;
