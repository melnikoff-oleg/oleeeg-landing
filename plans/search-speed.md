# Search speed, 2026-08-27

Measured before touching anything. Every number here came from a run, not from
reading the code.

## What a search actually costs today

| what | measured |
|---|---|
| production search API, a query nobody has run | 2.0 - 6.4 s |
| production search API, the same query again (warm instance) | 0.24 s |
| production browse route (one plain read, no embedding) | 0.70 - 1.26 s |
| that same read, straight to Supabase from a machine near it | 0.22 s |
| OpenAI embedding call | 0.27 - 1.9 s |
| creator_search_match, inside Postgres | 277 ms warm / 831 ms cold |
| reel_library_match, inside Postgres | 83 ms warm / 936 ms cold |

## Where the time is, in order

1. THE FUNCTION AND THE DATABASE ARE ON OPPOSITE SIDES OF THE PLANET.
   `x-vercel-id: fra1::iad1::...` - the request enters in Frankfurt and the
   function runs in iad1, Washington DC. The Supabase project's region is
   `ap-south-1`, Mumbai. So every database call is Virginia to Mumbai and back,
   about 12,000 km each way, plus a TLS handshake on a cold instance. That is
   why a read that costs 220 ms direct costs 700-1,260 ms through the route,
   and it is the single largest item.

2. THE EMBEDDING IS SERIAL AND IT IS SOMEBODY ELSE'S SERVER. 270-1,900 ms,
   always before the database call, always paid, even for a query that has been
   asked a hundred times.

3. THE DATABASE IS COLD ON ALMOST EVERY SEARCH. `shared_buffers` is 256 MB.
   The search working set is `creator_facet` 343 MB + `creator_facet_probe`
   97 MB + `reel_search` 150 MB + `reel_search_probe` 22 MB = 612 MB, in a
   project shared with another app. So the probe work that measures 83-277 ms
   warm measures 831-936 ms in the state a real visitor finds it in. The probe
   rewrite of 2026-08-27 made the query cheap; it did not make it resident.

4. NOTHING IS PRIORITISED ON SCREEN. Every thumbnail on the wall is
   `loading="lazy"`, the first row included, so the browser defers the four
   pictures the visitor is actually waiting for. And the route buffers the whole
   answer: `time_starttransfer` equals `time_total` to the millisecond.

## The fix, in the order it is worth doing

A. Move the search functions to the database's region. One line per route.
B. Server-Timing on every search response, so the next person measures instead
   of guessing. This project has been wrong twice by reasoning about speed.
C. Cache the embedding permanently. An embedding of a given string under a
   given model never changes, so unlike the ranking it can be cached forever.
   Race the cache lookup against OpenAI so a miss costs the slower of the two
   rather than the sum.
D. Shrink the probe so the hot path fits in 256 MB, and stop rebuilding 384
   tsvectors on every keystroke.
E. Paint the first row first: eager and high priority for what is on screen,
   lazy for the rest, and never blank the grid while a new answer is coming.

## What it measures now

Same script, `npm run bench:search`, against production. The queries carry the
run's own minute so nothing is answered from a cache -- the first version of
this benchmark reused a fixed list and reported 186 ms, which was the cache
answering and not a search happening.

| | before | after |
|---|---|---|
| reels, median | 2,275 ms | 899 ms |
| reels, worst | 2,826 ms | 1,516 ms |
| creators, median | 2,235 ms | 1,277 ms |
| creators, worst | 5,845 ms | 2,127 ms |
| a query asked twice | 2,275 ms | 227 ms |
| a query typed and paused on | 2,275 ms | one request, usually finished |
| reel_library_match, in Postgres | 531 ms | 89 ms |
| creator_search_match, in Postgres | 277 ms | 200 ms |

Every number above includes the measuring machine's own trip to Frankfurt,
about 80-100 ms of each.

## What was tried and thrown away

Kept because each one looked obviously right and each one measured worse. This
project has been wrong about its own speed twice before by reasoning instead of
running something.

- ONE SCAN INSTEAD OF TWO on the creator probe. `near` and `cand` read the same
  36,465 rows one after the other; a window function gets the group minimum
  from the scan that computes the distance. 391 ms against 205 ms, and 365 MB
  of buffers against 342 MB. A window partitioned by (account, level) is a
  SORT; the two-pass version gets its minimum from a HashAggregate, which does
  not sort at all. The first attempt also left the 2 KB vector in the sort's
  input and spilled 13 MB to disk.
- A 256-DIMENSION CREATOR PROBE, to fit 97 MB of hot table into 21 MB. The band
  has to widen from 0.02 to 0.10 before the top twelve is right, and a wider
  band sends far more candidates into the expensive exact stage: 225 ms against
  200 ms, 650 MB of buffers against 342 MB, and 5 of 6 queries matching the
  control instead of 8 of 8. Worse on every axis at once.
- ONE STAGE FOR THE CREATORS, scoring the 1,024-dimension probe directly and
  skipping the exact rescore. 0 of 6 top-twelves matched the control and
  similarity drifted by up to 0.03. The creator rescore earns its cost.
- CARRYING THE BAND OUT OF THE AGGREGATE, in two parallel arrays, so the probe
  is scanned once and never looked up again through its primary key. Buffers do
  drop, 342 MB to 264 MB, and it is still slower: 306 ms against 200 ms, and it
  spills to disk building the arrays. That is the third rewrite of this one CTE
  to measure worse than the two-pass version. The pattern across all three is
  the same: cheap repeated reads of cached pages beat any structure that has to
  sort or accumulate 36,465 rows to avoid them.
- A SMALLER REEL SHORTLIST. 300 instead of 600 was checked against a 2,000-reel
  shortlist over six queries and missed on one. The existing `match_count * 5`
  is already the right size; it was the detoasting that was expensive, not the
  width.

## What is left, and it is not code

The creator search measures about 200 ms inside Postgres and 800 to 1,700 ms
from the function. The gap is not the network -- the function is in Mumbai with
the database now -- and it is not the query. It is that the search working set
does not fit in memory.

The Supabase project is on the `ci_micro` compute instance: 1 GB of RAM, which
gives Postgres a `shared_buffers` of 256 MB. The tables a search reads are
`creator_facet` 343 MB, `creator_facet_probe` 97 MB, `reel_exact` 64 MB and
`reel_search` 18 MB, and another app shares the same database. So the two
searches evict each other, and the same query that costs 200 ms warm costs 800
ms when the pages it needs went out to make room for the other page's.

This is exactly the trap reel_probe.sql was written about earlier the same day,
and it is now the ceiling. Every code-shaped fix for it has been tried and
measured: a smaller probe, one scan instead of two, one stage instead of two,
a shorter shortlist. All four are in the list above and all four were worse.

The remaining lever is the instance. Small is 2 GB and Medium is 4 GB, either of
which holds the whole working set, and both are a monthly bill rather than a
commit. That is a decision for Oleg, not a change to make.
