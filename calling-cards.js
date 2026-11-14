const venues = {
  bar: [
    {
      id: "snug",
      name: "The Snug",
      type: "Irish cocktail bar",
      address: "1800 15th St · Opens at 4 pm",
      note: "The first pick for a tavern toast.",
      theme: "An Irish-built bar with dark timber, red leather booths, and low lighting.",
      website: "https://www.irishhospitalitygroup.com/ro-sham-beaux-1",
      photos: [
        ["snug-room", "Dark wood booths with red upholstery and warm wall lights"],
        ["snug-sign", "The Snug’s blue storefront and gold sign"],
        ["snug-booth", "A tufted red booth beneath a wall of framed paintings"],
      ],
    },
    {
      id: "omallys",
      name: "O’Mally’s Pub",
      type: "Irish pub",
      address: "1109 2nd St · Old Sacramento",
      note: "Allow time to drive from the waterfront to the room.",
      theme: "A lively Irish pub with wooden booths, a long timber bar, and oversized pub games.",
      website: "https://www.oldsacramento.com/business_directory/omallys-pub/",
      photos: [
        ["omallys-bar", "O’Mally’s rustic wooden bar"],
        ["omallys-front", "Pub sign and Irish flag along the Old Sacramento boardwalk"],
        ["omallys-room", "O’Mally’s open seating area with wooden booths"],
      ],
    },
    {
      id: "cabin",
      name: "The Cabin",
      type: "Lodge bar · Whiskey cocktails",
      address: "1207 21st St · Walk to Séance",
      note: "The closest bar on the ballot to Séance.",
      theme: "Log walls, a stone fireplace, and campfire cocktails give it the feel of a mountain lodge.",
      website: "https://thecab.in/menu/",
      photos: [
        ["cabin-fire", "The Cabin’s log walls, tables, and stone fireplace", "https://www.visitsacramento.com/listing/the-cabin/8325/"],
        ["cabin-bear", "A carved wooden bear inside The Cabin"],
        ["cabin-toast", "Two dessert cocktails raised in a toast"],
      ],
      photoSource: "https://thecab.in/gallery/",
    },
    {
      id: "shady-lady",
      name: "Shady Lady Saloon",
      type: "Vintage saloon · Whiskey cocktails",
      address: "1409 R St · Next to The Snug",
      note: "A short drive to either escape room.",
      theme: "Red wallpaper, low-lit booths, and classic bourbon or rye drinks in a 1920s saloon.",
      website: "https://www.shadyladybar.com/menu/house-cocktails",
      photos: [
        ["shady-bar", "Red wallpaper and dark booths in the Shady Lady dining room", "https://www.sfchronicle.com/travel/article/One-day-in-Sacramento-a-new-city-rich-with-13178278.php"],
        ["shady-cocktail", "A red cocktail with a blackberry garnish"],
        ["shady-food", "A plate from the Shady Lady kitchen"],
      ],
      photoSource: "https://www.shadyladybar.com/",
    },
  ],
  dinner: [
    {
      id: "petes-arden",
      name: "Pete’s Arden",
      type: "Brewhouse dining room · Flatbreads",
      address: "2100 Arden Way #123",
      toComedy: { mode: "walking", time: "Same plaza as Punch Line" },
      note: "Share $14.49 vegetarian garden flatbreads and $16.49 fried artichoke hearts.",
      theme: "Wood tables, warm lighting, and a downstairs dining room. Ask for a table for eight downstairs.",
      website: "https://order.online/store/pete-s-restaurant-brewhouse-arden-2467080?pickup=true",
      photos: [
        ["petes-dining", "Wooden dining tables and pendant lights at Pete’s Arden", "https://www.bizjournals.com/sacramento/news/2021/10/20/petes-restaurant-brewhouse-howe-bout-arden.html"],
        ["petes-mural", "The Sacramento mural next to the stairs at Pete’s Arden"],
        ["petes-pizza", "A pizza being sliced at Pete’s"],
      ],
      photoSource: "https://petesarden.com/",
    },
    {
      id: "thai-terrace",
      name: "Thai Terrace",
      type: "Thai dining room · Family-style plates",
      address: "1596 Howe Ave",
      toComedy: { mode: "walking", time: "6–10 min walk to Punch Line" },
      note: "Vegetarian egg rolls, fresh tofu rolls, and crispy tofu are $10.95 each to share.",
      theme: "Striped booths, pendant lights, and larger tables for sharing Thai dishes.",
      website: "https://order.online/store/thai-terrace-sacramento-300749/?hideModal=true&pickup=true",
      photos: [
        ["thai-terrace-room", "The wood host stand and striped booths at Thai Terrace"],
        ["thai-terrace-decor", "Thai statues and flowers on a carved table in the dining room", "https://monaghansrvc.com/post/best-of-21-thai-restaurants-in-sacramento.p5754"],
        ["thai-terrace-rolls", "Thai Terrace egg rolls with dipping sauce", "https://sagemenu.com/sacramento/thai-terrace-sacramento/"],
      ],
      photoSource: "https://thaiterracesac.com/story",
    },
    {
      id: "wildwood",
      name: "Wildwood Kitchen & Bar",
      type: "Rustic dining room · Whiskey & small plates",
      address: "556 Pavilions Ln",
      toComedy: { mode: "driving", time: "5–10 min drive to Punch Line" },
      note: "$16 hummus and $18 mushroom bruschetta to share. $19 vegetarian Impossible burger.",
      theme: "Amber lighting, wood tables, and a wall of whiskey. The menu lists 20% group gratuity and 3% kitchen gratuity.",
      website: "https://wildwoodpavilions.com/dinner/",
      photos: [
        ["wildwood-room", "Wildwood’s dining room with amber lighting and wooden tables"],
        ["wildwood-bar", "Long bar lined with leather seats at Wildwood"],
        ["wildwood-board", "Wildwood’s charcuterie board on a dark wood table"],
      ],
      photoSource: "https://wildwoodpavilions.com/gallery/",
    },
    {
      id: "tapa-the-world",
      name: "Tapa the World",
      type: "Spanish tapas · Sit-down dining",
      address: "2115 J St",
      toComedy: { mode: "driving", time: "10–15 min drive to Punch Line" },
      note: "Share vegetarian tapas like $8 patatas bravas, $12 eggplant, and $14 grilled vegetables.",
      theme: "A warmly lit dining room and a covered, heated courtyard. A 20% service charge may apply for eight.",
      website: "https://www.tapatheworld.com/tapas/",
      photos: [
        ["tapa-the-world-room", "Warm lights and set tables at Tapa the World", "https://www.tapatheworld.com/"],
        ["tapa-the-world-courtyard", "Tables set for dinner under the covered courtyard", "https://www.tripadvisor.com/Restaurant_Review-g32999-d339783-Reviews-Tapa_The_World-Sacramento_California.html"],
        ["tapa-the-world-bravas", "Patatas bravas with red dipping sauce at Tapa the World", "https://www.tapatheworld.com/tapas/"],
      ],
      photoSource: "https://www.tapatheworld.com/reservations",
    },
  ],
};

