# Bachelor Party RSVP Cloudflare API

The live RSVP API is deployed at:

https://bachelor-party-rsvp.codygardi22.workers.dev

It stores RSVP status, weekend availability, notes, names, phone numbers, and timestamps in the `BachelorPartyRSVPs` KV namespace.

The website reads this URL from `bachelor-party-config.js`.

The Worker was deployed with:

- Worker name: `bachelor-party-rsvp`
- KV binding: `RSVPS`
- KV namespace: `BachelorPartyRSVPs`

Use `wrangler.toml.example` as the config shape if you later deploy from the command line.
