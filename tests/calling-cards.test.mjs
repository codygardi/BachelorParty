import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import worker, { CallingCards } from "../cloudflare/rsvp-worker.js";

const endpoint = "https://test.example/?action=ballots";
const existing = { inviteeId: "cody-gardi", dndHost: "", drive: "volunteer", designatedDriver: false, breakfast: "", bar: "snug", dinner: "wildwood" };
const complete = { ...existing, dndHost: "host", drive: "rider", breakfast: "own", room: "paniq", seating: "general", car: "" };

function connect(db) {
  const box = new CallingCards({
    storage: {
      sql: {
        exec(sql, ...params) {
          const rows = db.prepare(sql).all(...params);
          return { toArray: () => rows };
        },
      },
    },
  });
  const env = { CALLING_CARDS: { getByName: () => ({ fetch: (url, init) => box.fetch(new Request(url, init)) }) } };
  async function read() {
    const response = await worker.fetch(new Request(endpoint), env);
    assert.equal(response.status, 200);
    return (await response.json()).ballots;
  }
  function save(card) {
    return worker.fetch(new Request(endpoint, {
      method: "POST",
      body: JSON.stringify({ action: "save-ballot", card }),
    }), env);
  }
  return {
    read,
    async readVotes() {
      return (await read()).map(({ planSubmitted, missingPlanChoices, breakfastOrder, ...votes }) => votes);
    },
    save,
    submit: (card) => save({ ...card, planSubmitted: true }),
  };
}

test("the existing ballots table keeps all votes when adding ballot columns", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec(`CREATE TABLE ballots (
    inviteeId TEXT PRIMARY KEY, drive TEXT NOT NULL, bar TEXT NOT NULL, dinner TEXT NOT NULL
  )`);
  db.prepare("INSERT INTO ballots VALUES (?, ?, ?, ?)").run(existing.inviteeId, existing.drive, existing.bar, existing.dinner);

  const api = connect(db);
  assert.deepEqual(await api.readVotes(), [{ ...existing, room: "", seating: "", car: "", passengerSeats: null }]);
  const newVotes = { dndHost: "host", breakfast: "own", room: "enchambered", seating: "preferred", car: "offer", passengerSeats: 3 };
  assert.equal((await api.submit({ inviteeId: existing.inviteeId, ...newVotes })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...existing, ...newVotes }]);
});

test("car and legacy passenger seat edits preserve the other submitted votes", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const rider = { ...complete, room: "enchambered", seating: "preferred" };
  assert.equal((await api.submit(rider)).status, 200);
  const inviteeId = existing.inviteeId;
  const responses = await Promise.all([
    api.submit({ inviteeId, room: "paniq" }),
    api.submit({ inviteeId, seating: "general" }),
    api.submit({ inviteeId, car: "offer" }),
  ]);
  for (const response of responses) assert.equal(response.status, 200);
  const withOffer = { ...rider, car: "offer", seating: "general", passengerSeats: 3 };
  assert.deepEqual(await api.readVotes(), [{ ...withOffer, room: "paniq", passengerSeats: null }]);
  assert.equal((await api.submit({ inviteeId, car: "offer", passengerSeats: 0 })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...withOffer, room: "paniq", passengerSeats: 0 }]);
  assert.equal((await api.submit({ inviteeId, car: "offer", passengerSeats: 3 })).status, 200);
  assert.equal((await api.submit({ inviteeId, car: "offer" })).status, 200);

  for (const room of ["paniq", "enchambered"]) {
    assert.equal((await api.submit({ inviteeId, room })).status, 200);
    assert.deepEqual(await api.readVotes(), [{ ...withOffer, room }]);
  }
  assert.equal((await api.submit({ inviteeId, room: "invalid", seating: "preferred" })).status, 400);
  assert.equal((await api.submit({ inviteeId, seating: "vip" })).status, 400);
  assert.equal((await api.submit({ inviteeId, car: "invalid", drive: "volunteer" })).status, 400);
  for (const passengerSeats of [-1, 8, 2.5, "3"]) {
    assert.equal((await api.submit({ inviteeId, car: "offer", passengerSeats })).status, 400);
  }
  assert.equal((await api.submit({ inviteeId, passengerSeats: 4 })).status, 400);
  assert.equal((await api.submit({ inviteeId, car: "", passengerSeats: 4 })).status, 400);
  assert.deepEqual(await api.readVotes(), [{ ...withOffer, room: "enchambered" }]);

  assert.equal((await api.submit({ inviteeId, car: "" })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...withOffer, room: "enchambered", car: "", passengerSeats: null }]);
});

