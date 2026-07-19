const STORAGE_KEY = "bachelor-party-rsvp-responses-v1";
const defaultPersistenceConfig = {
  csvUrl: "",
  endpointUrl: "/api/rsvps",
};
const persistenceConfig = {
  ...defaultPersistenceConfig,
  ...(window.BACHELOR_PARTY_RSVP_CONFIG || {}),
};
const csvStoreUrl = String(persistenceConfig.csvUrl || "").trim();
const remoteStoreUrl = String(persistenceConfig.endpointUrl || "").trim();
const sharedRefreshIntervalMs = 60000;

const invitees = [
  { id: "max-voorhees", name: "Max Voorhees", phone: "5302103099" },
  { id: "thomas-correll", name: "Thomas Correll", phone: "5302637719" },
  { id: "jonno-christie", name: "Jonno Christie", phone: "8053414024" },
  { id: "lane-carleson", name: "Lane Carlson", phone: "5309136251" },
  { id: "sean-fitzhenry", name: "Sean Fitzhenry", phone: "5305598103" },
  { id: "andrew-kostolefsky", name: "Andrew Kostolefsky", phone: "5305595048" },
  { id: "cody-gardi", name: "Cody Gardi", phone: "9253938441" },
];

const rsvpStatuses = [
  "Yes, I am in",
  "No, I cannot make it",
];
const yesStatus = "Yes, I am in";
const noStatus = "No, I cannot make it";
const legacyNoStatus = "Sorry, I cannot make it";
const unavailableWeekend = "None of these weekends work for me";
const plannerAccessPassword = "archie";
const expectedRsvpCount = 7;

const weekendOptions = [
  {
    value: "Weekend of Jan 9: Friday afternoon Jan 8 + Saturday Jan 9",
    label: "Jan 8-9",
    detail: "Friday afternoon + Saturday",
    summary: "Jan 8-9",
  },
  {
    value: "Weekend of Jan 16: Friday afternoon Jan 15 + Saturday Jan 16",
    label: "Jan 15-16",
    detail: "Friday afternoon + Saturday",
    summary: "Jan 15-16",
  },
  {
    value: "Weekend of Jan 23: Friday afternoon Jan 22 + Saturday Jan 23",
    label: "Jan 22-23",
    detail: "Friday afternoon + Saturday",
    summary: "Jan 22-23",
  },
  {
    value: unavailableWeekend,
    label: "None of these",
    detail: "No listed weekend works",
    summary: "None",
  },
];

