const STORE_KEY = "bachelor-party-rsvp-responses";

const voterIds = new Set([
  "robbie-merchant", "max-voorhees", "thomas-correll", "jonno-christie",
  "lane-carleson", "sean-fitzhenry", "andrew-kostolefsky", "cody-gardi",
]);
const dndHostChoices = new Set(["", "host", "cant-host"]);
const driveChoices = new Set(["volunteer", "rider"]);
const carChoices = new Set(["", "offer"]);
const passengerSeatChoices = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
const breakfastChoices = new Set(["", "bubbas", "own"]);
const breakfastOrderLimit = 400;
const barChoices = new Set(["", "maple-room", "snug", "shady-lady"]);
const dinnerChoices = new Set(["", "thai-terrace", "wildwood", "tapa-the-world"]);
const roomChoices = new Set(["", "enchambered", "paniq"]);
const seatingChoices = new Set(["", "general", "preferred"]);
const ballotChoices = {
  dndHost: dndHostChoices,
  designatedDriver: new Set([true, false]),
  drive: driveChoices, car: carChoices, passengerSeats: passengerSeatChoices, breakfast: breakfastChoices,
  bar: barChoices, dinner: dinnerChoices, room: roomChoices, seating: seatingChoices,
  planSubmitted: new Set([true]),
};
const planVoteFields = ["breakfast", "bar", "room", "dinner", "seating"];
const ballotColumns = "inviteeId, dndHost, drive, designatedDriver, breakfast, breakfastOrder, bar, dinner, room, seating, car, passengerSeats, plan, walkBar, walkRoom, walkDinner, planSubmitted";
const roomLocations = new Map([
  ["skull-witch", "enchambered"],
  ["the-collection", "enchambered"],
  ["pirates-of-tortuga", "paniq"],
]);

function combinedChoice(field, driveVote, walkVote, plan) {
  const votes = (plan === "walk" ? [walkVote, driveVote] : [driveVote, walkVote]).filter(Boolean);
  const choices = field === "room" ? votes.map((vote) => roomLocations.get(vote) ?? vote) : votes;
  // Keep a removed choice visible until its voter changes or clears it.
  return choices.find((choice) => ballotChoices[field].has(choice)) ?? choices[0] ?? "";
}

function currentBallot({ plan, walkBar, walkRoom, walkDinner, planSubmitted, designatedDriver, ...card }) {
  return {
    ...card,
    bar: combinedChoice("bar", card.bar, walkBar, plan),
    room: combinedChoice("room", card.room, walkRoom, plan),
    dinner: combinedChoice("dinner", card.dinner, walkDinner, plan),
    designatedDriver: designatedDriver === 1,
    planSubmitted: planSubmitted === 1,
  };
}

function missingPlanChoices(card = {}) {
  const missing = [];
  if (card.drive === "volunteer" && card.car === "offer") {
    if (!passengerSeatChoices.has(card.passengerSeats)) missing.push("passengerSeats");
  } else if (card.drive !== "rider") {
    missing.push("transport");
  }
  for (const field of planVoteFields) {
    if (!card[field] || !ballotChoices[field].has(card[field])) missing.push(field);
  }
  return missing;
}

function isValidChoice(field, value) {
  if (field === "breakfastOrder") return typeof value === "string" && value.length <= breakfastOrderLimit;
  return Object.hasOwn(ballotChoices, field) && ballotChoices[field].has(value);
}

const defaultHeaders = {
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    ...defaultHeaders,
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
  };
}

