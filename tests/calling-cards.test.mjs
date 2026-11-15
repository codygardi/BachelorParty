import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import worker, { CallingCards } from "../cloudflare/rsvp-worker.js";

const endpoint = "https://test.example/?action=ballots";
const existing = { inviteeId: "cody-gardi", dndHost: "", drive: "volunteer", breakfast: "", bar: "snug", dinner: "wildwood" };

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
  return {
    read,
    async readVotes() {
      return (await read()).map(({ planSubmitted, missingPlanChoices, breakfastOrder, ...votes }) => votes);
    },
    save(card) {
      return worker.fetch(new Request(endpoint, {
        method: "POST",
        body: JSON.stringify({ action: "save-ballot", card }),
      }), env);
    },
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
  const newVotes = { dndHost: "host", room: "enchambered", seating: "preferred", car: "offer", passengerSeats: 3 };
  assert.equal((await api.save({ inviteeId: existing.inviteeId, ...newVotes })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...existing, ...newVotes }]);
});

test("a rider can save or withdraw a car and its passenger seats independently of other votes", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const rider = { ...existing, drive: "rider" };
  assert.equal((await api.save(rider)).status, 200);
  const inviteeId = existing.inviteeId;
  const responses = await Promise.all([
    api.save({ inviteeId, room: "paniq" }),
    api.save({ inviteeId, seating: "general" }),
    api.save({ inviteeId, car: "offer" }),
  ]);
  for (const response of responses) assert.equal(response.status, 200);
  const withOffer = { ...rider, car: "offer", seating: "general", passengerSeats: 3 };
  assert.deepEqual(await api.readVotes(), [{ ...withOffer, room: "paniq", passengerSeats: null }]);
  assert.equal((await api.save({ inviteeId, car: "offer", passengerSeats: 0 })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...withOffer, room: "paniq", passengerSeats: 0 }]);
  assert.equal((await api.save({ inviteeId, car: "offer", passengerSeats: 3 })).status, 200);
  assert.equal((await api.save({ inviteeId, car: "offer" })).status, 200);

  for (const room of ["paniq", "enchambered"]) {
    assert.equal((await api.save({ inviteeId, room })).status, 200);
    assert.deepEqual(await api.readVotes(), [{ ...withOffer, room }]);
  }
  assert.equal((await api.save({ inviteeId, room: "invalid", seating: "preferred" })).status, 400);
  assert.equal((await api.save({ inviteeId, seating: "vip" })).status, 400);
  assert.equal((await api.save({ inviteeId, car: "invalid", drive: "volunteer" })).status, 400);
  for (const passengerSeats of [-1, 8, 2.5, "3"]) {
    assert.equal((await api.save({ inviteeId, car: "offer", passengerSeats })).status, 400);
  }
  assert.equal((await api.save({ inviteeId, passengerSeats: 4 })).status, 400);
  assert.equal((await api.save({ inviteeId, car: "", passengerSeats: 4 })).status, 400);
  assert.deepEqual(await api.readVotes(), [{ ...withOffer, room: "enchambered" }]);

  assert.equal((await api.save({ inviteeId, car: "" })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...withOffer, room: "enchambered", car: "", passengerSeats: null }]);

  assert.equal((await api.save({ inviteeId, seating: "" })).status, 200);
  assert.deepEqual(await api.readVotes(), [{ ...rider, room: "enchambered", seating: "", car: "", passengerSeats: null }]);
  assert.equal((await api.save({ inviteeId, room: "" })).status, 200);
  assert.deepEqual(await api.readVotes(), [{ ...rider, room: "", seating: "", car: "", passengerSeats: null }]);
});