// Trip details live here so updates do not affect saved RSVP records.
const detailNotice = "Finalizing details with Robbie.";
const tripDetails = [
  {
    eyebrow: "Base camp",
    title: "Grass Valley, CA",
    body: "Weekend headquarters",
    kind: "travel",
    linkLabel: "Open in Google Maps",
    linkUrl: "https://www.google.com/maps/search/?api=1&query=Grass%20Valley%2C%20CA",
  },
  {
    eyebrow: "Arrival route",
    title: "Fly into Sacramento",
    body: "Sacramento International Airport (SMF)",
    kind: "travel",
    linkLabel: "Open Google Flights",
    linkUrl: "https://www.google.com/travel/flights?q=Flights%20to%20Sacramento%20International%20Airport%20SMF",
  },
  {
    eyebrow: "Weekend plan",
    title: "Itinerary",
    body: detailNotice,
    kind: "itinerary",
    gated: true,
    gatedBody: {
      days: [
        {
          day: "Friday",
          label: "Arrival & kickoff",
          items: [
            {
              title: "Meet at base camp",
              detail: "Grass Valley · settle in and get the party together",
            },
            {
              title: "Grass Valley Brewing Co.",
              detail: "141 E Main St, Grass Valley · dinner and first round",
              price: "Food $6–$29 pp · ALC.* +$2.84–$9.46 pp",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=Grass%20Valley%20Brewing%20Co%20141%20E%20Main%20St%20Grass%20Valley%20CA",
                },
                {
                  label: "Menu",
                  url: "https://www.toasttab.com/local/order/grass-valley-brewing-comp-141-east-main-street",
                },
              ],
            },
            {
              title: "Games and D&D",
              detail: "Back at base camp · launch the weekend campaign",
            },
          ],
        },
        {
          day: "Saturday",
          label: "Central Sacramento loop",
          items: [
            {
              title: "The Morning Fork",
              detail: "1111 21st St · breakfast before the main quest",
              price: "Food $4.50–$27 pp · ALC.* +$5–$12 pp",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=The%20Morning%20Fork%201111%2021st%20St%20Sacramento%20CA",
                },
                {
                  label: "Menu",
                  url: "https://www.themorningfork.com/wp-content/uploads/2025/06/The-Morning-Fork-Menu.pdf",
                },
              ],
            },
            {
              title: "Smash Sacramento",
              detail: "600 Broadway, Suite D · one hour of axe throwing",
              price: "$20 pp · $160 for 8",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=Smash%20Sacramento%20600%20Broadway%20Suite%20D%20Sacramento%20CA",
                },
                { label: "Book", url: "https://www.smashsacramento.com/downtown-sacramento-location" },
              ],
            },
            {
              title: "Escape Sacramento",
              detail: "1831 I St · private escape-room challenge",
              price: "$37.50 pp at 8 · $300 total",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=Escape%20Sacramento%201831%20I%20St%20Sacramento%20CA",
                },
                { label: "Tickets", url: "https://escapesacramento.com/tickets/" },
              ],
            },
            {
              title: "LowBrau",
              detail: "1050 20th St · dinner next door to the comedy show",
              price: "Entrées $12–$21 pp · ALC.* est. +$6–$16 pp",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=LowBrau%201050%2020th%20St%20Sacramento%20CA",
                },
                { label: "Menu", url: "https://order.toasttab.com/online/lowbrau-sacramento" },
              ],
            },
            {
              title: "Sacramento Comedy Spot",
              detail: "1050 20th St, Suite 130 · Saturday 9pm ACL show",
              price: "$12 pp · $96 for 8 · ALC.* est. +$6–$10 pp",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=Sacramento%20Comedy%20Spot%201050%2020th%20St%20Suite%20130%20Sacramento%20CA",
                },
                { label: "Tickets", url: "https://www.showclix.com/event/anti-cooperation-league" },
              ],
            },
            {
              title: "Optional: Oishii karaoke",
              detail: "1000 K St, Suite 200 · one private room fits all 8",
              price: "$53.09 total for 1 hour after required 18% fee",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=Oishii%20Sushi%20Karaoke%201000%20K%20St%20Suite%20200%20Sacramento%20CA",
                },
                { label: "Menu", url: "https://www.oishiikaraokesac.com/menu" },
                { label: "Reserve", url: "https://www.oishiikaraokesac.com/" },
              ],
            },
            {
              title: "Optional: Blue Cue billiards",
              detail: "1004 28th St · Midtown pool by the table-hour",
              price: "$10–$20 per table-hour · nightly cover may apply",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=Blue%20Cue%201004%2028th%20St%20Sacramento%20CA",
                },
                { label: "Rates", url: "https://www.bluecue.com/billiards" },
              ],
            },
            {
              title: "Return to Grass Valley",
              detail: "Games and a possible D&D finale at base camp",
            },
          ],
        },
      ],
      prep: [
        {
          title: "Estimated cost",
          kind: "costs",
          intro: "Current published base prices. Taxes, travel, and unlisted service charges are excluded.",
          items: [
            {
              title: "GV Brewing · food",
              onePerson: [6, 29],
              eightPeople: [48, 232],
              detail: "Full menu $5–$80; adult individual items $6–$29.",
              sourceLabel: "Menu",
              sourceUrl: "https://www.toasttab.com/local/order/grass-valley-brewing-comp-141-east-main-street",
              alcohol: { onePerson: [2.84, 9.46], eightPeople: [22.72, 75.68] },
            },
            {
              title: "Morning Fork · food",
              onePerson: [4.5, 27],
              eightPeople: [42.48, 254.88],
              detail: "Menu $4.50–$27. The 8-person range includes the required 18% gratuity for parties of 6+.",
              sourceLabel: "Menu PDF",
              sourceUrl: "https://www.themorningfork.com/wp-content/uploads/2025/06/The-Morning-Fork-Menu.pdf",
              alcohol: { onePerson: [5, 12], eightPeople: [40, 96] },
            },
            {
              title: "Smash · 1 hour",
              onePerson: [20, 20],
              eightPeople: [160, 160],
              detail: "Published at $20 per person; closed-toe shoes required.",
              sourceLabel: "Rates",
              sourceUrl: "https://www.smashsacramento.com/downtown-sacramento-location",
            },
            {
              title: "Escape Sacramento",
              onePerson: null,
              onePersonLabel: "N/A · 2 min.",
              eightPeople: [300, 300],
              detail: "Eight players are $37.50 each. The smallest booking is 2 players at $90 total.",
              sourceLabel: "Pricing",
              sourceUrl: "https://escapesacramento.com/about/",
            },
            {
              title: "LowBrau · food",
              onePerson: [12, 21],
              eightPeople: [96, 168],
              detail: "Full menu $3–$75; a typical single entrée is $12–$21.",
              sourceLabel: "Menu",
              sourceUrl: "https://order.toasttab.com/online/lowbrau-sacramento",
              alcohol: { onePerson: [6, 16], eightPeople: [48, 128], estimated: true },
            },
            {
              title: "Comedy Spot · ACL",
              onePerson: [12, 12],
              eightPeople: [96, 96],
              detail: "Saturday 9pm admission. An 8pm + 9pm combo is $15 per person.",
              sourceLabel: "Tickets",
              sourceUrl: "https://www.showclix.com/event/anti-cooperation-league",
              alcohol: { onePerson: [6, 10], eightPeople: [48, 80], estimated: true },
            },
            {
              title: "Optional · Oishii karaoke",
              onePerson: [53.09, 53.09],
              eightPeople: [53.09, 53.09],
              detail: "One-hour small room (max 8): $44.99 + required 18% system/cleaning fee. Food menu $5.50–$85.",
              sourceLabel: "Rates + menu",
              sourceUrl: "https://www.oishiikaraokesac.com/",
              optional: true,
              alcohol: { onePerson: [8, 16], eightPeople: [64, 128], estimated: true },
            },
            {
              title: "Optional · Blue Cue pool",
              onePerson: [10, 20],
              eightPeople: [10, 20],
              onePersonSuffix: " / table hr",
              eightPeopleSuffix: " / table hr",
              detail: "$10 from 6–8pm; $15 after 8pm Sun–Thu; $20 after 8pm Fri–Sat. Nightly cover is extra and unpublished.",
              sourceLabel: "Rates",
              sourceUrl: "https://www.bluecue.com/billiards",
              optional: true,
              alcohol: { onePerson: [6, 12], eightPeople: [48, 96], estimated: true },
            },
          ],
          totalLabel: "Core plan subtotal",
          totalNote: "Solo subtotal excludes Escape Sacramento because it does not sell 1-player tickets. The 8-person total includes Morning Fork's 18% group gratuity.",
          footnote: "ALC.* = optional alcohol. Exact where published; ‘est.’ marks venues that do not publish drink prices. ALC.* ranges assume one drink at each alcohol-serving core stop and are not included in the core subtotal.",
        },
        {
          title: "What to bring",
          kind: "checklist",
          groups: [
            {
              title: "Essentials",
              items: [
                "Weekend clothes + overnight bag",
                "Toiletries + medications",
                "Valid photo ID",
                "Phone charger",
              ],
            },
            {
              title: "Activity ready",
              items: [
                "Closed-toe walking shoes for axe throwing",
                "Light layer for the evening",
                "D&D dice or character materials",
                "Reusable water bottle",
              ],
            },
          ],
        },
      ],
    },
  },
];

