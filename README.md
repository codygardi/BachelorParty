# Robbie’s Bachelor Quest

The party roster, weekend itinerary, and Saturday calling cards for Robbie Merchant’s bachelor party.

Run `node preview.mjs` with Node.js 22.13 or later and open `http://127.0.0.1:8000/`. Pass a different port as the first argument if needed. Ordinary previews and GitHub Pages use the same shared Cloudflare ballots and RSVP log.

For isolated ballot testing, set `BACHELOR_PARTY_PREVIEW_DB=:memory:` or a SQLite file path before starting the preview. The old local database in the system temporary directory is preserved; the preview no longer uses it by default.

Run `node --test` for database and ballot checks. On Windows with Chrome installed, `node scripts/check-saturday.mjs` checks the two plans in a hidden browser with an isolated database, including photos, reloads, failed saves, and responsive layouts. It saves review screenshots under `.venue-photo-review/two-plans/`.

The GitHub Pages site uses the shared ballot endpoint on the [Cloudflare Worker](cloudflare/README.md).

Saturday has a preferred-plan vote and independent venue ballots. The existing `bar`, `room`, and `dinner` fields belong to Taverns + drive; `walkBar`, `walkRoom`, and `walkDinner` belong to Walk in Arden. Browsing plans does not cast a vote. Transportation and comedy seating remain shared. Additive database migrations preserve existing votes.

The walking plan has three local bar options, two Enchambered rooms that accept eight, and the two existing dinners within walking distance of Punch Line. The four original dinner choices remain in the driving plan; Wildwood and Tapa explicitly require a further drive to the show.

Walking estimates were checked November 15, 2026 using ArcGIS address geocoding and the OpenStreetMap pedestrian router at routing.openstreetmap.de, with additional allowance for intersections. Approximate base times to Enchambered / Punch Line: Pete’s 6 / same plaza, Fieldhouse at its current 1833 Fulton address 20.9 / 24.4, Maple Room 20 / 23.5 minutes. Card ranges include a modest buffer; these are per-leg estimates, not guarantees or booked reservations.

Current venue and hours sources: [Pete’s](https://petesarden.com/), [Fieldhouse](https://www.fieldhousesac.com/), and [Maple Room](https://www.restaurantji.com/ca/sacramento/maple-room-lounge-/). Fieldhouse is an American sports pub with wooden bar tops and a full bar; these are local pub alternatives, not claimed exact Irish theme matches. The user chose three bars to retain the 30-minute walking limit: The Office was excluded at approximately 31.8 / 32.6 minutes. Original URLs for card photographs are recorded in `assets/venues/walk-bar-sources.json`.

Applebee’s and BJ’s are retired from the walking ballot. Their saved votes are preserved until the voter chooses again or clears the vote; no votes are reassigned to Fieldhouse. The API rejects new votes for retired options, and the UI prompts affected voters to choose again. Historical photo files remain available for already-open older cards.