const dashboard = document.querySelector("[data-view]");
const scheduleTabs = Array.from(document.querySelectorAll('[role="tab"]'));
const compactViews = window.matchMedia("(max-width: 48rem), (max-height: 40rem)");
const showParty = document.querySelector("[data-show-party]");
const roster = document.querySelector("[data-response-list]");
const guestSelectors = Array.from(document.querySelectorAll("[data-ballot-guest]"));
const venueDialog = document.querySelector("#venue-voting");
const venueVote = venueDialog.querySelector("[data-venue-vote]");
const clearVenue = venueDialog.querySelector("[data-clear-venue]");
const flipButton = venueDialog.querySelector("[data-flip-card]");
const venueSnapshot = document.querySelector("#venue-snapshot");
const voteButtons = Array.from(document.querySelectorAll("[data-vote]"));
const retryButtons = Array.from(document.querySelectorAll("[data-ballot-retry]"));
const ballotStoreUrl = persistenceConfig.ballotEndpointUrl ?? remoteStoreUrl;
const ballotGuestKey = "bachelor-party-calling-card-guest";

let activeGuest = "";
let activeDeck = "bar";
let venueIndex = 0;
let callingCards = [];
let connected = false;
let refreshing = false;
let saving = false;
let saveVersion = 0;

function selectSchedule(tab) {
  dashboard.dataset.view = tab.getAttribute("aria-controls");
  showParty.setAttribute("aria-pressed", "false");
  for (const option of scheduleTabs) {
    const current = tab === option;
    option.setAttribute("aria-selected", String(current));
    option.tabIndex = current ? 0 : -1;
    document.getElementById(option.getAttribute("aria-controls")).hidden = !current;
  }
}

