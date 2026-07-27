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

const eightPersonCoreTotal = vm.runInContext(
  `(() => {
    const costs = tripDetails.find(({ kind }) => kind === "itinerary").gatedBody.prep
      .find(({ kind }) => kind === "costs").items.filter(({ optional }) => !optional);
    return formatCostRange(sumCostRanges(costs, "eightPeople"));
  })()`,
  context,
);
assert.equal(eightPersonCoreTotal, "$495.92–$959.92", "the known 8-person subtotal must stay accurate");

const alcoholCoreTotal = vm.runInContext(
  `(() => {
    const alcohol = tripDetails.find(({ kind }) => kind === "itinerary").gatedBody.prep
      .find(({ kind }) => kind === "costs").items
      .filter(({ optional, alcohol }) => !optional && alcohol)
      .map(({ alcohol }) => alcohol);
    return formatCostRange(sumCostRanges(alcohol, "eightPeople"));
  })()`,
  context,
);
assert.equal(alcoholCoreTotal, "$358.72–$603.68", "optional alcohol estimates must not drift");

const saturdayTitles = vm.runInContext(
  `JSON.stringify(tripDetails.find(({ kind }) => kind === "itinerary").gatedBody.days
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
  `tripDetails.find(({ kind }) => kind === "itinerary").gatedBody.days
    .flatMap(({ items }) => items)
    .every((item) => !("price" in item) && !("links" in item))`,
  context,
);
assert.equal(itineraryDetailsOnly, true, "Friday and Saturday cards should contain schedule details only");

const costLinkGroups = vm.runInContext(
  `JSON.stringify(tripDetails.find(({ kind }) => kind === "itinerary").gatedBody.prep
    .find(({ kind }) => kind === "costs").items
    .map(({ title, links }) => ({ title, links: links.map(({ label }) => label) })))`,
  context,
);
assert.deepEqual(JSON.parse(costLinkGroups), [
  { title: "GV Brewing · food", links: ["Location", "Menu"] },
  { title: "Bubba's · sandwiches", links: ["Location", "Menu"] },
  { title: "Two-car transportation", links: ["Route"] },
  { title: "Pete's Arden · bar", links: ["Location", "Menu PDF"] },
  { title: "Enchambered", links: ["Location", "Pricing + book"] },
  { title: "Butterscotch Den · dinner", links: ["Location", "Menu", "Reserve"] },
  { title: "Punch Line Comedy", links: ["Location", "Shows", "Menu", "Policy"] },
]);

const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "..", "bachelor-party.css"), "utf8");
assert.equal((indexSource.match(/aria-expanded="false"/g) || []).length, 4, "all collapsible panels default closed");
assert.equal((indexSource.match(/data-collapsible-content hidden/g) || []).length, 4, "collapsed content starts hidden");
assert.equal((indexSource.match(/class="collapse-indicator"/g) || []).length, 3, "Roll Call no longer shows a plus icon");
assert.match(indexSource, /Click to begin Quest!/, "the quest button uses the requested label");
assert.doesNotMatch(source, /Let our journey begin!/, "the finalized state keeps the requested quest button label");
assert.doesNotMatch(cssSource, /\.itinerary-event-(?:price|links)/, "the itinerary no longer styles moved pricing or links");

console.log("weekend decision and itinerary pricing tests passed");
