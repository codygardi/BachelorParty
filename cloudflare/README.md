# Bachelor Party RSVP Cloudflare API

The live RSVP API is deployed at:

https://bachelor-party-rsvp.codygardi22.workers.dev

It stores RSVP status, weekend availability, notes, names, phone numbers, and timestamps in the `BachelorPartyRSVPs` KV namespace.

The website reads this URL from `bachelor-party-config.js`.

The Worker was deployed with:

- Worker name: `bachelor-party-rsvp`
- KV binding: `RSVPS`
- KV namespace: `BachelorPartyRSVPs`

Calling cards use the `CALLING_CARDS` SQLite Durable Object. The Worker stores one ballot per roster name, and updating a ballot replaces that member’s previous choices. The roster selector uses the group’s honor system.

With Cloudflare access to the existing Worker, run `npx wrangler deploy --config cloudflare/wrangler.toml` from the repository root. This applies the calling card migration and uses the existing RSVP KV namespace.