const elements = {
  rsvpPage: document.querySelector("[data-rsvp-page]"),
  rsvpPanel: document.querySelector("[data-roll-call]"),
  rollCallToggle: document.querySelector("[data-roll-call] [data-collapse-toggle]"),
  detailsPage: document.querySelector("[data-details-page]"),
  backToRsvp: document.querySelector("[data-back-to-rsvp]"),
  alreadyDidThis: document.querySelector("[data-already-did-this]"),
  form: document.querySelector("[data-rsvp-form]"),
  inviteeSelect: document.querySelector("[data-invitee-select]"),
  phoneCard: document.querySelector("[data-phone-card]"),
  phoneDisplay: document.querySelector("[data-phone-display]"),
  statusOptions: document.querySelector("[data-status-options]"),
  availabilityOptions: document.querySelector("[data-availability-options]"),
  notes: document.querySelector("[data-notes]"),
  statusMessage: document.querySelector("[data-status-message]"),
  submitRsvp: document.querySelector("[data-submit-rsvp]"),
  tripDetails: document.querySelector("[data-trip-details]"),
  responseList: document.querySelector("[data-response-list]"),
  overlapSummary: document.querySelector("[data-overlap-summary]"),
  overlapList: document.querySelector("[data-overlap-list]"),
  resetForm: document.querySelector("[data-reset-form]"),
  resetPassword: document.querySelector("[data-reset-password]"),
  resetMessage: document.querySelector("[data-reset-message]"),
};

let responses = {};
let plannerAccessGranted = false;
let sharedRefreshTimer = 0;
let isRefreshingSharedResponses = false;
let isSavingRsvp = false;

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function getInviteeById(id) {
  return invitees.find((invitee) => invitee.id === id) || null;
}

