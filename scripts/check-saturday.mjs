import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, sep, basename, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const temp = await mkdtemp(join(tmpdir(), "bachelor-plan-browser-"));
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
  assert.equal(await run("return " + offered + '.type === "checkbox" && ' + field + ".hidden"), true);

  await cdp("Runtime.enable");
  const errors = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  });
  const read = async () => (await (await fetch(url + "api/calling-cards?action=ballots")).json()).ballots;
  const choose = async (id) => run('const s=document.querySelector("#plan-guest");s.value=' + JSON.stringify(id) + ';s.dispatchEvent(new Event("change",{bubbles:true}))');
  const click = async (selector) => run('document.querySelector(' + JSON.stringify(selector) + ').click()');
  const textAt = async (selector) => run('return document.querySelector(' + JSON.stringify(selector) + ').textContent');
  const saveIn = async (scope, msg="Vote saved.") => until('return document.querySelector("[data-ballot-status=' + scope + ']").textContent === ' + JSON.stringify(msg), scope + " save failed");
  const openDeck = async (deck) => click('[data-open-ballot=' + deck + ']');
  const closeDeck = async () => click('#venue-voting .close-button');
  const castVenue = async () => { await click('[data-venue-vote]'); await saveIn("venue"); };
  const browsePlan = async (plan) => click('[data-plan=' + plan + ']');

  await choose("cody-gardi");
  assert.deepEqual(await read(), [], "Choosing a name must not vote");
  await click('[data-plan-vote]'); await saveIn("plan");
  await openDeck("bar");
  assert.equal(await textAt('[data-deck-position]'), "1 of 4");
  for (let index = 0; index < 4; index++) {
    await click("[data-flip-card]");
    assert.equal(await run('const imgs=[...document.querySelectorAll("[data-venue-photos] img")];await Promise.all(imgs.map(i=>i.decode()));return imgs.length===3&&imgs.every(i=>i.naturalWidth>0)'), true, "Card photos failed");
    assert.equal(await run('return new URL(document.querySelector("[data-venue-escape-directions]").href).searchParams.get("travelmode")'), "walking");
    await click('[data-deck-step="1"]');
  }
  await click('[data-deck-step="1"]'); await click('[data-deck-step="1"]');
  await castVenue(); await closeDeck();
  await openDeck("room");
  assert.equal(await textAt('[data-deck-position]'), "1 of 2");
  await click('[data-deck-step="1"]'); await castVenue(); await closeDeck();
  await openDeck("dinner");
  assert.equal(await textAt('[data-deck-position]'), "1 of 2");
  await click('[data-deck-step="1"]'); await castVenue(); await closeDeck();

  const walkingVotes = await read();
  await browsePlan("drive");
  assert.deepEqual(await read(), walkingVotes, "Browsing a plan must not vote or clear choices");
  await click('[data-plan-vote]'); await saveIn("plan");
  await openDeck("bar");
  assert.equal(await textAt('[data-deck-position]'), "1 of 4");
  await castVenue(); await closeDeck();
  await openDeck("room");
  assert.equal(await textAt('[data-deck-position]'), "1 of 5");
  await castVenue(); await closeDeck();
  await openDeck("dinner");
  assert.equal(await textAt('[data-deck-position]'), "1 of 4");
  await click('[data-deck-step="1"]'); await click('[data-deck-step="1"]');
  await castVenue(); await closeDeck();
  await run(offered + ".click()"); await didSave("Car offer saved.");
  await run(seats + '.value="3";' + seats + '.dispatchEvent(new Event("change",{bubbles:true}))'); await didSave("Passenger count saved.");
  await browsePlan("walk");
  assert.match(await textAt('[data-open-ballot=bar]'), /Maple Room/);
  assert.match(await textAt('[data-open-ballot=room]'), /The Collection/);
  assert.match(await textAt('[data-open-ballot=dinner]'), /Thai Terrace/);
  const beforeReload = await run("return performance.timeOrigin");
  await cdp("Page.reload");
  await until("return performance.timeOrigin !== " + beforeReload + " && " + enabled, "Reload failed");
  const [card] = await read();
  assert.deepEqual({plan:card.plan,bar:card.bar,room:card.room,dinner:card.dinner,walkBar:card.walkBar,walkRoom:card.walkRoom,walkDinner:card.walkDinner,car:card.car,passengerSeats:card.passengerSeats},
    {plan:"drive",bar:"snug",room:"seance",dinner:"wildwood",walkBar:"maple-room",walkRoom:"the-collection",walkDinner:"thai-terrace",car:"offer",passengerSeats:3});
  await click('[data-open-dialog=route]');
  assert.equal(await run('return document.querySelector("[data-route-plan=walk]").hidden'), false);
  const map = new URL(await run('return document.querySelector("[data-plan-directions]").href'));
  assert.equal(map.searchParams.get("travelmode"), "walking");
  assert.match(map.searchParams.get("origin"), /Maple/);
  assert.match(map.searchParams.get("waypoints"), /Enchambered|2230 Arden/);
  assert.match(map.searchParams.get("waypoints"), /Thai Terrace/);
  await click("#route .close-button");
  await click('[data-open-dialog=breakfast]');
  assert.equal(await run('return document.querySelectorAll("#breakfast .breakfast-spots li").length'), 4);
  await click("#breakfast .close-button");

  await fetch(url + "api/calling-cards", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"save-ballot",card:{inviteeId:"max-voorhees",plan:"walk",walkBar:"bjs-arden"}})});
  await run("await refreshCallingCards()");
  assert.equal(await textAt('[data-plan-tally=walk]'), "1 vote");
  assert.equal(await textAt('[data-plan-tally=drive]'), "1 vote · Your vote");
  await choose("max-voorhees");
  assert.match(await textAt('[data-open-ballot=bar]'), /BJ/);
  await browsePlan("drive");
  await cdp("Network.enable");
  await cdp("Network.emulateNetworkConditions", {offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await click('[data-plan-vote]');
  await saveIn("plan", "Vote could not be saved. Try again.");
  assert.equal((await read()).find(x=>x.inviteeId==="max-voorhees").plan, "walk");
  await cdp("Network.emulateNetworkConditions", {offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await choose("cody-gardi"); await browsePlan("walk");
  await openDeck("bar");
  await click("[data-clear-venue]"); await saveIn("venue","Vote cleared."); await closeDeck();
  assert.equal((await read()).find(x=>x.inviteeId==="cody-gardi").bar, "snug", "Clear must not affect driving ballot");
  assert.equal((await read()).find(x=>x.inviteeId==="cody-gardi").walkBar, "");

  await mkdir(".venue-photo-review/two-plans", {recursive:true});
  for (const [width,height] of [[1304,883],[780,820],[390,844]]) {
    await viewport(width,height);
    await click("#saturday-tab");
    await run("await document.fonts.ready");
    assert.equal(await run("return document.documentElement.scrollWidth <= innerWidth"), true, "Horizontal overflow at " + width);
    if(width===1304) assert.equal(await run("return document.documentElement.scrollHeight <= innerHeight"),true,"Desktop must fit without scrolling");
    const shot = await cdp("Page.captureScreenshot", {format:"png"});
    await writeFile(".venue-photo-review/two-plans/" + width + ".png",Buffer.from(shot.data,"base64"));
  }
  assert.deepEqual(errors, []);
  console.log("Verified both plan ballots, independent votes, all four photo cards, reload persistence, two voters, save failure feedback, scoped clearing, route maps, breakfast, passenger seats, and responsive layouts.");

} finally {
  socket?.close();
  for (const child of [chrome, preview]) {
    if (child && child.exitCode === null && child.signalCode === null) {
      const done = once(child, "exit");
      child.kill();
      await done.catch(() => {});
    }
  }
  if (resolve(temp).startsWith(resolve(tmpdir()) + sep) && basename(temp).startsWith("bachelor-plan-browser-")) {
    await rm(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }).catch(() => {});
  }
}