test("the shared ballot carries forward eligible votes from both former plans", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  const card = { ...existing, seating: "preferred", car: "offer", passengerSeats: 3 };
  assert.equal((await api.save(card)).status, 200);
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
  assert.equal((await api.save({ inviteeId, room: "", bar: "shady-lady" })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...merged, room: "", bar: "shady-lady" }]);

  const guest = { inviteeId: "robbie-merchant", bar: "maple-room", room: "paniq", dinner: "tapa-the-world" };
  assert.equal((await api.save(guest)).status, 200);
  const saved = (await connect(db).readVotes()).find((row) => row.inviteeId === guest.inviteeId);
  assert.deepEqual(saved, { ...guest, dndHost: "", drive: "", breakfast: "", seating: "", car: "", passengerSeats: null });
});

test("removed venues stay on existing ballots until the voter chooses again", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  assert.equal((await api.save(existing)).status, 200);
  db.prepare("UPDATE ballots SET bar = '', walkBar = 'fieldhouse', room = 'seance', dinner = 'petes-arden' WHERE inviteeId = ?").run(inviteeId);
  const retired = { bar: "fieldhouse", room: "seance", dinner: "petes-arden" };
  assert.equal((await api.save({ inviteeId, seating: "general" })).status, 200);
  const card = { ...existing, ...retired, seating: "general", car: "", passengerSeats: null };
  assert.deepEqual(await connect(db).readVotes(), [card]);

  for (const [field, choice] of Object.entries({ ...retired, plan: "walk", walkBar: "maple-room" })) {
    assert.equal((await api.save({ inviteeId, [field]: choice, seating: "preferred" })).status, 400);
  }
  assert.deepEqual(await api.readVotes(), [card]);
  const replacements = { bar: "maple-room", room: "enchambered", dinner: "thai-terrace" };
  assert.equal((await api.save({ inviteeId, ...replacements })).status, 200);
  assert.deepEqual(await connect(db).readVotes(), [{ ...card, ...replacements }]);
});

test("plan submission requires saved venue votes, transportation, and capacity for a car offer", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  const submit = { inviteeId, planSubmitted: true };
  assert.equal((await api.save(submit)).status, 409);
  assert.deepEqual(await api.read(), []);
  assert.equal((await api.save({ ...submit, bar: "snug" })).status, 400);

  const votes = { breakfast: "bubbas", bar: "snug", room: "paniq", dinner: "wildwood", seating: "general" };
  for (const [field, choice] of Object.entries(votes)) {
    assert.equal((await api.save({ inviteeId, [field]: choice })).status, 200);
    assert.equal((await api.save(submit)).status, 409);
  }

  assert.equal((await api.save({ inviteeId, drive: "volunteer" })).status, 200);
  assert.deepEqual((await api.read())[0].missingPlanChoices, ["transport"]);
  assert.equal((await api.save(submit)).status, 409);
  assert.equal((await api.save({ inviteeId, drive: "volunteer", car: "offer" })).status, 200);
  assert.deepEqual((await api.read())[0].missingPlanChoices, ["passengerSeats"]);
  assert.equal((await api.save(submit)).status, 409);
  assert.equal((await api.save({ inviteeId, car: "offer", passengerSeats: 4 })).status, 200);

  for (const [field, choice] of Object.entries(votes)) {
    assert.equal((await api.save({ inviteeId, [field]: "" })).status, 200);
    assert.deepEqual((await api.read())[0].missingPlanChoices, [field]);
    assert.equal((await api.save(submit)).status, 409);
    assert.equal((await api.save({ inviteeId, [field]: choice })).status, 200);
  }

  assert.equal((await api.save(submit)).status, 200);
  assert.equal((await connect(db).read())[0].planSubmitted, true);
  assert.equal((await api.save({ inviteeId, bar: "snug" })).status, 200);
  assert.equal((await api.read())[0].planSubmitted, true, "Retrying the same vote keeps the submission");

  assert.equal((await api.save({ inviteeId, seating: "preferred" })).status, 200);
  assert.equal((await api.read())[0].planSubmitted, false);
  assert.equal((await api.save(submit)).status, 200);
  assert.equal((await api.save({ inviteeId, drive: "rider", car: "" })).status, 200);
  const [rider] = await api.read();
  assert.equal(rider.passengerSeats, null);
  assert.equal(rider.planSubmitted, false);
  assert.deepEqual(rider.missingPlanChoices, []);
  assert.equal((await api.save(submit)).status, 200);

  assert.equal((await api.save({ inviteeId, dinner: "" })).status, 200);
  assert.equal((await api.read())[0].planSubmitted, false);
  assert.equal((await api.save(submit)).status, 409);
});

