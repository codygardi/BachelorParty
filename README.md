# Robbie’s Bachelor Quest

The party roster, weekend itinerary, and Saturday calling cards for Robbie Merchant’s bachelor party.

Run `node preview.mjs` with Node.js 22.13 or later and open `http://127.0.0.1:8000/`. Pass a different port as the first argument if needed. The preview keeps its ballots in a local SQLite database in the system temporary directory and reads the shared RSVP log from Cloudflare.

The GitHub Pages site uses the shared ballot endpoint on the [Cloudflare Worker](cloudflare/README.md).