function setStatus(message, type = "loading") {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message is-${type}`;
  elements.statusMessage.hidden = type === "loading";
}

function normalizeAvailability(availability) {
  if (!availability.includes(unavailableWeekend) || availability.length === 1) {
    return availability;
  }

  return availability.filter((weekend) => weekend !== unavailableWeekend);
}

function normalizeStatus(status) {
  if (status === yesStatus || status === noStatus) {
    return status;
  }

  return status === legacyNoStatus ? noStatus : "";
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      if (inQuotes && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
      row.push(field);
      if (row.some((value) => value.trim())) {
        rows.push(row);
      }
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim())) {
    rows.push(row);
  }

  return rows;
}

function parseAvailabilityValue(value) {
  if (Array.isArray(value)) {
    return normalizeAvailability(value.map(String).map((item) => item.trim()).filter(Boolean));
  }

  return normalizeAvailability(
    String(value || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function normalizeStoredResponse(record) {
  const invitee = getInviteeById(record.inviteeId);
  const status = normalizeStatus(record.status);
  const availability = parseAvailabilityValue(record.availability);

  if (!invitee || !status || !availability.length) {
    return null;
  }

  const submittedAt = record.submittedAt || record.updatedAt || new Date().toISOString();
  const updatedAt = record.updatedAt || submittedAt;

  return {
    inviteeId: invitee.id,
    name: invitee.name,
    phone: invitee.phone,
    status,
    availability,
    notes: record.notes || "",
    submittedAt,
    updatedAt,
  };
}

function createResponseCollection(records) {
  return records.reduce((collection, record) => {
    const response = normalizeStoredResponse(record);
    if (response) {
      collection[response.inviteeId] = response;
    }
    return collection;
  }, {});
}

function responsesFromCsv(text) {
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return {};
  }

  const headers = rows[0].map((header) => header.trim());
  const records = rows.slice(1).map((row) =>
    headers.reduce((record, header, index) => {
      record[header] = row[index] || "";
      return record;
    }, {}),
  );

  return createResponseCollection(records);
}

function responsesFromPayload(payload) {
  if (Array.isArray(payload)) {
    return createResponseCollection(payload);
  }

  if (Array.isArray(payload?.responses)) {
    return createResponseCollection(payload.responses);
  }

  return {};
}

function getTimestamp(response) {
  return Date.parse(response.updatedAt || response.submittedAt || "") || 0;
}

function mergeResponses(nextResponses) {
  Object.values(nextResponses).forEach((nextResponse) => {
    const existingResponse = responses[nextResponse.inviteeId];

    if (!existingResponse || getTimestamp(nextResponse) >= getTimestamp(existingResponse)) {
      responses[nextResponse.inviteeId] = nextResponse;
    }
  });
}

function readLocalResponses() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return createResponseCollection(Object.values(parsed));
  } catch (error) {
    return {};
  }
}

function saveLocalResponses() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
}

function buildRemoteUrl(action) {
  const url = new URL(remoteStoreUrl, window.location.href);
  url.searchParams.set("action", action);
  url.searchParams.set("cache", Date.now().toString());
  return url.toString();
}

function responseToRemoteRecord(response) {
  return {
    ...response,
    availability: response.availability.join("|"),
  };
}

async function readTextResponse(response) {
  const text = await response.text();
  const trimmedText = text.trim();

  if (!trimmedText) {
    return {};
  }

  if (trimmedText.startsWith("{") || trimmedText.startsWith("[")) {
    return responsesFromPayload(JSON.parse(trimmedText));
  }

  return responsesFromCsv(text);
}

async function fetchCsvResponses() {
  if (!csvStoreUrl) {
    return {};
  }

  const url = new URL(csvStoreUrl, window.location.href);
  url.searchParams.set("cache", Date.now().toString());
  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    return {};
  }

  return responsesFromCsv(await response.text());
}

async function fetchRemoteResponses() {
  if (!remoteStoreUrl) {
    return {};
  }

  const response = await fetch(buildRemoteUrl("list"), { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Shared RSVP log could not be loaded.");
  }

  return readTextResponse(response);
}

async function refreshSharedResponses() {
  if (isRefreshingSharedResponses) {
    return;
  }

  isRefreshingSharedResponses = true;

  try {
    mergeResponses(await fetchCsvResponses());
  } catch (error) {
    // The static CSV is only a shared seed; local saves can still render the page.
  }

  try {
    if (remoteStoreUrl) {
      mergeResponses(await fetchRemoteResponses());
    }

    saveLocalResponses();
  } finally {
    isRefreshingSharedResponses = false;
  }
}

async function loadResponses() {
  responses = readLocalResponses();

  try {
    await refreshSharedResponses();
  } catch (error) {
    setStatus("Shared RSVPs could not be loaded. Showing saved browser entries for now.", "error");
  }
}

async function writeRemoteResponse(response) {
  if (!remoteStoreUrl) {
    return;
  }

  const saveResponse = await fetch(remoteStoreUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "upsert",
      response: responseToRemoteRecord(response),
    }),
  });

  if (!saveResponse.ok) {
    throw new Error("Shared RSVP log could not be updated.");
  }
}

async function persistResponse(response) {
  responses[response.inviteeId] = response;
  saveLocalResponses();

  await writeRemoteResponse(response);

  if (remoteStoreUrl) {
    await refreshSharedResponses();
  }
}

async function syncVisibleSharedResponses({ showError = false } = {}) {
  if (!remoteStoreUrl) {
    return;
  }

  try {
    await refreshSharedResponses();

    if (!elements.detailsPage.hidden) {
      renderDetailsPage();
    }

    if (!elements.rsvpPage.hidden) {
      updateInviteeState();
    }

    updateRollCallState();
  } catch (error) {
    if (showError) {
      setStatus("Shared RSVPs could not be refreshed. Showing saved browser entries for now.", "error");
    }
  }
}

function startSharedPolling() {
  if (!remoteStoreUrl || sharedRefreshTimer) {
    return;
  }

  sharedRefreshTimer = window.setInterval(() => {
    if (!document.hidden) {
      syncVisibleSharedResponses();
    }
  }, sharedRefreshIntervalMs);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      syncVisibleSharedResponses();
    }
  });
}

function setResetMessage(message, type = "neutral") {
  elements.resetMessage.textContent = message;
  elements.resetMessage.dataset.state = type;
}

function setCollapsibleExpanded(panel, expanded) {
  const toggle = panel.querySelector("[data-collapse-toggle]");
  const content = panel.querySelector("[data-collapsible-content]");

  if (!toggle || !content) {
    return;
  }

  toggle.setAttribute("aria-expanded", String(expanded));
  content.hidden = !expanded;
  panel.classList.toggle("is-collapsed", !expanded);
}

function initializeCollapsibles() {
  document.querySelectorAll("[data-collapsible]").forEach((panel) => {
    const toggle = panel.querySelector("[data-collapse-toggle]");

    if (!toggle) {
      return;
    }

    setCollapsibleExpanded(panel, toggle.getAttribute("aria-expanded") !== "false");
    toggle.addEventListener("click", () => {
      if (toggle.disabled) {
        return;
      }

      setCollapsibleExpanded(panel, toggle.getAttribute("aria-expanded") !== "true");
    });
  });
}

function createOption(type, name, value, label, detail = "") {
  const optionLabel = document.createElement("label");
  optionLabel.className = "option-card";

  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.value = value;
  input.required = type === "radio";

  const text = document.createElement("span");
  text.className = "option-text";
  text.textContent = label;

  if (detail) {
    const detailText = document.createElement("small");
    detailText.textContent = detail;
    text.appendChild(detailText);
  }

  optionLabel.append(input, text);
  return optionLabel;
}

function renderInviteeOptions() {
  invitees.forEach((invitee) => {
    const option = document.createElement("option");
    option.value = invitee.id;
    option.textContent = invitee.name;
    elements.inviteeSelect.appendChild(option);
  });
}

function renderChoices() {
  rsvpStatuses.forEach((status) => {
    elements.statusOptions.appendChild(createOption("radio", "rsvp-status", status, status));
  });

  weekendOptions.forEach((weekend) => {
    elements.availabilityOptions.appendChild(
      createOption("checkbox", "availability", weekend.value, weekend.label, weekend.detail),
    );
  });
}

function createOutboundLink(linkData, className) {
  const link = document.createElement("a");
  link.href = linkData.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = className;
  link.textContent = linkData.label;
  return link;
}

function formatPrice(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function formatCostRange(range) {
  if (!range) {
    return "N/A";
  }

  return range[0] === range[1]
    ? formatPrice(range[0])
    : `${formatPrice(range[0])}–${formatPrice(range[1])}`;
}

function sumCostRanges(items, field) {
  return items.reduce(
    (total, item) => {
      const range = item[field];
      if (range) {
        total[0] += range[0];
        total[1] += range[1];
      }
      return total;
    },
    [0, 0],
  );
}

function createItineraryItem(itemData) {
  const marker = document.createElement("span");
  const item = document.createElement("li");
  const copy = document.createElement("div");

  marker.className = "itinerary-marker";
  marker.setAttribute("aria-hidden", "true");
  copy.className = "itinerary-event";

  if (typeof itemData === "string") {
    copy.textContent = itemData;
  } else {
    const title = document.createElement("strong");
    title.textContent = itemData.title;
    copy.appendChild(title);

    if (itemData.detail) {
      const detail = document.createElement("span");
      detail.className = "itinerary-event-detail";
      detail.textContent = itemData.detail;
      copy.appendChild(detail);
    }

    if (itemData.price) {
      const price = document.createElement("span");
      price.className = "itinerary-event-price";
      price.textContent = itemData.price;
      copy.appendChild(price);
    }

    if (itemData.links?.length) {
      const links = document.createElement("span");
      links.className = "itinerary-event-links";
      itemData.links.forEach((linkData) => {
        links.appendChild(createOutboundLink(linkData, "itinerary-event-link"));
      });
      copy.appendChild(links);
    }
  }

  item.append(marker, copy);
  return item;
}

function createCostCell(label, range, fallback = "N/A", suffix = "") {
  const cell = document.createElement("div");
  const caption = document.createElement("span");
  const value = document.createElement("strong");

  cell.className = "cost-value";
  caption.textContent = label;
  value.textContent = `${range ? formatCostRange(range) : fallback}${suffix}`;
  cell.append(caption, value);
  return cell;
}

function createAlcoholLine(alcohol) {
  const line = document.createElement("p");
  const label = document.createElement("strong");
  const onePerson = document.createElement("em");
  const eightPeople = document.createElement("em");

  line.className = "cost-alcohol";
  label.textContent = "ALC.*";
  onePerson.textContent = `+${formatCostRange(alcohol.onePerson)}`;
  eightPeople.textContent = `+${formatCostRange(alcohol.eightPeople)}`;
  line.append(
    label,
    " ",
    onePerson,
    " pp · ",
    eightPeople,
    " / 8",
    alcohol.estimated ? " · est." : "",
  );
  return line;
}

function createCostBreakdown(prepItem) {
  const wrapper = document.createElement("div");
  const intro = document.createElement("p");
  const header = document.createElement("div");
  const coreItems = prepItem.items.filter((item) => !item.optional);

  wrapper.className = "cost-breakdown";
  intro.className = "cost-intro";
  intro.textContent = prepItem.intro;
  header.className = "cost-header";
  header.innerHTML = "<span>Event</span><span>1 person</span><span>8 people</span>";
  wrapper.append(intro, header);

  prepItem.items.forEach((costItem) => {
    const row = document.createElement("article");
    const event = document.createElement("div");
    const titleRow = document.createElement("div");
    const title = document.createElement("strong");
    const detail = document.createElement("small");

    row.className = "cost-row";
    event.className = "cost-event";
    titleRow.className = "cost-title-row";
    title.textContent = costItem.title;
    titleRow.appendChild(title);

    if (costItem.optional) {
      const badge = document.createElement("span");
      badge.className = "cost-badge";
      badge.textContent = "Swap";
      titleRow.appendChild(badge);
      row.classList.add("is-optional");
    }

    detail.textContent = costItem.detail;
    event.append(
      titleRow,
      detail,
      createOutboundLink(
        { label: costItem.sourceLabel, url: costItem.sourceUrl },
        "cost-source-link",
      ),
    );
    row.append(
      event,
      createCostCell(
        "1 person",
        costItem.onePerson,
        costItem.onePersonLabel,
        costItem.onePersonSuffix || "",
      ),
      createCostCell(
        "8 people",
        costItem.eightPeople,
        costItem.eightPeopleLabel,
        costItem.eightPeopleSuffix || "",
      ),
    );

    if (costItem.alcohol) {
      row.appendChild(createAlcoholLine(costItem.alcohol));
    }

    wrapper.appendChild(row);
  });

  const totals = document.createElement("div");
  const totalEvent = document.createElement("div");
  const totalTitle = document.createElement("strong");
  const totalNote = document.createElement("small");
  const alcoholItems = coreItems
    .filter((item) => item.alcohol)
    .map((item) => item.alcohol);

  totals.className = "cost-row cost-total";
  totalEvent.className = "cost-event";
  totalTitle.textContent = prepItem.totalLabel;
  totalNote.textContent = prepItem.totalNote;
  totalEvent.append(totalTitle, totalNote);
  totals.append(
    totalEvent,
    createCostCell("1 person", sumCostRanges(coreItems, "onePerson")),
    createCostCell("8 people", sumCostRanges(coreItems, "eightPeople")),
  );

  const alcoholTotal = document.createElement("p");
  const alcoholLabel = document.createElement("strong");
  const alcoholOne = sumCostRanges(alcoholItems, "onePerson");
  const alcoholEight = sumCostRanges(alcoholItems, "eightPeople");

  alcoholTotal.className = "cost-alcohol cost-alcohol-total";
  alcoholLabel.textContent = "Optional ALC.* total";
  alcoholTotal.append(
    alcoholLabel,
    " ",
    `+${formatCostRange(alcoholOne)} pp · +${formatCostRange(alcoholEight)} / 8`,
  );
  totals.appendChild(alcoholTotal);
  wrapper.appendChild(totals);

  const footnote = document.createElement("p");
  footnote.className = "cost-footnote";
  footnote.textContent = prepItem.footnote;
  wrapper.appendChild(footnote);

  return wrapper;
}

function createChecklist(prepItem) {
  const groups = document.createElement("div");
  groups.className = "checklist-groups";

  prepItem.groups.forEach((group) => {
    const section = document.createElement("section");
    const title = document.createElement("h6");
    const list = document.createElement("ul");

    title.textContent = group.title;
    group.items.forEach((itemText) => {
      const item = document.createElement("li");
      item.textContent = itemText;
      list.appendChild(item);
    });
    section.append(title, list);
    groups.appendChild(section);
  });

  return groups;
}

function createItineraryBoard(plan) {
  const wrapper = document.createElement("div");
  wrapper.className = "trip-itinerary";

  const days = document.createElement("div");
  days.className = "itinerary-days";

  plan.days.forEach((dayPlan, dayIndex) => {
    const section = document.createElement("section");
    section.className = "itinerary-day";

    const headingRow = document.createElement("div");
    headingRow.className = "itinerary-day-heading";

    const dayNumber = document.createElement("span");
    dayNumber.className = "itinerary-day-number";
    dayNumber.textContent = String(dayIndex + 1).padStart(2, "0");

    const headingText = document.createElement("div");
    const heading = document.createElement("h4");
    const label = document.createElement("p");
    const list = document.createElement("ol");

    heading.textContent = dayPlan.day;
    label.textContent = dayPlan.label;
    headingText.append(heading, label);
    headingRow.append(dayNumber, headingText);

    dayPlan.items.forEach((itemData) => {
      list.appendChild(createItineraryItem(itemData));
    });

    section.append(headingRow, list);
    days.appendChild(section);
  });

  const prep = document.createElement("section");
  prep.className = "itinerary-prep";
  prep.setAttribute("aria-label", "Weekend prep");

  const prepGrid = document.createElement("div");
  prepGrid.className = "itinerary-prep-grid";

  plan.prep.forEach((prepItem) => {
    const item = document.createElement("article");
    const title = document.createElement("h5");

    item.className = "itinerary-prep-card";
    title.textContent = prepItem.title;
    item.appendChild(title);

    if (prepItem.kind === "costs") {
      item.classList.add("itinerary-prep-card--costs");
      item.appendChild(createCostBreakdown(prepItem));
    } else if (prepItem.kind === "checklist") {
      item.classList.add("itinerary-prep-card--checklist");
      item.appendChild(createChecklist(prepItem));
    }

    prepGrid.appendChild(item);
  });

  prep.appendChild(prepGrid);
  wrapper.append(days, prep);

  return wrapper;
}

function renderTripDetails() {
  elements.tripDetails.textContent = "";

  tripDetails.forEach((detail) => {
    const card = document.createElement("article");
    card.className = `trip-card trip-card--${detail.kind || "standard"}`;

    const heading = document.createElement("div");
    heading.className = "trip-card-heading";

    if (detail.eyebrow) {
      const eyebrow = document.createElement("span");
      eyebrow.className = "trip-card-eyebrow";
      eyebrow.textContent = detail.eyebrow;
      heading.appendChild(eyebrow);
    }

    const title = document.createElement("h3");
    title.textContent = detail.title;
    heading.appendChild(title);

    const isLocked = detail.gated && !plannerAccessGranted;
    const visibleBody = isLocked ? detail.body : detail.gatedBody || detail.body;

    if (isLocked) {
      card.classList.add("is-locked");
    }

    card.appendChild(heading);

    if (typeof visibleBody === "object") {
      card.appendChild(createItineraryBoard(visibleBody));
    } else {
      const body = document.createElement("p");
      body.className = "trip-card-copy";
      body.textContent = visibleBody;
      card.appendChild(body);
    }

    if (detail.linkUrl && detail.linkLabel) {
      const link = document.createElement("a");
      link.href = detail.linkUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "trip-card-link";
      link.textContent = detail.linkLabel;
      card.appendChild(link);
    }

    elements.tripDetails.appendChild(card);
  });
}

function clearResponseInputs() {
  elements.form.querySelectorAll('input[name="rsvp-status"], input[name="availability"]').forEach((input) => {
    input.checked = false;
  });
  elements.notes.value = "";
}

function setFormFromResponse(response) {
  clearResponseInputs();

  if (!response) {
    elements.submitRsvp.textContent = "Submit RSVP";
    return;
  }

  const normalizedStatus = normalizeStatus(response.status);
  const statusInput = elements.form.querySelector(`input[name="rsvp-status"][value="${CSS.escape(normalizedStatus)}"]`);
  if (statusInput) {
    statusInput.checked = true;
  }

  elements.form.querySelectorAll('input[name="availability"]').forEach((input) => {
    input.checked = normalizeAvailability(response.availability).includes(input.value);
  });
  elements.notes.value = response.notes || "";
  elements.submitRsvp.textContent = "Update RSVP";
}

function updateInviteeState() {
  const invitee = getInviteeById(elements.inviteeSelect.value);

  if (!invitee) {
    elements.phoneCard.hidden = true;
    elements.phoneDisplay.textContent = "";
    clearResponseInputs();
    elements.submitRsvp.textContent = "Submit RSVP";
    setStatus("", "loading");
    return;
  }

  elements.phoneCard.hidden = false;
  elements.phoneDisplay.textContent = formatPhone(invitee.phone);
  setFormFromResponse(responses[invitee.id]);
  setStatus("", "loading");
}

function getSelectedAvailability() {
  const selectedAvailability = Array.from(elements.form.querySelectorAll('input[name="availability"]:checked')).map(
    (input) => input.value,
  );
  return normalizeAvailability(selectedAvailability);
}

function getSelectedStatus() {
  const checked = elements.form.querySelector('input[name="rsvp-status"]:checked');
  return checked ? checked.value : "";
}

function handleAvailabilityChange(event) {
  const changedInput = event.target;

  if (!(changedInput instanceof HTMLInputElement) || changedInput.name !== "availability" || !changedInput.checked) {
    return;
  }

  const availabilityInputs = Array.from(elements.form.querySelectorAll('input[name="availability"]'));

  if (changedInput.value === unavailableWeekend) {
    availabilityInputs.forEach((input) => {
      if (input !== changedInput) {
        input.checked = false;
      }
    });
    return;
  }

  const unavailableInput = availabilityInputs.find((input) => input.value === unavailableWeekend);
  if (unavailableInput) {
    unavailableInput.checked = false;
  }
}

function showRsvpPage({ updateHash = true } = {}) {
  elements.detailsPage.hidden = true;
  elements.rsvpPage.hidden = false;
  updateRollCallState();

  if (updateHash) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

async function showDetailsPage({ updateHash = true, refresh = true } = {}) {
  if (refresh) {
    try {
      await refreshSharedResponses();
    } catch (error) {
      setStatus("Shared RSVPs could not be refreshed. Showing saved browser entries for now.", "error");
    }
  }

  renderDetailsPage();
  elements.rsvpPage.hidden = true;
  elements.detailsPage.hidden = false;

  if (updateHash) {
    window.history.replaceState(null, "", "#quest-details");
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

async function handleSubmit(event) {
  event.preventDefault();

  if (getWeekendDecision().isFinalized) {
    updateRollCallState();
    setStatus("The roll call is complete and the winning weekend is locked.", "success");
    return;
  }

  const invitee = getInviteeById(elements.inviteeSelect.value);
  const status = getSelectedStatus();
  const availability = getSelectedAvailability();

  if (!invitee) {
    setStatus("Please choose your name before submitting.", "error");
    elements.inviteeSelect.focus();
    return;
  }

  if (!status) {
    setStatus("Please choose an RSVP status.", "error");
    elements.form.querySelector('input[name="rsvp-status"]')?.focus();
    return;
  }

  if (!availability.length) {
    setStatus("Please choose at least one weekend option.", "error");
    elements.form.querySelector('input[name="availability"]')?.focus();
    return;
  }

  const existingResponse = responses[invitee.id];
  const now = new Date().toISOString();
  const response = {
    inviteeId: invitee.id,
    name: invitee.name,
    phone: invitee.phone,
    status,
    availability,
    notes: elements.notes.value.trim(),
    submittedAt: existingResponse?.submittedAt || now,
    updatedAt: now,
  };

  isSavingRsvp = true;
  elements.submitRsvp.disabled = true;
  elements.submitRsvp.textContent = remoteStoreUrl ? "Saving Shared RSVP..." : "Saving RSVP...";

  try {
    await persistResponse(response);
    setStatus("", "loading");
    elements.submitRsvp.textContent = "Update RSVP";
    await showDetailsPage({ refresh: false });
  } catch (error) {
    elements.submitRsvp.textContent = "Update RSVP";
    setStatus("Saved on this device, but the shared RSVP log could not be updated. Please try again.", "error");
  } finally {
    isSavingRsvp = false;
    updateRollCallState();
  }
}

function getResponseEntries() {
  return invitees
    .map((invitee) => ({ invitee, response: responses[invitee.id] }))
    .filter((entry) => Boolean(entry.response) && Boolean(normalizeStatus(entry.response.status)));
}

function getWeekendDecision() {
  const responseEntries = getResponseEntries();
  const submittedResponses = responseEntries.map((entry) => entry.response);
  const hasAllExpectedResponses = responseEntries.length === expectedRsvpCount;
  const hasDeclined = submittedResponses.some((response) => normalizeStatus(response.status) === noStatus);
  const needsAnotherDateOption = submittedResponses.some((response) =>
    needsWeekendReroll(response.availability),
  );
  const eligibleResponses = submittedResponses.filter(
    (response) => normalizeStatus(response.status) === yesStatus,
  );
  const weekendCounts = weekendOptions
    .filter((weekend) => weekend.value !== unavailableWeekend)
    .map((weekend) => ({
      ...weekend,
      names: eligibleResponses
        .filter((response) => normalizeAvailability(response.availability).includes(weekend.value))
        .map((response) => response.name),
    }));
  const unanimousWeekends = hasAllExpectedResponses && !hasDeclined && !needsAnotherDateOption
    ? weekendCounts.filter((weekend) => weekend.names.length === expectedRsvpCount)
    : [];
  const finalizedWeekend = unanimousWeekends.length === 1 ? unanimousWeekends[0] : null;
  const visibleWeekends = finalizedWeekend ? [finalizedWeekend] : weekendCounts;

  return {
    eligibleResponses,
    finalizedWeekend,
    hasAllExpectedResponses,
    hasDeclined,
    isFinalized: Boolean(finalizedWeekend),
    needsAnotherDateOption,
    responseEntries,
    unanimousWeekends,
    visibleWeekends,
    weekendCounts,
  };
}

function updateRollCallState(decision = getWeekendDecision()) {
  const isLocked = decision.isFinalized;

  elements.alreadyDidThis.textContent = isLocked ? "Let our journey begin!" : "Already Did This";
  elements.rsvpPanel.classList.toggle("is-finalized", isLocked);
  elements.rollCallToggle.disabled = isLocked;
  elements.rollCallToggle.setAttribute(
    "aria-label",
    isLocked ? "Roll call complete and locked" : "Toggle Roll call",
  );

  elements.form.querySelectorAll("input, select, textarea, button").forEach((control) => {
    control.disabled = isLocked;
  });

  if (!isLocked && isSavingRsvp) {
    elements.submitRsvp.disabled = true;
  }

  if (isLocked) {
    setCollapsibleExpanded(elements.rsvpPanel, false);
  }
}

function needsWeekendReroll(availability) {
  return normalizeAvailability(availability).includes(unavailableWeekend);
}

function createRollResult(status, availability) {
  const normalizedStatus = normalizeStatus(status);
  const requiresReroll = needsWeekendReroll(availability);
  const rollResult = document.createElement("div");
  rollResult.className = requiresReroll
    ? "roll-result is-reroll"
    : normalizedStatus === yesStatus
      ? "roll-result is-success"
      : "roll-result is-failure";

  const diceIcon = document.createElement("span");
  diceIcon.className = "dice-icon";
  diceIcon.setAttribute("aria-hidden", "true");

  const rollDie = document.createElement("span");
  rollDie.className = "roll-die";
  rollDie.textContent = "D20";

  const rollLabel = document.createElement("span");
  rollLabel.className = "roll-label";
  rollLabel.textContent = "Roll:";

  const rollValue = document.createElement("span");
  rollValue.className = "roll-value";
  rollValue.textContent = requiresReroll
    ? "ERROR, REROLL"
    : normalizedStatus === yesStatus
      ? "CRITICAL SUCCESS"
      : "CRITICAL FAILURE";

  rollResult.append(diceIcon, rollDie, rollLabel, rollValue);
  rollResult.setAttribute("aria-label", `D20 roll: ${rollValue.textContent}`);
  return rollResult;
}

function renderResponseList() {
  const entries = getResponseEntries();
  elements.responseList.textContent = "";

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No responses yet.";
    elements.responseList.appendChild(empty);
    return;
  }

  entries.forEach(({ invitee, response }) => {
    const item = document.createElement("article");
    item.className = "response-card";

    const responseHeading = document.createElement("div");
    responseHeading.className = "response-heading";

    const heading = document.createElement("h3");
    heading.textContent = invitee.name;
    responseHeading.append(heading, createRollResult(response.status, response.availability));

    item.appendChild(responseHeading);

    if (response.notes) {
      item.appendChild(createDetailLine("Notes", response.notes));
    }

    elements.responseList.appendChild(item);
  });
}

function createDetailLine(label, value) {
  const line = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${label}:`;
  line.append(strong, ` ${value}`);
  return line;
}