test("the shared ballot carries forward eligible votes from both former plans", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  const card = { ...complete, drive: "volunteer", seating: "preferred", car: "offer", passengerSeats: 3 };
  assert.equal((await api.submit(card)).status, 200);
  db.prepare(`
    UPDATE ballots
    SET plan = 'walk', room = 'pirates-of-tortuga', walkRoom = 'the-collection',
        walkBar = 'maple-room', walkDinner = 'petes-arden'
    WHERE inviteeId = ?
  `).run(inviteeId);
  const merged = { ...card, bar: "maple-room", room: "enchambered" };
  assert.deepEqual(await connect(db).readVotes(), [merged]);

  db.prepare("UPDATE ballots SET plan = 'drive' WHERE inviteeId = ?").run(inviteeId);
  assert.deepEqual(await api.readVotes(), [{ ...card, room: "paniq" }]);
  db.prepare("UPDATE ballots SET plan = 'walk' WHERE inviteeId = ?").run(inviteeId);
  assert.equal((await api.submit({ inviteeId, room: "paniq", bar: "shady-lady" })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...merged, room: "paniq", bar: "shady-lady" }]);

  const guest = { ...complete, inviteeId: "robbie-merchant", bar: "maple-room", room: "paniq", dinner: "tapa-the-world" };
  assert.equal((await api.submit(guest)).status, 200);
  const saved = (await connect(db).readVotes()).find((row) => row.inviteeId === guest.inviteeId);
  assert.deepEqual(saved, { ...guest, passengerSeats: null });
});

test("removed venues stay on existing ballots until the voter chooses again", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  assert.equal((await api.submit(complete)).status, 200);
  db.prepare("UPDATE ballots SET bar = '', walkBar = 'fieldhouse', room = 'seance', dinner = 'la-porta' WHERE inviteeId = ?").run(inviteeId);
  const retired = { bar: "fieldhouse", room: "seance", dinner: "la-porta" };
  assert.equal((await api.submit({ inviteeId, seating: "preferred" })).status, 409);
  const card = { ...complete, ...retired, passengerSeats: null };
  assert.deepEqual(await connect(db).readVotes(), [card]);

  for (const [field, choice] of Object.entries({ ...retired, plan: "walk", walkBar: "maple-room" })) {
    assert.equal((await api.submit({ inviteeId, [field]: choice, seating: "preferred" })).status, 400);
  }
  assert.deepEqual(await api.readVotes(), [card]);
  const replacements = { bar: "maple-room", room: "enchambered", dinner: "thai-terrace" };
  assert.equal((await api.submit({ inviteeId, ...replacements })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...card, ...replacements }]);
});

test("only submitting a complete ballot saves its votes", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const { inviteeId } = complete;
  const votes = { ...complete, drive: "volunteer", car: "offer", breakfast: "bubbas" };
  assert.equal((await api.save(votes)).status, 409);
  assert.equal((await api.submit({ inviteeId })).status, 409);
  const required = ["dndHost", "breakfast", "bar", "room", "dinner", "seating"];
  for (const field of [...required, "drive", "car"]) {
    const partial = { ...votes };
    delete partial[field];
    assert.equal((await api.submit(partial)).status, 409, `Missing ${field} must block submission`);
    assert.deepEqual(await api.read(), []);
  }

  assert.equal((await api.submit(votes)).status, 200);
  const submitted = { ...votes, breakfastOrder: "", passengerSeats: null, planSubmitted: true, missingPlanChoices: [] };
  assert.deepEqual(await connect(db).read(), [submitted]);
  for (const field of required) {
    assert.equal((await api.submit({ inviteeId, [field]: "" })).status, 409);
  }
  assert.equal((await api.save({ inviteeId, seating: "preferred" })).status, 409);
  assert.deepEqual(await api.read(), [submitted]);
  assert.equal((await api.submit(votes)).status, 200);
  assert.deepEqual(await api.read(), [submitted], "Retrying the same submission keeps one complete ballot");

  assert.equal((await api.submit({ inviteeId, car: "offer", passengerSeats: 4 })).status, 200);
  assert.equal((await api.submit({ inviteeId, drive: "rider", car: "" })).status, 200);
  const [rider] = await api.read();
  assert.deepEqual(rider, { ...submitted, drive: "rider", car: "" });
});

