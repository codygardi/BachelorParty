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

const onePersonTotal = vm.runInContext(
  `(() => {
    const costs = tripDetails.find(({ kind }) => kind === "itinerary").body.prep
      .find(({ kind }) => kind === "costs").items;
    return formatCostRange(sumCostRanges(costs, "onePerson"));
  })()`,
  context,
);
assert.equal(onePersonTotal, "$61.99–$119.99", "the one-person subtotal must stay accurate");

const costsAreOnePersonOnly = vm.runInContext(
  `tripDetails.find(({ kind }) => kind === "itinerary").body.prep
    .find(({ kind }) => kind === "costs").items
    .every((item) => !("eightPeople" in item) && !("alcohol" in item) && !("detail" in item) && !("links" in item))`,
  context,
);
assert.equal(costsAreOnePersonOnly, true, "cost rows must stay one-person-only and alcohol-free");

const saturdayTitles = vm.runInContext(
  `JSON.stringify(tripDetails.find(({ kind }) => kind === "itinerary").body.days
    .find(({ day }) => day === "Saturday").items.map(({ title }) => title))`,
  context,
);
assert.deepEqual(JSON.parse(saturdayTitles), [
  "Late breakfast at Bubba's Bagels",
  "Head to Sacramento",
  "Pete's Arden bar",
  "Enchambered escape room",
  "Dinner at The Butterscotch Den",
  "Punch Line Comedy Club",
  "Return to Grass Valley",
]);

const itineraryDetailsOnly = vm.runInContext(
  `tripDetails.find(({ kind }) => kind === "itinerary").body.days
    .flatMap(({ items }) => items)
    .every((item) => !("detail" in item) && !("price" in item))`,
  context,
);
assert.equal(itineraryDetailsOnly, true, "Friday and Saturday cards should contain no sub-descriptions or prices");

const itineraryLinkGroups = vm.runInContext(
  `JSON.stringify(tripDetails.find(({ kind }) => kind === "itinerary").body.days
    .flatMap(({ items }) => items)
    .filter(({ links }) => links)
    .map(({ title, links }) => ({ title, links: links.map(({ label }) => label) })))`,
  context,
);
assert.deepEqual(JSON.parse(itineraryLinkGroups), [
  { title: "Grass Valley Brewing Co.", links: ["Location", "Menu"] },
  { title: "Late breakfast at Bubba's Bagels", links: ["Location", "Menu"] },
  { title: "Head to Sacramento", links: ["Route"] },
  { title: "Pete's Arden bar", links: ["Location", "Menu"] },
  { title: "Enchambered escape room", links: ["Location", "Book"] },
  { title: "Dinner at The Butterscotch Den", links: ["Location", "Menu", "Reserve"] },
  { title: "Punch Line Comedy Club", links: ["Location", "Shows", "Menu", "Policy"] },
]);

const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "..", "bachelor-party.css"), "utf8");
assert.equal((indexSource.match(/aria-expanded="false"/g) || []).length, 4, "all collapsible panels default closed");
assert.equal((indexSource.match(/data-collapsible-content hidden/g) || []).length, 4, "collapsed content starts hidden");
assert.equal((indexSource.match(/class="collapse-indicator"/g) || []).length, 3, "Roll Call no longer shows a plus icon");
assert.match(indexSource, /Click to begin Quest!/, "the quest button uses the requested label");
assert.doesNotMatch(source, /Let our journey begin!/, "the finalized state keeps the requested quest button label");
assert.doesNotMatch(source, /eightPeople|cost-alcohol|ALC\.\*/, "8-person and alcohol costs stay removed");
assert.doesNotMatch(cssSource, /\.cost-(?:alcohol|footnote|links)/, "obsolete cost details stay removed");
assert.doesNotMatch(indexSource, /password|Grant Access|data-reset/i, "the page must not show a quest password form");
assert.doesNotMatch(source, /plannerAccess|gatedBody|handleResetForm/, "quest details must remain ungated");

console.log("weekend decision and itinerary pricing tests passed");
