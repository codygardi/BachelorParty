const STORE_KEY = "bachelor-party-rsvp-responses";

const voterIds = new Set([
  "robbie-merchant", "max-voorhees", "thomas-correll", "jonno-christie",
  "lane-carleson", "sean-fitzhenry", "andrew-kostolefsky", "cody-gardi",
]);
const driveChoices = new Set(["volunteer", "rider"]);
const barChoices = new Set(["", "snug", "omallys", "cabin", "shady-lady", "finnegans", "bookstore", "trapcat"]);
const dinnerChoices = new Set(["", "petes-arden", "thai-terrace", "wildwood", "tapa-the-world"]);
const ballotChoices = { drive: driveChoices, bar: barChoices, dinner: dinnerChoices };

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
        drive TEXT NOT NULL,
        bar TEXT NOT NULL,
        dinner TEXT NOT NULL
      )
    `);
  }

  async fetch(request) {
    if (request.method === "POST") {
      const { inviteeId, drive, bar, dinner } = await request.json();
      this.sql.exec(`
        INSERT INTO ballots (inviteeId, drive, bar, dinner) VALUES (?, ?, ?, ?)
        ON CONFLICT (inviteeId) DO UPDATE SET
          drive = COALESCE(?, ballots.drive),
          bar = COALESCE(?, ballots.bar),
          dinner = COALESCE(?, ballots.dinner)
      `, inviteeId, drive ?? "", bar ?? "", dinner ?? "", drive ?? null, bar ?? null, dinner ?? null);
    }

    const ballots = this.sql.exec("SELECT inviteeId, drive, bar, dinner FROM ballots").toArray();
    return Response.json({ ballots });
  }
}

async function handleBallots(request, env, card) {
  if (request.method === "POST") {
    if (!voterIds.has(card?.inviteeId)) {
      return jsonResponse(request, { error: "Invalid calling card." }, 400);
    }

    const fields = Object.keys(card).filter((field) => field !== "inviteeId");
    if (!fields.length || fields.some((field) =>
      !Object.hasOwn(ballotChoices, field) || !ballotChoices[field].has(card[field])
    )) {
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
