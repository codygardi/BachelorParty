const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "bachelor-party.js"), "utf8");
const context = vm.createContext({
  console,
  document: {
    addEventListener() {},
    querySelector() {
      return null;
    },
  },
  URL,
  window: {
    BACHELOR_PARTY_RSVP_CONFIG: {},
    location: { href: "https://example.test/" },
  },
});

vm.runInContext(source, context);

const invitees = vm.runInContext("invitees.map(({ id, name, phone }) => ({ id, name, phone }))", context);
const weekends = vm.runInContext(
  "weekendOptions.filter(({ value }) => value !== unavailableWeekend).map(({ value }) => value)",
  context,
);
const unavailable = vm.runInContext("unavailableWeekend", context);

function makeResponse(invitee, status, availability) {
  return {
    inviteeId: invitee.id,
    name: invitee.name,
    phone: invitee.phone,
    status,
    availability,
    notes: "",
    submittedAt: "2026-07-19T00:00:00.000Z",
    updatedAt: "2026-07-19T00:00:00.000Z",
  };
}

function getDecision(responseList) {
  const responseMap = Object.fromEntries(responseList.map((response) => [response.inviteeId, response]));
  context.__testResponses = responseMap;
  vm.runInContext("responses = __testResponses", context);
  return vm.runInContext("getWeekendDecision()", context);
}

const sixResponses = invitees
  .slice(0, 6)
  .map((invitee) => makeResponse(invitee, "Yes, I am in", [weekends[1]]));
assert.equal(getDecision(sixResponses).isFinalized, false, "six responses must not finalize the weekend");
assert.equal(getDecision(sixResponses).visibleWeekends.length, 3, "all choices stay visible before finalization");

const uniqueWinnerResponses = invitees.map((invitee, index) =>
  makeResponse(invitee, "Yes, I am in", index < 6 ? [weekends[0], weekends[1]] : [weekends[1]]),
);
const uniqueWinnerDecision = getDecision(uniqueWinnerResponses);
assert.equal(uniqueWinnerDecision.isFinalized, true, "seven unanimous yes responses should finalize a unique weekend");
assert.equal(uniqueWinnerDecision.finalizedWeekend.value, weekends[1]);
assert.deepEqual(
  Array.from(uniqueWinnerDecision.visibleWeekends, (weekend) => weekend.value),
  [weekends[1]],
  "only the winning weekend remains visible after finalization",
);

const declinedResponses = uniqueWinnerResponses.map((response, index) =>
  index === 6 ? { ...response, status: "No, I cannot make it" } : response,
);
assert.equal(getDecision(declinedResponses).isFinalized, false, "a declined RSVP must keep roll call open");
assert.equal(getDecision(declinedResponses).hasDeclined, true);
assert.equal(getDecision(declinedResponses).visibleWeekends.length, 3);

const unavailableResponses = uniqueWinnerResponses.map((response, index) =>
  index === 6 ? { ...response, availability: [unavailable] } : response,
);
assert.equal(getDecision(unavailableResponses).isFinalized, false, "a reroll vote must keep roll call open");
assert.equal(getDecision(unavailableResponses).needsAnotherDateOption, true);
assert.equal(getDecision(unavailableResponses).visibleWeekends.length, 3);

const noOverlapResponses = invitees.map((invitee, index) =>
  makeResponse(invitee, "Yes, I am in", [weekends[index % weekends.length]]),
);
assert.equal(getDecision(noOverlapResponses).isFinalized, false, "no unanimous weekend must not finalize");

const tiedResponses = invitees.map((invitee) =>
  makeResponse(invitee, "Yes, I am in", [weekends[0], weekends[1]]),
);
assert.equal(getDecision(tiedResponses).isFinalized, false, "multiple unanimous weekends are not a unique best date");

console.log("weekend decision tests passed");