function renderOverlapTracker(decision = getWeekendDecision()) {
  elements.overlapSummary.textContent = "";
  elements.overlapList.textContent = "";

  const summary = document.createElement("p");
  summary.className = "overlap-callout";
  if (decision.needsAnotherDateOption) {
    summary.classList.add("is-reroll");
    summary.textContent = "Weekend reroll needed: add another date option for the group.";
  } else if (decision.hasDeclined) {
    summary.classList.add("is-reroll");
    summary.textContent = "Roll call stays open: at least one guest cannot attend. No weekend has been selected.";
  } else if (decision.isFinalized) {
    summary.textContent = `${decision.finalizedWeekend.summary}: selected for all 7 guests. Let the journey begin!`;
  } else if (!decision.hasAllExpectedResponses) {
    summary.classList.add("is-pending");
    summary.textContent = `Waiting for all ${expectedRsvpCount} RSVPs before calling the best weekend.`;
  } else if (decision.unanimousWeekends.length > 1) {
    summary.classList.add("is-pending");
    const labels = decision.unanimousWeekends.map((weekend) => weekend.summary).join(", ");
    summary.textContent = `${labels}: all work for everyone. No single weekend has been locked yet.`;
  } else {
    summary.classList.add("is-reroll");
    summary.textContent = `No single weekend works for all ${expectedRsvpCount} guests. Add another date option and reroll.`;
  }
  elements.overlapSummary.appendChild(summary);

  decision.visibleWeekends.forEach(({ label, detail, names, value }) => {
    const item = document.createElement("article");
    item.className = "overlap-card";

    if (decision.isFinalized && value === decision.finalizedWeekend.value) {
      item.classList.add("is-selected");
      const selectedLabel = document.createElement("span");
      selectedLabel.className = "overlap-selected-label";
      selectedLabel.textContent = "Selected weekend";
      item.appendChild(selectedLabel);
    }

    const title = document.createElement("h3");
    title.textContent = label;

    const detailLine = document.createElement("p");
    detailLine.className = "overlap-window";
    detailLine.textContent = detail;

    const count = document.createElement("p");
    count.textContent = `${names.length} ${names.length === 1 ? "vote" : "votes"}`;

    item.append(title, detailLine, count);
    elements.overlapList.appendChild(item);
  });
}

