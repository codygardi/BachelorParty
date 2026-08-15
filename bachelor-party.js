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
    kind: "itinerary",
    body: {
      days: [
        {
          day: "Friday",
          label: "Jan 15, 2027 · Arrival & kickoff",
          items: [
            {
              title: "Meet at base camp",
            },
            {
              title: "Grass Valley Brewing Co.",
              links: [
                {
                  label: "Location",
                  url: "https://maps.google.com/maps?daddr=141+E+Main+St%2C+Grass+Valley%2C+CA+95945%2C+USA",
                },
                {
                  label: "Menu",
                  url: "https://www.gvbrew.com/menus-1",
                },
              ],
            },
            {
              title: "Games and D&D",
            },
          ],
        },
        {
          day: "Saturday",
          label: "Jan 16, 2027 · Grass Valley → Sacramento",
          items: [
            {
              title: "Late breakfast at Bubba's Bagels",
              links: [
                {
                  label: "Location",
                  url: "https://maps.google.com/?q=Bubba%27s+Bagels+860+Sutton+Way+Grass+Valley+CA",
                },
                { label: "Menu", url: "https://bubbas-bagels.com/#menu" },
              ],
            },
            {
              title: "Head to Sacramento",
              links: [
                {
                  label: "Route",
                  url: "https://www.google.com/maps/dir/?api=1&origin=Bubba%27s%20Bagels%2C%20860%20Sutton%20Way%2C%20Grass%20Valley%2C%20CA%2095945&destination=Pete%27s%20Restaurant%20%26%20Brewhouse%2C%202100%20Arden%20Way%20Suite%20123%2C%20Sacramento%2C%20CA%2095825",
                },
              ],
            },
            {
              title: "Pete's Arden bar",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=Pete%27s%20Restaurant%20%26%20Brewhouse%2C%202100%20Arden%20Way%20Suite%20123%2C%20Sacramento%2C%20CA%2095825",
                },
                {
                  label: "Menu",
                  url: "https://order.online/store/pete%27s-restaurant-%26-brewhouse-sacramento-2467080/?hideModal=true&pickup=true",
                },
              ],
            },
            {
              title: "Enchambered escape room",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/place/Enchambered%3A%2BSacramento%2BEscape%2BRoom/%4038.5949739%2C-121.4155359%2C17z/data%3D%214m13%211m7%213m6%211s0x809ada3a26708365%3A0x8bb19e45ee56c972%212sEnchambered%3A%2BSacramento%2BEscape%2BRoom%213b1%218m2%213d38.5949739%214d-121.4133472%213m4%211s0x809ada3a26708365%3A0x8bb19e45ee56c972%218m2%213d38.5949739%214d-121.4133472",
                },
                { label: "Book", url: "https://www.enchambered.com/booking/" },
              ],
            },
            {
              title: "Dinner at The Butterscotch Den (vegetarian options)",
              links: [
                {
                  label: "Location",
                  url: "https://www.google.com/maps/search/?api=1&query=The%20Butterscotch%20Den%2C%203406%20Broadway%2C%20Sacramento%2C%20CA%2095817",
                },
                { label: "Menu", url: "https://www.thebutterscotchden.com/s/MENU-47.pdf" },
                { label: "Reserve", url: "https://www.thebutterscotchden.com/" },
              ],
            },
            {
              title: "Punch Line Comedy Club — show TBD",
              links: [
                {
                  label: "Location",
                  url: "https://maps.app.goo.gl/Y6C8Zp7sqxmxSbVQ7",
                },
                { label: "Shows", url: "https://www.punchlinesac.com/" },
                { label: "Menu", url: "https://www.punchlinesac.com/menu" },
                { label: "Policy", url: "https://www.punchlinesac.com/visit" },
              ],
            },
            {
              title: "Return to Grass Valley",
            },
          ],
        },
      ],
      prep: [
        {
          title: "Estimated cost",
          kind: "costs",
          items: [
            {
              title: "Fri · GV Brewing food",
              onePerson: [19, 19],
            },
            {
              title: "Sat · Bubba's sandwiches",
              onePerson: [12.99, 12.99],
            },
            {
              title: "Sat · 2-car gas share",
              onePerson: null,
              onePersonLabel: "TBD",
            },
            {
              title: "Sat · Pete's food (optional)",
              onePerson: [45.49, 45.49],
            },
            {
              title: "Sat · Enchambered",
              onePerson: [45, 45],
            },
            {
              title: "Sat · Butterscotch food",
              onePerson: [43, 43],
            },
            {
              title: "Sat · Punch Line ticket (est.)",
              onePerson: [69, 69],
            },
            {
              title: "Sat · Punch Line drinks (2, est.)",
              onePerson: [44, 44],
            },
          ],
          totalLabel: "Known-cost subtotal",
          coverLabel: "Robbie's share ÷ 7",
          payerTotalLabel: "Each payer total",
          estimateNote:
            "Punch Line estimates use $69 for a comparable January 2027 ticket and $44 for two beverages at the recent reported high of $22 each. Gas, ticket fees, tax, and gratuity are excluded.",
          estimateLinks: [
            {
              label: "Ticket comparison",
              url: "https://concerts50.com/venues/usa/sacramento-ca/punch-line-sacramento",
            },
            {
              label: "Official drink menu",
              url: "https://www.punchlinesac.com/menu",
            },
          ],
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
                "Small bag only for Punch Line — no backpacks",
                "Light layer for the evening",
                "D&D dice or character materials",
                "Two designated drivers for the return trip",
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
  partyCount: document.querySelector("[data-party-count]"),
  overlapSummary: document.querySelector("[data-overlap-summary]"),
  overlapList: document.querySelector("[data-overlap-list]"),
};

let responses = {};
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
  if (!elements.statusMessage) {
    return;
  }

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

    if (elements.detailsPage && !elements.detailsPage.hidden) {
      renderDetailsPage();
    }

    if (elements.form && elements.rsvpPage && !elements.rsvpPage.hidden) {
      updateInviteeState();
    }

    if (elements.rsvpPanel) {
      updateRollCallState();
    }
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

function divideCostRange(range, divisor) {
  return range.map((value) => value / divisor);
}

function addCostRanges(first, second) {
  return first.map((value, index) => value + second[index]);
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

function createCostBreakdown(prepItem) {
  const wrapper = document.createElement("div");
  const header = document.createElement("div");
  const eventHeading = document.createElement("span");
  const maxHeading = document.createElement("span");
  const maxLabel = document.createElement("span");
  const maxIndicator = document.createElement("abbr");

  wrapper.className = "cost-breakdown";
  header.className = "cost-header";
  eventHeading.textContent = "Event";
  maxHeading.className = "cost-max-heading";
  maxLabel.textContent = "1 person";
  maxIndicator.className = "cost-max-indicator";
  maxIndicator.textContent = "MAX";
  maxIndicator.title = "Maximum price: assumes the most expensive listed item.";
  maxIndicator.setAttribute(
    "aria-label",
    "Maximum price: assumes the most expensive listed item.",
  );
  maxHeading.append(maxLabel, maxIndicator);
  header.append(eventHeading, maxHeading);
  wrapper.appendChild(header);

  prepItem.items.forEach((costItem) => {
    const row = document.createElement("article");
    const event = document.createElement("div");
    const title = document.createElement("strong");

    row.className = "cost-row";
    event.className = "cost-event";
    title.textContent = costItem.title;
    event.appendChild(title);
    row.append(
      event,
      createCostCell(
        "1 person",
        costItem.onePerson,
        costItem.onePersonLabel,
        costItem.onePersonSuffix || "",
      ),
    );

    wrapper.appendChild(row);
  });

  const subtotal = sumCostRanges(prepItem.items, "onePerson");
  const robbieShare = divideCostRange(subtotal, expectedRsvpCount);
  const payerTotal = addCostRanges(subtotal, robbieShare);
  const totals = document.createElement("div");
  const totalEvent = document.createElement("div");
  const totalTitle = document.createElement("strong");

  totals.className = "cost-row cost-total";
  totalEvent.className = "cost-event";
  totalTitle.textContent = prepItem.totalLabel;
  totalEvent.appendChild(totalTitle);
  totals.append(
    totalEvent,
    createCostCell("1 person", subtotal),
  );
  wrapper.appendChild(totals);

  const coverRow = document.createElement("div");
  const coverEvent = document.createElement("div");
  const coverTitle = document.createElement("strong");

  coverRow.className = "cost-row cost-cover-share";
  coverEvent.className = "cost-event";
  coverTitle.textContent = prepItem.coverLabel;
  coverEvent.appendChild(coverTitle);
  coverRow.append(coverEvent, createCostCell("Per payer", robbieShare));
  wrapper.appendChild(coverRow);

  const payerTotalRow = document.createElement("div");
  const payerTotalEvent = document.createElement("div");
  const payerTotalTitle = document.createElement("strong");

  payerTotalRow.className = "cost-row cost-payer-total";
  payerTotalEvent.className = "cost-event";
  payerTotalTitle.textContent = prepItem.payerTotalLabel;
  payerTotalEvent.appendChild(payerTotalTitle);
  payerTotalRow.append(payerTotalEvent, createCostCell("Per payer", payerTotal));
  wrapper.appendChild(payerTotalRow);

  if (prepItem.estimateNote) {
    const note = document.createElement("p");
    note.className = "cost-estimate-note";
    note.textContent = prepItem.estimateNote;

    if (prepItem.estimateLinks?.length) {
      const links = document.createElement("span");
      links.className = "cost-estimate-links";
      prepItem.estimateLinks.forEach((linkData) => {
        links.appendChild(createOutboundLink(linkData, "cost-estimate-link"));
      });
      note.appendChild(links);
    }

    wrapper.appendChild(note);
  }

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

    const visibleBody = detail.body;

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
  if (!elements.rsvpPanel || !elements.rollCallToggle || !elements.alreadyDidThis || !elements.form) {
    return;
  }

  const isLocked = decision.isFinalized;

  elements.alreadyDidThis.textContent = "Click to begin Quest!";
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
  elements.partyCount.textContent = `${entries.length} / ${expectedRsvpCount} accounted for`;

  if (!entries.length) {
    const empty = document.createElement("li");
    empty.className = "party-roster-empty";
    empty.textContent = "No responses yet.";
    elements.responseList.appendChild(empty);
    return;
  }

  entries.forEach(({ invitee }) => {
    const item = document.createElement("li");
    item.className = "party-roster-name";
    item.textContent = invitee.name;
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
    summary.textContent = "";
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
  if (!decision.isFinalized) {
    elements.overlapSummary.appendChild(summary);
  }

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
    count.textContent = decision.isFinalized
      ? `${names.length} / ${expectedRsvpCount} votes`
      : `${names.length} ${names.length === 1 ? "vote" : "votes"}`;

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

document.addEventListener("DOMContentLoaded", async () => {
  await loadResponses();
  renderDetailsPage();
  startSharedPolling();
});
