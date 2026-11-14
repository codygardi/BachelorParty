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
      address: "1207 21st St · 10–12 min walk to Exit Strategy Games",
      note: "The shortest walk to Séance and Fortune’s Favor.",
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
      note: "Around the corner from The Snug for the same Midtown route.",
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
  room: [
    {
      id: "seance",
      name: "Séance",
      type: "Exit Strategy Games · Haunted parlor",
      address: "1831 I St",
      fromSnug: { mode: "walking", time: "20 min walk from The Snug" },
      note: "$35 each for eight · 60 min · Private room",
      theme: "A mystic’s candlelit parlor with patterned rugs and wards. Find the charms to send a spirit back through its portal.",
      website: "https://exitstrategygames.com/seance/",
      booking: "https://offthecouch.io/book/escapesac/seance",
      photos: [
        ["seance-room", "Séance’s boarded windows and patterned rug under red and blue light"],
        ["seance-props", "Crystal ball on purple velvet between brass candlesticks", "https://worldofescapes.com/sacramento/quests/escape-sacramento-the-seance"],
        ["seance-board", "Séance symbols painted on a wood tabletop"],
      ],
    },
    {
      id: "pirates-of-tortuga",
      name: "Pirates of Tortuga",
      type: "PanIQ · Pirate storeroom",
      address: "2642 5th St",
      fromSnug: { mode: "driving", time: "1.5 mi from The Snug" },
      note: "$40.95 each · 60 min · Confirm space for eight",
      theme: "Lanterns, timber, and barrels give the pirates’ storeroom an old-tavern feel. The room page lists up to eight players. PanIQ’s FAQ lists seven.",
      website: "https://paniqescaperoom.com/sacramento/en/escape-rooms/pirates-of-tortuga",
      booking: "https://paniqescaperoom.com/sacramento/en/booking/escape-room/pirates-of-tortuga?date=2027-01-16&limit=7#day-jump",
      photos: [
        ["tortuga-room", "Guest photo of the pirate room with timber trim, lanterns, a flag, and barrels", "https://morty.app/attraction/44491/pirates-of-tortuga"],
        ["tortuga-props", "A candle, coins, and a model ship on a wooden table"],
        ["tortuga-skulls", "Skulls and bones from the Pirates of Tortuga photo gallery", "https://morty.app/attraction/44491/pirates-of-tortuga"],
      ],
    },
    {
      id: "fortunes-favor",
      name: "Fortune’s Favor",
      type: "Exit Strategy Games · Enchanted forest",
      address: "1831 I St",
      fromSnug: { mode: "walking", time: "20 min walk from The Snug" },
      note: "$35 each for eight · 60 min · Private room",
      theme: "Trace a missing friend through an enchanted grove with a stone well and a little woodland hut. Closest fit for a classic fantasy quest.",
      website: "https://exitstrategygames.com/fortunes-favor/",
      booking: "https://offthecouch.io/book/escapesac/fortunes",
      photos: [
        ["fortune-woods", "Enchanted forest set with textured trees and a stone well"],
        ["fortune-hut", "Woodland hut with a glowing window in Fortune’s Favor"],
        ["fortune-well", "Lanterns on the rim of the stone well", "https://worldofescapes.com/companies/escape-sacramento"],
      ],
      photoSource: "https://roomescapeartist.com/2023/02/20/escape-sacramento-fortunes-favor-review/",
    },
    {
      id: "skull-witch",
      name: "The Legend of the Skull Witch",
      type: "Enchambered · Cursed bayou cabin",
      address: "2230 Arden Way #C",
      fromSnug: { mode: "driving", time: "6.7 mi from The Snug" },
      note: "$45 each on Saturday · 60 min · Up to eight\nAcross town from the bars · About 5–8 min walk to Punch Line",
      theme: "A candlelit swamp cabin full of wooden totems and witchcraft. Enchambered is a drive from the bars and a short walk from Punch Line and Pete’s Arden.",
      website: "https://www.enchambered.com/booking/skull-witch/",
      fromBars: [
        ["The Cabin", "4.7 mi · 10–15 min"],
        ["The Snug", "6.7 mi · 12–20 min"],
        ["Shady Lady Saloon", "6.7 mi · 12–20 min"],
        ["O’Mally’s Pub", "7.3 mi · 15–20 min"],
      ],
      photos: [
        ["skull-witch-cabin", "Wooden cabin shelves with bottles and candlelight"],
        ["skull-witch-tree", "Green lanterns suspended in the bayou set"],
        ["skull-witch-totems", "Wooden masks and totems along a purple-lit wall"],
      ],
      photoSource: "https://roomescapeartist.com/2019/04/09/enchambered-the-legend-of-the-skull-witch-review/",
    },
  ],
};

const ballotTitles = { bar: "Vote for a bar", dinner: "Vote for dinner", room: "Vote for an escape room" };
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
const deckOpeners = Array.from(document.querySelectorAll("[data-open-ballot]"));
const seatingOpener = document.querySelector('[data-open-dialog="seating-voting"]');
const seatingButtons = Array.from(document.querySelectorAll('[data-vote="seating"][aria-pressed]'));
const clearSeating = document.querySelector("[data-clear-seating]");
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
  const selector = scope ? `[data-ballot-status="${scope}"]` : "[data-ballot-status]";
  for (const status of document.querySelectorAll(selector)) status.textContent = message;
}