function renderDetailsPage() {
  const decision = getWeekendDecision();
  renderTripDetails();
  renderResponseList();
  renderOverlapTracker(decision);
  updateRollCallState(decision);
}

function handleResetForm(event) {
  event.preventDefault();

  const password = elements.resetPassword.value.trim();

  if (password !== plannerAccessPassword) {
    setResetMessage("Wrong password.", "error");
    elements.resetPassword.select();
    return;
  }

  plannerAccessGranted = true;
  elements.resetPassword.value = "";
  renderTripDetails();
  setResetMessage("Access granted.", "success");
}

document.addEventListener("DOMContentLoaded", async () => {
  renderInviteeOptions();
  renderChoices();
  initializeCollapsibles();
  await loadResponses();
  setStatus("", "loading");
  updateInviteeState();
  updateRollCallState();

  elements.inviteeSelect.addEventListener("change", updateInviteeState);
  elements.availabilityOptions.addEventListener("change", handleAvailabilityChange);
  elements.form.addEventListener("submit", handleSubmit);
  elements.resetForm.addEventListener("submit", handleResetForm);
  elements.alreadyDidThis.addEventListener("click", () => showDetailsPage());
  elements.backToRsvp.addEventListener("click", () => {
    showRsvpPage();
    updateInviteeState();
  });
  startSharedPolling();

  if (window.location.hash === "#quest-details") {
    showDetailsPage({ updateHash: false });
  } else {
    showRsvpPage({ updateHash: false });
  }
});
