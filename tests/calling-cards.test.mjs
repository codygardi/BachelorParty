import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";
import worker, { CallingCards } from "../cloudflare/rsvp-worker.js";

const endpoint = "https://test.example/?action=ballots";
const existing = { inviteeId: "cody-gardi", drive: "volunteer", bar: "snug", dinner: "wildwood" };

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
  return {
    async read() {
      const response = await worker.fetch(new Request(endpoint), env);
      assert.equal(response.status, 200);
      return (await response.json()).ballots;
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
  assert.deepEqual(await api.read(), [{ ...existing, room: "", seating: "", car: "", passengerSeats: null }]);
  const newVotes = { room: "enchambered", seating: "preferred", car: "offer", passengerSeats: 3 };
  assert.equal((await api.save({ inviteeId: existing.inviteeId, ...newVotes })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...existing, ...newVotes }]);
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
  assert.deepEqual(await api.read(), [{ ...withOffer, room: "paniq", passengerSeats: null }]);
  assert.equal((await api.save({ inviteeId, car: "offer", passengerSeats: 0 })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...withOffer, room: "paniq", passengerSeats: 0 }]);
  assert.equal((await api.save({ inviteeId, car: "offer", passengerSeats: 3 })).status, 200);
  assert.equal((await api.save({ inviteeId, car: "offer" })).status, 200);

  for (const room of ["paniq", "enchambered"]) {
    assert.equal((await api.save({ inviteeId, room })).status, 200);
    assert.deepEqual(await api.read(), [{ ...withOffer, room }]);
  }
  assert.equal((await api.save({ inviteeId, room: "invalid", seating: "preferred" })).status, 400);
  assert.equal((await api.save({ inviteeId, seating: "vip" })).status, 400);
  assert.equal((await api.save({ inviteeId, car: "invalid", drive: "volunteer" })).status, 400);
  for (const passengerSeats of [-1, 8, 2.5, "3"]) {
    assert.equal((await api.save({ inviteeId, car: "offer", passengerSeats })).status, 400);
  }
  assert.equal((await api.save({ inviteeId, passengerSeats: 4 })).status, 400);
  assert.equal((await api.save({ inviteeId, car: "", passengerSeats: 4 })).status, 400);
  assert.deepEqual(await api.read(), [{ ...withOffer, room: "enchambered" }]);

  assert.equal((await api.save({ inviteeId, car: "" })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...withOffer, room: "enchambered", car: "", passengerSeats: null }]);

  assert.equal((await api.save({ inviteeId, seating: "" })).status, 200);
  assert.deepEqual(await api.read(), [{ ...rider, room: "enchambered", seating: "", car: "", passengerSeats: null }]);
  assert.equal((await api.save({ inviteeId, room: "" })).status, 200);
  assert.deepEqual(await api.read(), [{ ...rider, room: "", seating: "", car: "", passengerSeats: null }]);
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
  assert.deepEqual(await connect(db).read(), [merged]);

  db.prepare("UPDATE ballots SET plan = 'drive' WHERE inviteeId = ?").run(inviteeId);
  assert.deepEqual(await api.read(), [{ ...card, room: "paniq" }]);
  db.prepare("UPDATE ballots SET plan = 'walk' WHERE inviteeId = ?").run(inviteeId);
  assert.equal((await api.save({ inviteeId, room: "", bar: "shady-lady" })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...merged, room: "", bar: "shady-lady" }]);

  const guest = { inviteeId: "robbie-merchant", bar: "maple-room", room: "paniq", dinner: "tapa-the-world" };
  assert.equal((await api.save(guest)).status, 200);
  const saved = (await connect(db).read()).find((row) => row.inviteeId === guest.inviteeId);
  assert.deepEqual(saved, { ...guest, drive: "", seating: "", car: "", passengerSeats: null });
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
  assert.deepEqual(await connect(db).read(), [card]);

  for (const [field, choice] of Object.entries({ ...retired, plan: "walk", walkBar: "maple-room" })) {
    assert.equal((await api.save({ inviteeId, [field]: choice, seating: "preferred" })).status, 400);
  }
  assert.deepEqual(await api.read(), [card]);
  const replacements = { bar: "maple-room", room: "enchambered", dinner: "thai-terrace" };
  assert.equal((await api.save({ inviteeId, ...replacements })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...card, ...replacements }]);
});