for (const tab of scheduleTabs) {
  tab.addEventListener("click", () => selectSchedule(tab));
  tab.addEventListener("keydown", (event) => {
    const index = scheduleTabs.indexOf(tab);
    const destination = { ArrowLeft: 1 - index, ArrowRight: 1 - index, Home: 0, End: 1 }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    selectSchedule(scheduleTabs[destination]);
    scheduleTabs[destination].focus();
  });
}
showParty.addEventListener("click", () => {
  dashboard.dataset.view = "party";
  showParty.setAttribute("aria-pressed", "true");
  for (const tab of scheduleTabs) tab.setAttribute("aria-selected", "false");
});
compactViews.addEventListener("change", () => {
  if (dashboard.dataset.view !== "party") return;
  for (const tab of scheduleTabs) {
    tab.setAttribute("aria-selected", String(!compactViews.matches && tab.tabIndex === 0));
  }
});
if (compactViews.matches) {
  for (const tab of scheduleTabs) tab.setAttribute("aria-selected", "false");
}

function showDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog.open) dialog.showModal();
}

for (const button of document.querySelectorAll("[data-open-dialog]")) {
  button.addEventListener("click", () => showDialog(button.dataset.openDialog));
}

function selectedCard() {
  return callingCards.find(({ inviteeId }) => inviteeId === activeGuest);
}

function setStatus(scope, message = "") {
  document.querySelector(`[data-ballot-status="${scope}"]`).textContent = message;
}

function voteCount(field, choice) {
  return callingCards.filter((card) => card[field] === choice).length;
}

function renderVotingState() {
  const selected = selectedCard();
  for (const button of voteButtons) {
    const { vote, choice } = button.dataset;
    button.setAttribute("aria-disabled", String(!connected || saving));
    if (button.hasAttribute("aria-pressed")) {
      button.setAttribute("aria-pressed", String(selected?.[vote] === choice));
    }
  }
  for (const selector of guestSelectors) selector.value = activeGuest;
  for (const member of roster.querySelectorAll("[data-calling-card]")) {
    member.setAttribute("aria-pressed", String(member.dataset.callingCard === activeGuest));
  }
  for (const button of retryButtons) button.hidden = connected || refreshing;

  const drivers = voteCount("drive", "volunteer");
  const riders = voteCount("drive", "rider");
  const driverTally = drivers > 2 ? `${drivers} volunteers for 2 cars` : `${drivers}/2 drivers`;
  document.querySelector("[data-driver-count]").textContent = connected || callingCards.length
    ? `${driverTally} · ${riders} ${riders === 1 ? "rider" : "riders"}`
    : refreshing ? "Loading driver tally…" : "Driver tally unavailable";
  for (const entry of document.querySelectorAll("[data-driver-names]")) {
    const names = party.filter((member) => callingCards.some(
      (card) => card.inviteeId === member.id && card.drive === entry.dataset.driverNames,
    ));
    entry.textContent = names.map(({ name }) => name).join(", ") || (connected ? "None yet" : "Tally unavailable");
  }

  const venue = venues[activeDeck][venueIndex];
  const count = voteCount(activeDeck, venue.id);
  venueVote.textContent = selected?.[activeDeck] === venue.id ? "Voted" : "Vote";
  venueDialog.querySelector("[data-venue-tally]").textContent = connected || callingCards.length
    ? `${count} ${count === 1 ? "vote" : "votes"}`
    : "Tally unavailable";
  clearVenue.hidden = !selected?.[activeDeck];

  for (const button of document.querySelectorAll("[data-open-ballot]")) {
    const field = button.dataset.openBallot;
    const choice = venues[field].find(({ id }) => id === selected?.[field]);
    button.firstChild.textContent = choice ? `Voted: ${choice.name} ` : field === "bar" ? "Vote for a bar " : "Vote for dinner ";
  }
}