function jsonResponse(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function responsesToCsv(responses) {
  const headers = ["inviteeId", "name", "phone", "status", "availability", "notes", "submittedAt", "updatedAt"];
  const rows = responses.map((response) => headers.map((header) => csvEscape(response[header])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

async function readResponses(env) {
  const saved = await env.RSVPS.get(STORE_KEY, { type: "json" });
  return Array.isArray(saved) ? saved : [];
}

async function writeResponses(env, responses) {
  await env.RSVPS.put(STORE_KEY, JSON.stringify(responses));
}

async function handleList(request, env) {
  const url = new URL(request.url);
  const responses = await readResponses(env);

  if (url.searchParams.get("format") === "csv") {
    return new Response(responsesToCsv(responses), {
      headers: {
        ...corsHeaders(request),
        "Content-Type": "text/csv;charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return jsonResponse(request, { responses });
}

async function readJsonBody(request) {
  const text = await request.text();
  return text ? JSON.parse(text) : {};
}

async function handleUpsert(request, env, response) {
  if (!response?.inviteeId) {
    return jsonResponse(request, { error: "Missing inviteeId." }, 400);
  }

  const responses = await readResponses(env);
  const index = responses.findIndex((savedResponse) => savedResponse.inviteeId === response.inviteeId);

  if (index >= 0) {
    responses[index] = response;
  } else {
    responses.push(response);
  }

  await writeResponses(env, responses);
  return jsonResponse(request, { ok: true, responses });
}

export class CallingCards {
  constructor(state) {
    this.sql = state.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS ballots (
        inviteeId TEXT PRIMARY KEY,
        dndHost TEXT NOT NULL DEFAULT '',
        drive TEXT NOT NULL,
        designatedDriver INTEGER NOT NULL DEFAULT 0,
        breakfast TEXT NOT NULL DEFAULT '',
        breakfastOrder TEXT NOT NULL DEFAULT '',
        bar TEXT NOT NULL,
        dinner TEXT NOT NULL,
        room TEXT NOT NULL DEFAULT '',
        seating TEXT NOT NULL DEFAULT '',
        car TEXT NOT NULL DEFAULT '',
        passengerSeats INTEGER,
        planSubmitted INTEGER NOT NULL DEFAULT 0
      )
    `);
    const columns = this.sql.exec("PRAGMA table_info(ballots)").toArray().map(({ name }) => name);
    for (const name of ["dndHost", "breakfast", "breakfastOrder", "room", "seating", "car", "plan", "walkBar", "walkRoom", "walkDinner"]) {
      if (!columns.includes(name)) this.sql.exec(`ALTER TABLE ballots ADD COLUMN ${name} TEXT NOT NULL DEFAULT ''`);
    }
    if (!columns.includes("passengerSeats")) this.sql.exec("ALTER TABLE ballots ADD COLUMN passengerSeats INTEGER");
    if (!columns.includes("designatedDriver")) this.sql.exec("ALTER TABLE ballots ADD COLUMN designatedDriver INTEGER NOT NULL DEFAULT 0");
    if (!columns.includes("planSubmitted")) this.sql.exec("ALTER TABLE ballots ADD COLUMN planSubmitted INTEGER NOT NULL DEFAULT 0");
  }

  async fetch(request) {
    if (request.method === "POST") {
      const { inviteeId, ...choices } = await request.json();
      const row = this.sql.exec(`SELECT ${ballotColumns} FROM ballots WHERE inviteeId = ?`, inviteeId).toArray()[0];
      const previous = row && currentBallot(row);
      if (Object.hasOwn(choices, "breakfastOrder") && (choices.breakfast ?? previous?.breakfast) !== "bubbas") {
        return Response.json({ error: "Choose Bubba’s Bagels before saving an order." }, { status: 409 });
      }
      if (choices.planSubmitted) {
        if (missingPlanChoices(previous).length) {
          return Response.json({ error: "Complete the required choices before submitting your plan vote." }, { status: 409 });
        }
        this.sql.exec("UPDATE ballots SET planSubmitted = 1 WHERE inviteeId = ?", inviteeId);
      } else {
        this.saveChoices(inviteeId, choices, previous);
      }
    }

    const rows = this.sql.exec(`SELECT ${ballotColumns} FROM ballots`).toArray();
    const ballots = rows.map((row) => {
      const card = currentBallot(row);
      const missing = missingPlanChoices(card);
      return { ...card, missingPlanChoices: missing, planSubmitted: card.planSubmitted && missing.length === 0 };
    });
    return Response.json({ ballots });
  }

  saveChoices(inviteeId, choices, previous) {
    const { dndHost, drive, designatedDriver, breakfast, bar, dinner, room, seating, car, passengerSeats } = choices;
    const driverVote = designatedDriver === undefined ? null : Number(designatedDriver);
    const breakfastOrder = choices.breakfastOrder?.trim();
    const changed = previous?.planSubmitted && Object.entries(choices).some(([field, value]) =>
      field !== "breakfastOrder" && field !== "dndHost" && field !== "designatedDriver" && previous[field] !== value
    );
    // Clear the former walking vote when its venue is updated.
    this.sql.exec(`
        INSERT INTO ballots (inviteeId, dndHost, drive, designatedDriver, breakfast, breakfastOrder, bar, dinner, room, seating, car, passengerSeats)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (inviteeId) DO UPDATE SET
          dndHost = COALESCE(?, ballots.dndHost),
          drive = COALESCE(?, ballots.drive),
          designatedDriver = COALESCE(?, ballots.designatedDriver),
          breakfast = COALESCE(?, ballots.breakfast),
          breakfastOrder = CASE WHEN ? IN ('', 'own') THEN '' ELSE COALESCE(?, ballots.breakfastOrder) END,
          bar = COALESCE(?, ballots.bar),
          dinner = COALESCE(?, ballots.dinner),
          room = COALESCE(?, ballots.room),
          seating = COALESCE(?, ballots.seating),
          car = COALESCE(?, ballots.car),
          walkBar = CASE WHEN ? IS NULL THEN ballots.walkBar ELSE '' END,
          walkRoom = CASE WHEN ? IS NULL THEN ballots.walkRoom ELSE '' END,
          walkDinner = CASE WHEN ? IS NULL THEN ballots.walkDinner ELSE '' END,
          passengerSeats = CASE WHEN ? = '' THEN NULL ELSE COALESCE(excluded.passengerSeats, ballots.passengerSeats) END,
          planSubmitted = CASE WHEN ? = 1 THEN 0 ELSE ballots.planSubmitted END
    `, inviteeId, dndHost ?? "", drive ?? "", driverVote ?? 0, breakfast ?? "", breakfastOrder ?? "", bar ?? "", dinner ?? "", room ?? "", seating ?? "", car ?? "", passengerSeats ?? null,
    dndHost ?? null, drive ?? null, driverVote, breakfast ?? null, breakfast ?? null, breakfastOrder ?? null,
    bar ?? null, dinner ?? null, room ?? null, seating ?? null, car ?? null,
    bar ?? null, room ?? null, dinner ?? null, car ?? null, changed ? 1 : 0);
  }
}

async function handleBallots(request, env, card) {
  if (request.method === "POST") {
    if (!voterIds.has(card?.inviteeId)) {
      return jsonResponse(request, { error: "Invalid calling card." }, 400);
    }

    const fields = Object.keys(card).filter((field) => field !== "inviteeId");
    if (!fields.length || fields.some((field) => !isValidChoice(field, card[field]))
      || (Object.hasOwn(card, "passengerSeats") && card.car !== "offer")
      || (Object.hasOwn(card, "planSubmitted") && fields.length !== 1)) {
      return jsonResponse(request, { error: "Invalid calling card." }, 400);
    }
  }

  if (!env.CALLING_CARDS) {
    return jsonResponse(request, { error: "Shared calling cards are unavailable." }, 503);
  }

  const ballotBox = env.CALLING_CARDS.getByName("saturday-2027-01-16");
  const result = await ballotBox.fetch("https://ballot-box.internal/", card && {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  return jsonResponse(request, await result.json(), result.status);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request) });
    }

    if (request.method === "GET") {
      const action = new URL(request.url).searchParams.get("action");
      if (action === "ballots") return handleBallots(request, env);
      return env.RSVPS ? handleList(request, env) : jsonResponse(request, { error: "Missing RSVPS KV binding." }, 500);
    }

    if (request.method !== "POST") {
      return jsonResponse(request, { error: "Method not allowed." }, 405);
    }

    let body;
    try {
      body = await readJsonBody(request);
    } catch {
      return jsonResponse(request, { error: "Invalid JSON." }, 400);
    }

    if (body?.action === "save-ballot") {
      return handleBallots(request, env, body.card);
    }

    if (body?.action === "upsert") {
      return env.RSVPS
        ? handleUpsert(request, env, body.response)
        : jsonResponse(request, { error: "Missing RSVPS KV binding." }, 500);
    }

    return jsonResponse(request, { error: "Unknown action." }, 400);
  },
};