test("an existing plan with no breakfast choice needs a poll response", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  const oldVotes = { ...complete, dndHost: "cant-host" };
  assert.equal((await api.submit(oldVotes)).status, 200);
  db.prepare("UPDATE ballots SET breakfast = '' WHERE inviteeId = ?").run(inviteeId);
  const [before] = await connect(db).read();
  assert.equal(before.planSubmitted, false);
  assert.deepEqual(before.missingPlanChoices, ["breakfast"]);
  assert.equal((await api.submit({ inviteeId, breakfast: "another-shop" })).status, 400);
  assert.equal((await api.submit({ inviteeId, breakfast: "own" })).status, 200);
  assert.deepEqual(await api.readVotes(), [{ ...oldVotes, passengerSeats: null }]);
  assert.equal((await connect(db).read())[0].planSubmitted, true);
});

test("Bubba’s orders save with the submitted breakfast choice", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  const breakfastOrder = "1 everything bagel, toasted\nScallion cream cheese";
  assert.equal((await api.submit({ inviteeId, breakfastOrder })).status, 409);
  assert.deepEqual(await api.read(), []);

  const votes = { ...complete, breakfast: "bubbas", breakfastOrder: `  ${breakfastOrder}  ` };
  assert.equal((await api.submit(votes)).status, 200);
  const [submitted] = await api.read();
  assert.equal(submitted.breakfastOrder, breakfastOrder);
  for (const invalid of [42, "x".repeat(401)]) {
    assert.equal((await api.submit({ inviteeId, breakfastOrder: invalid })).status, 400);
  }

  assert.equal((await api.save({ inviteeId, breakfastOrder: "Plain bagel" })).status, 409);
  assert.deepEqual(await api.read(), [submitted]);
  assert.equal((await api.submit({ inviteeId, breakfastOrder: "Plain bagel" })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...submitted, breakfastOrder: "Plain bagel" }]);
  assert.equal((await api.submit({ inviteeId, breakfast: "own", breakfastOrder })).status, 409);
  assert.equal((await api.submit({ inviteeId, breakfast: "own" })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...submitted, breakfast: "own", breakfastOrder: "" }]);
});

test("a complete legacy autosave can be submitted directly and edited afterward", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const { inviteeId } = existing;
  assert.equal((await api.submit({ inviteeId, dndHost: "maybe" })).status, 400);
  assert.deepEqual(await api.read(), []);

  assert.equal((await api.submit(complete)).status, 200);
  db.prepare("UPDATE ballots SET planSubmitted = 0 WHERE inviteeId = ?").run(inviteeId);
  assert.equal((await api.read())[0].planSubmitted, false);
  assert.equal((await api.submit({ inviteeId })).status, 200);
  const [submitted] = await api.read();
  assert.equal(submitted.dndHost, "host");
  assert.equal(submitted.planSubmitted, true);

  assert.equal((await api.submit({ inviteeId, dndHost: "cant-host" })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...submitted, dndHost: "cant-host" }]);
});

test("guests can check and uncheck designated driver independently of their ride choice", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const { inviteeId } = existing;
  for (const designatedDriver of ["true", 1, null]) {
    assert.equal((await api.submit({ inviteeId, designatedDriver })).status, 400);
  }
  assert.equal((await api.submit({ inviteeId, designatedDriver: true })).status, 409);
  assert.deepEqual(await api.read(), []);

  const votes = { ...complete, drive: "volunteer", car: "offer", passengerSeats: 3, designatedDriver: true };
  assert.equal((await api.submit(votes)).status, 200);
  const [submitted] = await api.read();
  assert.equal(submitted.designatedDriver, true);
  assert.equal(submitted.planSubmitted, true);
  assert.equal((await api.submit({ inviteeId, designatedDriver: false })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...submitted, designatedDriver: false }]);
});
