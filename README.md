# Robbie’s Bachelor Quest

The party roster, weekend itinerary, and Saturday calling cards for Robbie Merchant’s bachelor party.

Run `node preview.mjs` with Node.js 22.13 or later and open `http://127.0.0.1:8000/`. Pass a different port as the first argument if needed. Ordinary previews and GitHub Pages use the same shared Cloudflare ballots and RSVP log.

For isolated ballot testing, set `BACHELOR_PARTY_PREVIEW_DB=:memory:` or a SQLite file path before starting the preview. The old local database in the system temporary directory is preserved; the preview no longer uses it by default.

Run `node --test` for database and ballot checks. On Windows with Chrome installed, `node scripts/check-saturday.mjs` checks the two plans in a hidden browser with an isolated database, including photos, reloads, failed saves, and responsive layouts. It saves review screenshots under `.venue-photo-review/two-plans/`.

The GitHub Pages site uses the shared ballot endpoint on the [Cloudflare Worker](cloudflare/README.md).

Saturday has a preferred-plan vote and independent venue ballots. The existing `bar`, `room`, and `dinner` fields belong to Taverns + drive; `walkBar`, `walkRoom`, and `walkDinner` belong to Walk in Arden. Browsing plans does not cast a vote. Transportation and comedy seating remain shared. Additive database migrations preserve existing votes.

The walking plan has four bar options, two Enchambered rooms that accept eight, and the two existing dinners within walking distance of Punch Line. The four original dinner choices remain in the driving plan; Wildwood and Tapa explicitly require a further drive to the show.

Walking estimates were checked November 15, 2026 using ArcGIS address geocoding and the OpenStreetMap pedestrian router at routing.openstreetmap.de, with additional allowance for intersections. Approximate base times to Enchambered / Punch Line: Pete’s 6 / same plaza, BJ’s Arden Fair 23.5 / 20.5, Maple Room 20 / 23.5, Applebee’s Arden 8.2 / 5.2 minutes. Card ranges include a modest buffer; these are per-leg estimates, not guarantees or booked reservations.

Current venue and hours sources: [Pete’s](https://petesarden.com/), [BJ’s Arden Fair](https://www.bjsrestaurants.com/locations/ca/arden-fair), [Arden Fair directory](https://www.ardenfair.com/dining), [Maple Room](https://www.restaurantji.com/ca/sacramento/maple-room-lounge-/), and [Applebee’s Arden](https://restaurants.applebees.com/en-us/ca/sacramento/2024-arden-way-76065). All four are alternatives to an Irish or rustic whiskey pub, not claimed exact theme matches. Original URLs for the new card photographs are recorded in `assets/venues/walk-bar-sources.json`.
