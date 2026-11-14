const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const sharedRsvpEndpoint = "https://bachelor-party-rsvp.codygardi22.workers.dev";

window.BACHELOR_PARTY_RSVP_CONFIG = {
  csvUrl: "",
  endpointUrl: sharedRsvpEndpoint,
  ballotEndpointUrl: isLocalPreview ? "/api/calling-cards" : sharedRsvpEndpoint,
};