function selectGuest(id) {
  activeGuest = id;
  try {
    window.localStorage.setItem(ballotGuestKey, id);
  } catch {
    // The selected calling card still works for this visit.
  }
  if (connected) {
    setStatus("drive");
    setStatus("venue");
  }
  renderVotingState();
}

function flipCard(showPhotos) {
  flipButton.setAttribute("aria-expanded", String(showPhotos));
  flipButton.firstChild.textContent = showPhotos ? "Flip back " : "Flip card ";
  venueDialog.querySelector("[data-venue-front]").hidden = showPhotos;
  venueSnapshot.hidden = !showPhotos;
}

function renderVenue() {
  const deck = venues[activeDeck];
  const venue = deck[venueIndex];
  venueDialog.querySelector("[data-venue-type]").textContent = venue.type;
  venueDialog.querySelector("[data-venue-name]").textContent = venue.name;
  venueDialog.querySelector("[data-venue-address]").textContent = venue.toComedy
    ? `${venue.address} · ${venue.toComedy.time}`
    : venue.address;
  venueDialog.querySelector("[data-venue-short]").textContent = venue.note;
  venueDialog.querySelector("[data-venue-theme]").textContent = venue.theme;
  venueDialog.querySelector("[data-venue-site]").href = venue.website;
  const directions = venueDialog.querySelector("[data-venue-directions]");
  directions.hidden = !venue.toComedy;
  if (venue.toComedy) {
    const route = new URLSearchParams({
      api: "1",
      origin: `${venue.name}, ${venue.address}, Sacramento, CA`,
      destination: "Punch Line Sacramento, 2100 Arden Way #225, Sacramento, CA",
      travelmode: venue.toComedy.mode,
    });
    directions.href = `https://www.google.com/maps/dir/?${route}`;
  }
  const credit = venueDialog.querySelector("[data-venue-credit]");
  credit.textContent = "Photo sources ↗";
  credit.href = venue.photoSource || venue.website;
  const photoLinks = venue.photos.map(([file, alt, source]) => {
    const img = new Image(640, 400);
    img.src = `assets/venues/${file}.webp`;
    img.alt = alt;
    img.decoding = "async";
    if (!source) return img;

    const link = document.createElement("a");
    link.href = source;
    link.target = "_blank";
    link.rel = "noopener";
    link.append(img);
    return link;
  });
  venueDialog.querySelector("[data-venue-photos]").replaceChildren(...photoLinks);
  venueDialog.querySelector("[data-deck-position]").textContent = `${venueIndex + 1} of ${deck.length}`;
  venueVote.dataset.vote = activeDeck;
  venueVote.dataset.choice = venue.id;
  venueVote.setAttribute("aria-label", `Vote for ${venue.name}`);
  clearVenue.dataset.vote = activeDeck;
  flipCard(false);
  renderVotingState();
}

for (const button of document.querySelectorAll("[data-open-ballot]")) {
  button.addEventListener("click", () => {
    activeDeck = button.dataset.openBallot;
    const currentChoice = selectedCard()?.[activeDeck];
    const currentIndex = venues[activeDeck].findIndex(({ id }) => id === currentChoice);
    venueIndex = Math.max(currentIndex, 0);
    venueDialog.querySelector("[data-venue-ballot-title]").textContent = activeDeck === "bar" ? "Vote for a bar" : "Vote for dinner";
    setStatus("venue", connected && currentChoice && currentIndex < 0 ? "Choose again from the updated venues." : "");
    renderVenue();
    showDialog("venue-voting");
  });
}

