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