function voteCount(field, choice) {
  return callingCards.filter((card) => card[field] === choice).length;
}

function voteTally(field, choice) {
  if (!connected && !callingCards.length) return "Tally unavailable";
  const count = voteCount(field, choice);
  return `${count} ${count === 1 ? "vote" : "votes"}`;
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
  venueVote.textContent = selected?.[activeDeck] === venue.id ? "Voted" : "Vote";
  venueDialog.querySelector("[data-venue-tally]").textContent = voteTally(activeDeck, venue.id);
  clearVenue.hidden = !selected?.[activeDeck];

  for (const button of deckOpeners) {
    const field = button.dataset.openBallot;
    const choice = venues[field].find(({ id }) => id === selected?.[field]);
    button.firstChild.textContent = choice ? `Your vote · ${choice.name} ` : `${ballotTitles[field]} `;
  }
  for (const button of seatingButtons) {
    button.querySelector("[data-seating-tally]").textContent = voteTally("seating", button.dataset.choice);
  }
  const seatingChoice = seatingButtons.find((button) => button.dataset.choice === selected?.seating);
  seatingOpener.firstChild.textContent = seatingChoice ? `Your vote · ${seatingChoice.querySelector("strong").textContent} ` : "Vote on seating ";
  clearSeating.hidden = !selected?.seating;
}

function selectGuest(id) {
  activeGuest = id;
  try {
    window.localStorage.setItem(ballotGuestKey, id);
  } catch {
    // The selected calling card still works for this visit.
  }
  if (connected) setStatus();
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
  const trip = venue.toComedy || venue.fromSnug;
  venueDialog.querySelector("[data-venue-type]").textContent = venue.type;
  venueDialog.querySelector("[data-venue-name]").textContent = venue.name;
  venueDialog.querySelector("[data-venue-address]").textContent = trip ? `${venue.address} · ${trip.time}` : venue.address;
  venueDialog.querySelector("[data-venue-short]").textContent = venue.note;
  venueDialog.querySelector("[data-venue-theme]").textContent = venue.theme;
  venueDialog.querySelector("[data-venue-site]").href = venue.website;
  const booking = venueDialog.querySelector("[data-venue-booking]");
  booking.hidden = !venue.booking;
  if (venue.booking) booking.href = venue.booking;
  const directions = venueDialog.querySelector("[data-venue-directions]");
  directions.hidden = !trip;
  if (trip) {
    const address = `${venue.address}, Sacramento, CA`;
    const route = new URLSearchParams({
      api: "1",
      origin: venue.toComedy ? `${venue.name}, ${address}` : "The Snug, 1800 15th St, Sacramento, CA",
      destination: venue.toComedy ? "Punch Line Sacramento, 2100 Arden Way #225, Sacramento, CA" : address,
      travelmode: trip.mode,
    });
    directions.firstChild.textContent = venue.toComedy ? "Route to Punch Line " : "Route from The Snug ";
    directions.href = `https://www.google.com/maps/dir/?${route}`;
  }
  const barRoutes = venueDialog.querySelector("[data-bar-routes]");
  barRoutes.hidden = !venue.fromBars;
  barRoutes.replaceChildren(...(venue.fromBars ?? []).flatMap(([name, distance]) => {
    const bar = document.createElement("dt");
    bar.textContent = name;
    const drive = document.createElement("dd");
    drive.textContent = distance;
    return [bar, drive];
  }));
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

for (const button of deckOpeners) {
  button.addEventListener("click", () => {
    activeDeck = button.dataset.openBallot;
    const currentChoice = selectedCard()?.[activeDeck];
    const currentIndex = venues[activeDeck].findIndex(({ id }) => id === currentChoice);
    venueIndex = Math.max(currentIndex, 0);
    venueDialog.querySelector("[data-venue-ballot-title]").textContent = ballotTitles[activeDeck];
    if (connected) setStatus("venue", currentChoice && currentIndex < 0 ? "Choose again from the updated venues." : "");
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
    if (!connected) setStatus();
    connected = true;
  } catch {
    if (version !== saveVersion) return;
    connected = false;
    setStatus(null, "Shared voting is unavailable.");
  } finally {
    refreshing = false;
    renderVotingState();
  }
}

async function saveVote({ currentTarget }) {
  if (!connected || saving) return;
  const { vote, choice } = currentTarget.dataset;
  const panel = currentTarget.closest("[data-ballot-panel]");
  const scope = panel.dataset.ballotPanel;
  if (!activeGuest) {
    setStatus(scope, "Choose your name to vote.");
    panel.querySelector("[data-ballot-guest]").focus();
    return;
  }
  if (selectedCard()?.[vote] === choice) return;

  saveVersion += 1;
  saving = true;
  renderVotingState();
  setStatus(scope, "Saving…");
  try {
    callingCards = await requestCallingCards({ inviteeId: activeGuest, [vote]: choice });
    if (scope !== "venue" || vote === activeDeck) setStatus(scope, choice ? "Vote saved." : "Vote cleared.");
  } catch {
    if (scope !== "venue" || vote === activeDeck) setStatus(scope, "Vote could not be saved. Try again.");
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
