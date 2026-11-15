import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, sep, basename, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const temp = await mkdtemp(join(tmpdir(), "bachelor-saturday-browser-"));
const preview = spawn(process.execPath, ["preview.mjs", "0"], {
  windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, BACHELOR_PARTY_PREVIEW_DB: ":memory:" },
});
let chrome;
let socket;
function ready(child, stream, pattern) {
  return new Promise((resolve, reject) => {
    let log = "";
    child.once("error", reject);
    child.once("exit", code => reject(new Error("Process exited at startup: " + code + " " + log.slice(-1000))));
    AbortSignal.timeout(12000).addEventListener("abort", () => reject(new Error("Startup timed out.")), { once: true });
    stream.on("data", chunk => {
      log += chunk;
      const match = log.match(pattern);
      if (match) resolve(match[1]);
    });
  });
}
try {
  const url = await ready(preview, preview.stdout, /(http:\/\/127\.0\.0\.1:\d+\/)/);
  chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
    "--headless", "--no-first-run", "--disable-background-networking",
    "--remote-debugging-port=0", "--user-data-dir=" + temp, "about:blank",
  ], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
  const port = await ready(chrome, chrome.stderr, /DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/);
  const targets = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
  socket = new WebSocket(targets.find(({ type }) => type === "page").webSocketDebuggerUrl);
  await once(socket, "open");
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const result = JSON.parse(data);
    const request = pending.get(result.id);
    if (!request) return;
    pending.delete(result.id);
    if (result.error) request.reject(new Error(result.error.message));
    else request.resolve(result.result);
  };
  function cdp(method, params) {
    const id = ++nextId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function run(code) {
    const result = await cdp("Runtime.evaluate", {
      expression: "(async () => { " + code + " })()",
      returnByValue: true, awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  }
  async function until(code, problem) {
    for (let i = 0; i < 80; i++) {
      try { if (await run(code)) return; } catch (e) {
        if (!/context|navigation/i.test(e.message)) throw e;
      }
      await sleep(100);
    }
    throw new Error(problem);
  }
  const offered = 'document.querySelector("[data-car-offer]")';
  const seats = 'document.querySelector("#car-passengers select")';
  const field = 'document.querySelector("#car-passengers")';
  const status = 'document.querySelector("[data-ballot-status=drive]")?.textContent';
  const enabled = offered + '?.getAttribute("aria-disabled") === "false"';
  const didSave = (message) => until("return " + status + " === " + JSON.stringify(message), message + " did not appear.");
  const viewport = (width, height) => cdp("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: false
  });

  await cdp("Page.enable");
  await viewport(1304, 883);
  await cdp("Page.navigate", { url });
  await until("return " + enabled, "Ballot did not load.");
  assert.deepEqual(await run("return [" + offered + ".textContent, " + field + ".hidden]"), ["We can take my car", true]);
  assert.equal(await run('return document.querySelector(".site-header [data-open-dialog=games]") === null'), true);

  await cdp("Runtime.enable");
  const errors = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  });
  const read = async () => (await (await fetch(url + "api/calling-cards?action=ballots")).json()).ballots;
  const choose = async (id) => run('const s=document.querySelector("#ballot-guest");s.value=' + JSON.stringify(id) + ';s.dispatchEvent(new Event("change",{bubbles:true}))');
  const click = async (selector) => run('document.querySelector(' + JSON.stringify(selector) + ').click()');
  const textAt = async (selector) => run('return document.querySelector(' + JSON.stringify(selector) + ').textContent');
  const saveIn = async (scope, msg="Vote saved.") => until('return document.querySelector("[data-ballot-status=' + scope + ']").textContent === ' + JSON.stringify(msg), scope + " save failed");
  const openDeck = async (deck) => click('[data-open-ballot=' + deck + ']');
  const closeDeck = async () => click('#venue-voting .close-button');
  const castVenue = async () => { await click('[data-venue-vote]'); await saveIn("venue"); };
  const next = async () => click('[data-deck-step="1"]');
  const submitDisabled = () => run('return document.querySelector("[data-plan-submit]").disabled');

  await choose("cody-gardi");
  assert.deepEqual(await read(), [], "Choosing a name must not vote");
  assert.equal(await submitDisabled(), true);
  assert.match(await textAt("[data-plan-progress]"), /Ride or car.*Bar.*Escape room.*Dinner.*Comedy seating/);
  const expectedVenues = {
    bar: ["Maple Room Lounge", "The Snug", "Shady Lady Saloon"],
    room: ["Enchambered", "PanIQ"],
    dinner: ["Thai Terrace", "Wildwood Kitchen & Bar", "Tapa the World"],
  };
  for (const [deck, names] of Object.entries(expectedVenues)) {
    await openDeck(deck);
    for (const [index, name] of names.entries()) {
      assert.equal(await textAt("[data-venue-name]"), name);
      assert.equal(await textAt("[data-deck-position]"), `${index + 1} of ${names.length}`);
      await click("[data-flip-card]");
      assert.equal(await run('const imgs=[...document.querySelectorAll("[data-venue-photos] img")];await Promise.all(imgs.map(i=>i.decode()));return imgs.length===3&&imgs.every(i=>i.naturalWidth>0)'), true, "Card photos failed");
      if (deck === "room") {
        const modes = await run('return [...document.querySelectorAll("[data-bar-routes] a")].map(a => new URL(a.href).searchParams.get("travelmode"))');
        assert.deepEqual(modes, name === "Enchambered" ? ["walking", "driving", "driving"] : ["driving", "driving", "driving"]);
        if (name === "Enchambered") {
          assert.deepEqual(await run('return [...document.querySelectorAll("[data-room-links] a")].map(a => a.textContent)'), ["Skull Witch ↗", "The Collection ↗"]);
        }
      }
      await next();
    }
    await closeDeck();
  }

  await openDeck("bar");
  await next(); await next();
  await castVenue(); await closeDeck();
  await openDeck("room");
  await next();
  await castVenue(); await closeDeck();
  await openDeck("dinner");
  await next();
  await castVenue(); await closeDeck();
  await run(offered + ".click()"); await didSave("Car offer saved.");
  assert.equal(await run("return " + field + ".hidden"), false);
  assert.equal(await submitDisabled(), true);
  assert.match(await textAt("[data-plan-progress]"), /Passenger seats.*Comedy seating/);
  await click('[data-open-dialog="seating-voting"]');
  await click('[data-vote=seating][data-choice=general]');
  await saveIn("seating");
  await click("#seating-voting .close-button");
  assert.equal(await submitDisabled(), true);
  assert.match(await textAt("[data-plan-progress]"), /Passenger seats/);
  await run(seats + '.value="3";' + seats + '.dispatchEvent(new Event("change",{bubbles:true}))'); await didSave("Passenger count saved.");
  assert.equal(await submitDisabled(), false);
  await click("[data-plan-submit]");
  await until('return document.querySelector("[data-plan-submit]").hasAttribute("data-submitted")', "Plan vote did not submit.");
  assert.equal(await submitDisabled(), true);
  assert.match(await textAt("[data-plan-tally]"), /1 of 8/);
  const beforeReload = await run("return performance.timeOrigin");
  await cdp("Page.reload");
  await until("return performance.timeOrigin !== " + beforeReload + " && " + enabled, "Reload failed");
  const [card] = await read();
  assert.deepEqual(card, {
    inviteeId: "cody-gardi", drive: "volunteer", bar: "shady-lady", room: "paniq", dinner: "wildwood",
    seating: "general", car: "offer", passengerSeats: 3, planSubmitted: true, missingPlanChoices: [],
  });
  assert.equal(await run("return " + seats + ".value"), "3");
  assert.equal(await textAt("[data-plan-submit]"), "Plan vote submitted");
  assert.match(await textAt('[data-open-ballot=bar]'), /Shady Lady Saloon/);
  assert.match(await textAt('[data-open-ballot=room]'), /PanIQ/);
  assert.match(await textAt('[data-open-ballot=dinner]'), /Wildwood/);
  await click('[data-open-dialog=route]');
  const map = new URL(await run('return document.querySelector("[data-saturday-directions]").href'));
  assert.equal(map.searchParams.get("travelmode"), "driving");
  assert.match(map.searchParams.get("origin"), /Shady Lady/);
  assert.match(map.searchParams.get("waypoints"), /PanIQ.*Wildwood/);
  await click("#route .close-button");
  await click('[data-open-dialog=breakfast]');
  assert.equal(await run('return document.querySelectorAll("#breakfast .breakfast-spots li").length'), 4);
  await click("#breakfast .close-button");

  const otherVote = await fetch(url + "api/calling-cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "save-ballot", card: { inviteeId: "max-voorhees", bar: "shady-lady" } }),
  });
  assert.equal(otherVote.status, 200);
  await run("await refreshCallingCards()");
  await choose("max-voorhees");
  await openDeck("bar");
  assert.equal(await textAt("[data-venue-tally]"), "2 votes");
  await next();
  await cdp("Network.enable");
  await cdp("Network.emulateNetworkConditions", {offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await click("[data-venue-vote]");
  await saveIn("venue", "Vote could not be saved. Try again.");
  assert.equal((await read()).find((row) => row.inviteeId === "max-voorhees").bar, "shady-lady");
  await cdp("Network.emulateNetworkConditions", {offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await closeDeck();
  await choose("cody-gardi");
  await click('[data-vote=drive][data-choice=rider]');
  await didSave("Ride request saved.");
  assert.equal(await run("return " + field + ".hidden"), true);
  assert.equal(await submitDisabled(), false);
  await openDeck("bar");
  await click("[data-clear-venue]"); await saveIn("venue","Vote cleared."); await closeDeck();
  const afterClear = await read();
  assert.deepEqual(afterClear.find((row) => row.inviteeId === "cody-gardi"), {
    ...card, bar: "", drive: "rider", car: "", passengerSeats: null, planSubmitted: false, missingPlanChoices: ["bar"],
  });
  assert.equal(afterClear.find((row) => row.inviteeId === "max-voorhees").bar, "shady-lady");
  assert.equal(await submitDisabled(), true);

  await mkdir(".venue-photo-review/saturday", {recursive:true});
  for (const [width,height] of [[1304,883],[780,820],[390,844]]) {
    await viewport(width,height);
    await click("#saturday-tab");
    await run("await document.fonts.ready");
    assert.equal(await run("return document.documentElement.scrollWidth <= innerWidth"), true, "Horizontal overflow at " + width);
    if(width===1304) assert.equal(await run("return document.documentElement.scrollHeight <= innerHeight"),true,"Desktop must fit without scrolling");
    const shot = await cdp("Page.captureScreenshot", {format:"png"});
    await writeFile(".venue-photo-review/saturday/" + width + ".png",Buffer.from(shot.data,"base64"));
  }
  assert.deepEqual(errors, []);
  console.log("Verified car capacity, the required-vote gate, submission and reload, ballot changes, venue cards, and responsive layouts.");

} finally {
  socket?.close();
  for (const child of [chrome, preview]) {
    if (child && child.exitCode === null && child.signalCode === null) {
      const done = once(child, "exit");
      child.kill();
      await done.catch(() => {});
    }
  }
  if (resolve(temp).startsWith(resolve(tmpdir()) + sep) && basename(temp).startsWith("bachelor-saturday-browser-")) {
    await rm(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }).catch(() => {});
  }
}
