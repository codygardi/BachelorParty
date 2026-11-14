const STORAGE_KEY = "bachelor-party-rsvp-responses-v1";
const persistenceConfig = window.BACHELOR_PARTY_RSVP_CONFIG || {};
const remoteStoreUrl = String(persistenceConfig.endpointUrl || "").trim();
const csvStoreUrl = String(persistenceConfig.csvUrl || "").trim();

const invitees = [
  { id: "max-voorhees", name: "Max Voorhees" },
  { id: "thomas-correll", name: "Thomas Correll" },
  { id: "jonno-christie", name: "Jonno Christie" },
  { id: "lane-carleson", name: "Lane Carlson" },
  { id: "sean-fitzhenry", name: "Sean Fitzhenry" },
  { id: "andrew-kostolefsky", name: "Andrew Kostolefsky" },
  { id: "cody-gardi", name: "Cody Gardi" },
];

const bachelor = { id: "robbie-merchant", name: "Robbie Merchant", role: "The Bachelor" };
const party = [bachelor, ...invitees];

const yesStatus = "Yes, I am in";
const noStatus = "No, I cannot make it";
const legacyNoStatus = "Sorry, I cannot make it";
const unavailableWeekend = "None of these weekends work for me";
const expectedRsvpCount = invitees.length;

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

let responses = {};
let refreshingRsvps = false;


function normalizeAvailability(availability) {
  if (!Array.isArray(availability)) {
    return [];
  }

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
  const invitee = invitees.find(({ id }) => id === record?.inviteeId);
  const status = normalizeStatus(record?.status);
  const availability = parseAvailabilityValue(record?.availability);

  if (!invitee || !status || !availability.length) {
    return null;
  }

  const submittedAt = record.submittedAt || record.updatedAt || new Date().toISOString();
  const updatedAt = record.updatedAt || submittedAt;

  return {
    inviteeId: invitee.id,
    name: invitee.name,
    status,
    availability,
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


function readLocalResponses() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return createResponseCollection(Object.values(JSON.parse(saved || "{}")));
  } catch {
    return {};
  }
}

async function fetchRsvps(url) {
  const result = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!result.ok) {
    throw new Error("The shared RSVP log could not be loaded.");
  }

  const content = await result.text();
  const trimmed = content.trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[")
    ? responsesFromPayload(JSON.parse(trimmed))
    : responsesFromCsv(content);
}

function needsWeekendReroll(availability) {
  return normalizeAvailability(availability).includes(unavailableWeekend);
}

function renderRoster() {
  const roster = document.querySelector("[data-response-list]");
  roster.replaceChildren(...party.map((member) => {
    const card = document.createElement("li");
    card.className = member.role ? "member member-bachelor" : "member";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.callingCard = member.id;
    button.setAttribute("aria-pressed", "false");

    const badge = document.createElement("span");
    badge.className = "member-mark";
    badge.textContent = member.name.split(" ").map((part) => part[0]).join("");
    badge.setAttribute("aria-hidden", "true");

    const name = document.createElement("strong");
    name.textContent = member.name;
    const info = document.createElement("span");
    info.className = "member-info";
    info.append(name);
    if (member.role) {
      const role = document.createElement("span");
      role.textContent = member.role;
      info.append(role);
    }

    button.append(badge, info);
    card.append(button);
    return card;
  }));
}

function renderRsvps(loadFailed = false) {
  const decision = getWeekendDecision();
  const summary = document.querySelector("[data-rsvp-summary]");
  const details = document.querySelector("[data-rsvp-details]");
  const count = decision.responseEntries.length;
  summary.textContent = "Guest RSVPs · " + count + "/" + expectedRsvpCount;

  const note = document.createElement("p");
  if (decision.finalizedWeekend) {
    note.textContent = decision.finalizedWeekend.label + " works for all seven guests.";
  } else if (decision.hasDeclined || decision.needsAnotherDateOption) {
    note.textContent = "At least one guest needs a different weekend.";
  } else if (decision.unanimousWeekends.length > 1) {
    note.textContent = "Multiple weekends work for all seven guests.";
  } else if (decision.hasAllExpectedResponses) {
    note.textContent = "No single weekend works for all seven guests.";
  } else {
    note.textContent = "Waiting for " + (expectedRsvpCount - count) + " guest RSVP(s).";
  }
  if (loadFailed) {
    note.textContent += " The shared RSVP log is currently unavailable.";
  }

  const dates = document.createElement("ul");
  dates.className = "availability-list";
  for (const weekend of decision.visibleWeekends) {
    const row = document.createElement("li");
    row.textContent = weekend.label + " · " + weekend.names.length + "/" + expectedRsvpCount + " guests available";
    dates.append(row);
  }
  details.replaceChildren(note, dates);
}

async function refreshRsvps() {
  if (refreshingRsvps) return;
  refreshingRsvps = true;
  const sources = [];
  if (csvStoreUrl) sources.push(fetchRsvps(csvStoreUrl));
  if (remoteStoreUrl) {
    const url = new URL(remoteStoreUrl, window.location.href);
    url.searchParams.set("action", "list");
    sources.push(fetchRsvps(url));
  }

  try {
    const results = await Promise.allSettled(sources);
    for (const result of results) {
      if (result.status === "fulfilled") mergeResponses(result.value);
    }
    renderRsvps(Boolean(results.length) && results.every((result) => result.status === "rejected"));
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    } catch {
      // The shared roster still works if browser storage is disabled.
    }
  } finally {
    refreshingRsvps = false;
  }
}

function rollForToast() {
  const roll = 1 + Math.floor(Math.random() * 20);
  const prompt = roll === 20 ? "Choose who goes next." : roll >= 10 ? "Give Robbie a toast." : "Share a Robbie story.";
  document.querySelector("[data-dice-result]").textContent = roll + " · " + prompt;
}

document.addEventListener("DOMContentLoaded", () => {
  renderRoster();
  responses = readLocalResponses();
  renderRsvps();
  refreshRsvps();
  window.setInterval(() => {
    if (!document.hidden) refreshRsvps();
  }, 60000);
  document.querySelector("[data-roll-die]").addEventListener("click", rollForToast);
});
