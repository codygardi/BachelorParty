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

test("the existing ballots table keeps all votes when adding room and seating columns", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  db.exec(`CREATE TABLE ballots (
    inviteeId TEXT PRIMARY KEY, drive TEXT NOT NULL, bar TEXT NOT NULL, dinner TEXT NOT NULL
  )`);
  db.prepare("INSERT INTO ballots VALUES (?, ?, ?, ?)").run(existing.inviteeId, existing.drive, existing.bar, existing.dinner);

  const api = connect(db);
  assert.deepEqual(await api.read(), [{ ...existing, room: "", seating: "" }]);
  const newVotes = { room: "skull-witch", seating: "preferred" };
  assert.equal((await api.save({ inviteeId: existing.inviteeId, ...newVotes })).status, 200);
  assert.deepEqual(await connect(db).read(), [{ ...existing, ...newVotes }]);
});

test("room and seating ballots can be edited independently and cleared", async (t) => {
  const db = new DatabaseSync(":memory:");
  t.after(() => db.close());
  const api = connect(db);
  assert.equal((await api.save(existing)).status, 200);
  const inviteeId = existing.inviteeId;
  const responses = await Promise.all([
    api.save({ inviteeId, room: "fortunes-favor" }),
    api.save({ inviteeId, seating: "general" }),
  ]);
  for (const response of responses) assert.equal(response.status, 200);
  assert.deepEqual(await api.read(), [{ ...existing, room: "fortunes-favor", seating: "general" }]);

  for (const room of ["seance", "pirates-of-tortuga", "skull-witch"]) {
    assert.equal((await api.save({ inviteeId, room })).status, 200);
  }
  assert.equal((await api.save({ inviteeId, room: "invalid", seating: "preferred" })).status, 400);
  assert.equal((await api.save({ inviteeId, seating: "vip" })).status, 400);
  assert.deepEqual(await api.read(), [{ ...existing, room: "skull-witch", seating: "general" }]);

  assert.equal((await api.save({ inviteeId, seating: "" })).status, 200);
  assert.deepEqual(await api.read(), [{ ...existing, room: "skull-witch", seating: "" }]);
  assert.equal((await api.save({ inviteeId, room: "" })).status, 200);
  assert.deepEqual(await api.read(), [{ ...existing, room: "", seating: "" }]);
});