for (const button of venueDialog.querySelectorAll("[data-deck-step]")) {
  button.addEventListener("click", () => {
    const length = venues[activeDeck].length;
    venueIndex = (venueIndex + Number(button.dataset.deckStep) + length) % length;
    renderVenue();
  });
}
flipButton.addEventListener("click", () => flipCard(venueSnapshot.hidden));

async function requestCallingCards(card) {
  if (!ballotStoreUrl) throw new Error("Missing ballot endpoint.");
  const url = new URL(ballotStoreUrl, window.location.href);
  url.searchParams.set("action", "ballots");
  const options = { cache: "no-store", signal: AbortSignal.timeout(10000) };
  if (card) {
    options.method = "POST";
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify({ action: "save-ballot", card });
  }

  const result = await fetch(url, options);
  const payload = await result.json();
  if (!result.ok || !Array.isArray(payload.ballots)) throw new Error("Shared calling cards are unavailable.");
  return payload.ballots;
}

async function refreshCallingCards() {
  if (refreshing || saving) return;
  refreshing = true;
  renderVotingState();
  const version = saveVersion;
  try {
    const cards = await requestCallingCards();
    if (version !== saveVersion) return;
    callingCards = cards;
    if (!connected) {
      setStatus("drive");
      setStatus("venue");
    }
    connected = true;
  } catch {
    if (version !== saveVersion) return;
    connected = false;
    setStatus("drive", "Shared voting is unavailable.");
    setStatus("venue", "Shared voting is unavailable.");
  } finally {
    refreshing = false;
    renderVotingState();
  }
}

async function saveVote({ currentTarget }) {
  if (!connected || saving) return;
  const { vote, choice } = currentTarget.dataset;
  const isDriverVote = vote === "drive";
  const scope = isDriverVote ? "drive" : "venue";
  if (!activeGuest) {
    setStatus(scope, "Choose your name to vote.");
    guestSelectors[isDriverVote ? 0 : 1].focus();
    return;
  }
  if (selectedCard()?.[vote] === choice) return;

  const saveDeck = activeDeck;
  saveVersion += 1;
  saving = true;
  renderVotingState();
  setStatus(scope, "Saving…");
  try {
    callingCards = await requestCallingCards({ inviteeId: activeGuest, [vote]: choice });
    if (isDriverVote || activeDeck === saveDeck) setStatus(scope, choice ? "Vote saved." : "Vote cleared.");
  } catch {
    if (isDriverVote || activeDeck === saveDeck) setStatus(scope, "Vote could not be saved. Try again.");
  } finally {
    saving = false;
    renderVotingState();
  }
}

for (const selector of guestSelectors) {
  for (const member of party) selector.add(new Option(member.name, member.id));
  selector.addEventListener("change", () => {
    if (saving) {
      selector.value = activeGuest;
      return;
    }
    selectGuest(selector.value);
  });
}
try {
  const previousGuest = window.localStorage.getItem(ballotGuestKey);
  if (party.some(({ id }) => id === previousGuest)) activeGuest = previousGuest;
} catch {
  // The roster remains available when storage is disabled.
}

roster.addEventListener("click", (event) => {
  const card = event.target.closest("[data-calling-card]");
  if (card && !saving) selectGuest(card.dataset.callingCard);
});

document.addEventListener("DOMContentLoaded", renderVotingState);
for (const button of voteButtons) button.addEventListener("click", saveVote);
for (const button of retryButtons) button.addEventListener("click", refreshCallingCards);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshCallingCards();
});
window.setInterval(() => {
  if (!document.hidden) refreshCallingCards();
}, 30000);
refreshCallingCards();
