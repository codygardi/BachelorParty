# Robbie’s Bachelor Quest

The party roster, weekend itinerary, and Saturday calling cards for Robbie Merchant’s bachelor party.

Run `node preview.mjs` with Node.js 22.13 or later and open `http://127.0.0.1:8000/`. Pass a different port as the first argument if needed. Ordinary previews and GitHub Pages use the same shared Cloudflare ballots and RSVP log.

For isolated ballot testing, set `BACHELOR_PARTY_PREVIEW_DB=:memory:` or a SQLite file path before starting the preview. The old local database in the system temporary directory is preserved; the preview no longer uses it by default.

Run `node --test` for database and ballot checks. On Windows with Chrome installed, `node scripts/check-saturday.mjs` checks the Saturday ballots in a hidden browser with an isolated database. It saves review screenshots under `.venue-photo-review/saturday/`.

The GitHub Pages site uses the shared ballot endpoint on the [Cloudflare Worker](cloudflare/README.md).

Saturday has one set of venue ballots for the bar, escape room location, and dinner. Both Enchambered rooms are listed on its location card.

The final plan vote requires a ride request or car offer, plus votes for breakfast, the bar, escape room location, dinner, and comedy seating. Car offers require a passenger count excluding the driver. The Worker checks completion when a plan vote is submitted. Changing or clearing a choice reopens that vote for submission.

The Worker carries forward eligible votes from the former plans. If someone saved two eligible votes for the same stop, it uses the vote from their preferred plan, or the drive vote if they never picked a plan. Skull Witch and The Collection map to Enchambered. Pirates of Tortuga maps to PanIQ. A removed choice prompts the voter to choose again. Saving or clearing a venue replaces both prior choices for that stop.

November 15, 2026 travel estimates use OpenStreetMap pedestrian and driving routes, rounded to allow for intersections and parking. The escape location cards link to directions from each bar.