test("an existing plan with no breakfast choice needs a poll response", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  const oldVotes = { ...existing, drive: "rider", room: "paniq", seating: "general" };
  assert.equal((await api.save(oldVotes)).status, 200);
  db.prepare("UPDATE ballots SET planSubmitted = 1 WHERE inviteeId = ?").run(inviteeId);
  const [before] = await connect(db).read();
  assert.equal(before.planSubmitted, false);
  assert.deepEqual(before.missingPlanChoices, ["breakfast"]);
  assert.equal((await api.save({ inviteeId, breakfast: "another-shop" })).status, 400);
  assert.equal((await api.save({ inviteeId, breakfast: "own" })).status, 200);
  assert.deepEqual(await api.readVotes(), [{ ...oldVotes, breakfast: "own", car: "", passengerSeats: null }]);
  assert.equal((await api.save({ inviteeId, planSubmitted: true })).status, 200);
  assert.equal((await connect(db).read())[0].planSubmitted, true);
});

test("Bubba’s orders are per guest and editing an order preserves the plan vote", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const inviteeId = existing.inviteeId;
  const breakfastOrder = "1 everything bagel, toasted\nScallion cream cheese";
  assert.equal((await api.save({ inviteeId, breakfastOrder })).status, 409);
  assert.deepEqual(await api.read(), []);

  const votes = { ...existing, drive: "rider", breakfast: "bubbas", room: "paniq", seating: "general" };
  assert.equal((await api.save(votes)).status, 200);
  assert.equal((await api.save({ inviteeId, planSubmitted: true })).status, 200);
  const [submitted] = await api.read();
  assert.equal(submitted.breakfastOrder, "");
  for (const invalid of [42, "x".repeat(401)]) {
    assert.equal((await api.save({ inviteeId, breakfastOrder: invalid })).status, 400);
  }

  assert.equal((await api.save({ inviteeId, breakfastOrder: `  ${breakfastOrder}  ` })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...submitted, breakfastOrder }]);
  assert.equal((await api.save({ inviteeId, breakfast: "own" })).status, 200);
  assert.equal((await api.save({ inviteeId, breakfastOrder })).status, 409);
  assert.deepEqual(await connect(db).read(), [{ ...submitted, breakfast: "own", breakfastOrder: "", planSubmitted: false }]);
});

test("Friday hosting votes save, change, and clear independently of Saturday votes", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  const { inviteeId } = existing;
  assert.equal((await api.save({ inviteeId, dndHost: "maybe" })).status, 400);
  assert.deepEqual(await api.read(), []);
  assert.equal((await api.save({ inviteeId, dndHost: "host" })).status, 200);
  assert.equal((await connect(db).read())[0].dndHost, "host");

  const saturday = { inviteeId, drive: "rider", breakfast: "own", bar: "snug", room: "paniq", dinner: "wildwood", seating: "general" };
  assert.equal((await api.save(saturday)).status, 200);
  assert.equal((await api.save({ inviteeId, planSubmitted: true })).status, 200);
  const [submitted] = await api.read();
  assert.equal(submitted.dndHost, "host");
  assert.equal(submitted.planSubmitted, true);
  for (const dndHost of ["cant-host", ""]) {
    assert.equal((await api.save({ inviteeId, dndHost })).status, 200);
    assert.deepEqual(await connect(db).read(), [{ ...submitted, dndHost }]);
  }
});
