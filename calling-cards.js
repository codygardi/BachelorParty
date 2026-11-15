const venues = {
  bar: [
    {
      id: "maple-room",
      name: "Maple Room Lounge",
      type: "Arden · Neighborhood lounge",
      address: "2740 Arden Way #1",
      note: "Saturday from 11 am. 20–25 min walk to Enchambered.",
      theme: "A long bar, bottle shelves, and colored lighting give this neighborhood hangout its character. Karaoke and TVs can make it lively.",
      website: "https://www.restaurantji.com/ca/sacramento/maple-room-lounge-/",
      photos: [
        ["maple-bar", "Maple Room’s back bar with bottles and colorful lighting"],
        ["maple-room", "Seating along the bar at Maple Room Lounge"],
        ["maple-drinks", "Drinks on Maple Room’s dark bar counter"],
      ],
      photoSource: "https://www.restaurantji.com/ca/sacramento/maple-room-lounge-/gallery/",
    },
    {
      id: "snug",
      name: "The Snug",
      type: "Irish cocktail bar",
      address: "1800 15th St",
      note: "Midtown · Opens at 4 pm.",
      theme: "An Irish-built bar with dark timber, red leather booths, and low lighting.",
      website: "https://www.irishhospitalitygroup.com/ro-sham-beaux-1",
      photos: [
        ["snug-room", "Dark wood booths with red upholstery and warm wall lights"],
        ["snug-sign", "The Snug’s blue storefront and gold sign"],
        ["snug-booth", "A tufted red booth beneath a wall of framed paintings"],
      ],
    },
    {
      id: "shady-lady",
      name: "Shady Lady Saloon",
      type: "Vintage saloon · Whiskey cocktails",
      address: "1409 R St",
      note: "Midtown · Saturday from 11 am.",
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
      id: "enchambered",
      name: "Enchambered",
      type: "Arden · Dark fantasy",
      address: "2230 Arden Way #C",
      toComedy: { mode: "walking", time: "5–8 min walk to Punch Line" },
      fromBars: [
        ["maple-room", "walking", "20–25 min walk"],
        ["snug", "driving", "12–20 min drive"],
        ["shady-lady", "driving", "12–20 min drive"],
      ],
      note: "Skull Witch or The Collection · 60 min · Both fit all 8",
      theme: "Search a candlelit bayou cabin in Skull Witch or break a curse in The Collection’s lighthouse. The cabin photos show Skull Witch. The lighthouse image is The Collection’s artwork.",
      website: "https://www.enchambered.com/booking/",
      websiteLabel: "Rooms & booking",
      roomLinks: [
        ["Skull Witch", "https://www.enchambered.com/booking/skull-witch/"],
        ["The Collection", "https://www.enchambered.com/booking/the-collection/"],
      ],
      photos: [
        ["skull-witch-cabin", "Skull Witch’s cabin shelves with bottles and candlelight"],
        ["skull-witch-totems", "Skull Witch’s wooden masks and totems along a purple-lit wall"],
        ["the-collection", "Enchambered’s official artwork for The Collection with a lighthouse above a dark sea", "https://www.enchambered.com/booking/the-collection/"],
      ],
      photoSource: "https://roomescapeartist.com/2019/04/09/enchambered-the-legend-of-the-skull-witch-review/",
    },
    {
      id: "paniq",
      name: "PanIQ",
      type: "Upper Land Park · Pirates of Tortuga",
      address: "2642 5th St",
      toComedy: { mode: "driving", time: "15–20 min drive to Punch Line" },
      fromBars: [
        ["maple-room", "driving", "15–25 min drive"],
        ["snug", "driving", "5–10 min drive"],
        ["shady-lady", "driving", "5–10 min drive"],
      ],
      note: "$40.95 each · 60 min · 2–8 players",
      theme: "Lanterns, timber, and barrels give the pirates’ storeroom an old-tavern feel.",
      website: "https://paniqescaperoom.com/sacramento/en/escape-rooms/pirates-of-tortuga",
      websiteLabel: "Pirates of Tortuga",
      booking: "https://paniqescaperoom.com/sacramento/en/booking/escape-room/pirates-of-tortuga?date=2027-01-16&limit=7#day-jump",
      photos: [
        ["tortuga-room", "Guest photo of the pirate room with timber trim, lanterns, a flag, and barrels", "https://morty.app/attraction/44491/pirates-of-tortuga"],
        ["tortuga-props", "A candle, coins, and a model ship on a wooden table"],
        ["tortuga-skulls", "Skulls and bones from the Pirates of Tortuga photo gallery", "https://morty.app/attraction/44491/pirates-of-tortuga"],
      ],
    },
  ],
};

const punchLineAddress = "Punch Line Sacramento, 2100 Arden Way #225, Sacramento, CA";
const ballotTitles = { bar: "Vote for a bar", dinner: "Vote for dinner", room: "Vote for an escape room location" };
const planChoiceLabels = {
  transport: "Ride or car", passengerSeats: "Passenger seats",
  breakfast: "Breakfast", bar: "Bar", room: "Escape room", dinner: "Dinner", seating: "Comedy seating",
};
const requiredPlanChoices = ["transport", "breakfast", "bar", "room", "dinner", "seating"];
const dashboard = document.querySelector("[data-view]");
const scheduleTabs = Array.from(document.querySelectorAll('[role="tab"]'));
const compactViews = window.matchMedia("(max-width: 48rem), (max-height: 40rem)");
const showParty = document.querySelector("[data-show-party]");
const roster = document.querySelector("[data-response-list]");
const guestSelectors = Array.from(document.querySelectorAll("[data-ballot-guest]"));
const carOffer = document.querySelector("[data-car-offer]");
const passengerField = document.getElementById("car-passengers");
const passengerCount = passengerField.querySelector("select");
const driverPanel = carOffer.closest("[data-ballot-panel]");
const venueDialog = document.querySelector("#venue-voting");
const venueVote = venueDialog.querySelector("[data-venue-vote]");
const clearVenue = venueDialog.querySelector("[data-clear-venue]");
const flipButton = venueDialog.querySelector("[data-flip-card]");
const venueSnapshot = document.querySelector("#venue-snapshot");
const voteButtons = Array.from(document.querySelectorAll("[data-vote]"));
const retryButtons = Array.from(document.querySelectorAll("[data-ballot-retry]"));
const deckOpeners = Array.from(document.querySelectorAll("[data-open-ballot]"));
const polls = [
  { field: "dndHost", dialogId: "dnd-host", prompt: "Vote on hosting Friday’s D&D game" },
  { field: "breakfast", dialogId: "breakfast", prompt: "Vote on Bubba’s Bagels" },
  { field: "seating", dialogId: "seating-voting", prompt: "Vote on seating" },
].map(({ field, dialogId, prompt }) => {
  const dialog = document.getElementById(dialogId);
  return {
    field, prompt,
    opener: document.querySelector(`[data-open-dialog="${dialogId}"]`),
    buttons: Array.from(dialog.querySelectorAll(".poll-option")),
    clear: dialog.querySelector('[data-choice=""]'),
  };
});
const voteSummaries = Array.from(document.querySelectorAll("[data-vote-summary]"), (display) => {
  const field = display.dataset.voteSummary;
  const options = venues[field] ?? polls.find((poll) => poll.field === field).buttons.map((button) => ({
    id: button.dataset.choice,
    name: button.dataset.summaryLabel ?? button.querySelector("strong").textContent,
  }));
  return { display, field, options };
});
const breakfastPanel = document.getElementById("breakfast");
const orderForm = breakfastPanel.querySelector("[data-breakfast-order]");
const orderInput = orderForm.querySelector("textarea");
const orderSave = orderForm.querySelector('[type="submit"]');
const pickupOrders = breakfastPanel.querySelector("[data-pickup-orders]");
const pickupEmpty = breakfastPanel.querySelector("[data-pickup-empty]");
const planSubmit = document.querySelector("[data-plan-submit]");
const planPanel = planSubmit.closest("[data-ballot-panel]");
const ballotStoreUrl = persistenceConfig.ballotEndpointUrl ?? remoteStoreUrl;
const ballotGuestKey = "bachelor-party-calling-card-guest";

let activeGuest = "";
let activeDeck = "bar";
let venueIndex = 0;
let callingCards = [];
let connected = false;
let refreshing = false;
let pendingChoices = null;
let saveVersion = 0;
let orderGuest = "";

function mapLink(origin, destination, mode, waypoints) {
  const params = new URLSearchParams({ api: "1", origin, destination, travelmode: mode });
  if (waypoints) params.set("waypoints", waypoints.join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}

function placeAddress(venue) {
  return `${venue.name}, ${venue.address}, Sacramento, CA`;
}

function renderRoute(selected) {
  const route = ["bar", "room", "dinner"].map((field) => {
    const options = venues[field];
    return options.find(({ id }) => id === selected?.[field]) || options[0];
  });
  document.querySelector("[data-saturday-directions]").href = mapLink(
    placeAddress(route[0]), punchLineAddress, "driving",
    route.slice(1).map(placeAddress),
  );
}

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

function renderVoteSummaries() {
  for (const { display, field, options } of voteSummaries) {
    if (!connected && !callingCards.length) {
      display.textContent = refreshing ? "Loading votes…" : "Votes unavailable";
      continue;
    }
    display.textContent = options.map(({ id, name }) => `${name} · ${voteTally(field, id)}`).join(" / ");
  }
}

function renderVoteButton(button, prompt, saved, name) {
  const detail = name ? `Your vote is ${name}.` : saved ? "Your previous choice was removed. Vote again." : "";
  button.setAttribute("aria-label", detail ? `${prompt}. ${detail}` : prompt);
  button.title = detail;
  button.toggleAttribute("data-voted", Boolean(name));
}

function updateOrderSaveButton() {
  orderSave.disabled = orderForm.hidden || orderInput.readOnly || orderInput.value.trim() === orderInput.defaultValue;
}

function renderBreakfastOrders(card) {
  const ordering = card?.breakfast === "bubbas";
  const savedOrder = card?.breakfastOrder ?? "";
  const hasDraft = ordering && orderGuest === activeGuest && orderInput.value !== orderInput.defaultValue;
  if (!hasDraft) orderInput.value = savedOrder;
  orderInput.defaultValue = savedOrder;
  orderGuest = ordering ? activeGuest : "";
  orderForm.hidden = !ordering;
  orderInput.readOnly = !connected || pendingChoices !== null;
  updateOrderSaveButton();

  const rows = party.flatMap(({ id, name }) => {
    const voter = callingCards.find(({ inviteeId }) => inviteeId === id);
    if (voter?.breakfast !== "bubbas") return [];
    const guest = document.createElement("dt");
    guest.textContent = name;
    const order = document.createElement("dd");
    order.textContent = voter.breakfastOrder || "Order pending";
    return [guest, order];
  });
  pickupOrders.replaceChildren(...rows);
  pickupEmpty.hidden = rows.length > 0;
  pickupEmpty.textContent = connected ? "No Bubba’s votes yet." : refreshing ? "Loading pickup list…" : "Pickup list unavailable";
}

function renderPlanSubmission(card) {
  const missing = card?.missingPlanChoices ?? requiredPlanChoices;
  const submitted = card?.planSubmitted === true;
  planSubmit.disabled = !connected || !activeGuest || pendingChoices !== null || missing.length > 0 || submitted;
  planSubmit.textContent = submitted ? "Votes submitted" : "Submit Votes";
  planSubmit.toggleAttribute("data-submitted", submitted);

  let progress = activeGuest ? "" : "Choose your name to see what’s left.";
  if (activeGuest && connected) {
    if (missing.length) progress = `Still needed · ${missing.map((field) => planChoiceLabels[field]).join(" · ")}`;
    else if (!submitted) progress = "All required choices are saved.";
  }
  planPanel.querySelector("[data-plan-progress]").textContent = progress;
  planPanel.querySelector("[data-plan-tally]").textContent = connected
    ? `${voteCount("planSubmitted", true)} of ${party.length} plan votes submitted`
    : "";
}

function renderVotingState() {
  const selected = selectedCard();
  const controlsDisabled = !connected || pendingChoices !== null;
  const drive = pendingChoices?.drive ?? selected?.drive;
  const offered = drive === "volunteer" && (pendingChoices?.car ?? selected?.car) === "offer";
  passengerField.hidden = !offered;
  passengerCount.value = offered ? pendingChoices?.passengerSeats ?? selected?.passengerSeats ?? "" : "";
  passengerCount.disabled = controlsDisabled;
  for (const button of voteButtons) {
    const { vote, choice } = button.dataset;
    button.setAttribute("aria-disabled", String(controlsDisabled));
    if (button.hasAttribute("aria-pressed")) {
      const pressed = button === carOffer ? offered : (vote === "drive" ? drive : selected?.[vote]) === choice;
      button.setAttribute("aria-pressed", String(pressed));
    }
  }
  for (const selector of guestSelectors) selector.value = activeGuest;
  for (const member of roster.querySelectorAll("[data-calling-card]")) {
    member.setAttribute("aria-pressed", String(member.dataset.callingCard === activeGuest));
  }
  for (const button of retryButtons) button.hidden = connected || refreshing;

  const drivers = voteCount("drive", "volunteer");
  const riders = voteCount("drive", "rider");
  const cars = voteCount("car", "offer");
  const driverTally = drivers > 2 ? `${drivers} volunteers for 2 cars` : `${drivers}/2 drivers`;
  const carTally = cars > 2 ? `${cars} cars offered` : `${cars}/2 cars offered`;
  document.querySelector("[data-driver-count]").textContent = connected || callingCards.length
    ? `${driverTally} · ${riders} ${riders === 1 ? "rider" : "riders"} · ${carTally}`
    : refreshing ? "Loading driver tally…" : "Driver tally unavailable";
  for (const entry of document.querySelectorAll("[data-roll-call]")) {
    const { rollCall, choice } = entry.dataset;
    const names = party.flatMap(({ id, name }) => {
      const card = callingCards.find(({ inviteeId }) => inviteeId === id);
      if (card?.[rollCall] !== choice) return [];
      if (rollCall !== "car") return [name];
      const seats = card.passengerSeats;
      const capacity = seats == null ? "passenger count pending" : `${seats} ${seats === 1 ? "passenger" : "passengers"}`;
      return [`${name} (${capacity})`];
    });
    entry.textContent = names.join(", ") || (connected ? "None yet" : "Tally unavailable");
  }

  const venue = venues[activeDeck][venueIndex];
  venueVote.textContent = selected?.[activeDeck] === venue.id ? "Voted" : "Vote";
  venueDialog.querySelector("[data-venue-tally]").textContent = voteTally(activeDeck, venue.id);
  clearVenue.hidden = !selected?.[activeDeck];

  for (const button of deckOpeners) {
    const field = button.dataset.openBallot;
    const saved = selected?.[field];
    const choice = venues[field].find(({ id }) => id === saved);
    renderVoteButton(button, ballotTitles[field], saved, choice?.name);
  }
  for (const { field, prompt, opener, buttons, clear } of polls) {
    const saved = selected?.[field];
    const selection = buttons.find((button) => button.dataset.choice === saved);
    renderVoteButton(opener, prompt, saved, selection?.querySelector("strong").textContent);
    clear.hidden = !saved;
    for (const button of buttons) {
      button.querySelector("[data-poll-tally]").textContent = voteTally(field, button.dataset.choice);
    }
  }
  renderVoteSummaries();
  renderBreakfastOrders(selected);
  renderPlanSubmission(selected);
  renderRoute(selected);
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
  const trip = venue.toComedy;
  venueDialog.querySelector("[data-venue-ballot-title]").textContent = ballotTitles[activeDeck];
  venueDialog.querySelector("[data-venue-type]").textContent = venue.type;
  venueDialog.querySelector("[data-venue-name]").textContent = venue.name;
  venueDialog.querySelector("[data-venue-address]").textContent = trip ? `${venue.address} · ${trip.time}` : venue.address;
  venueDialog.querySelector("[data-venue-short]").textContent = venue.note;
  venueDialog.querySelector("[data-venue-theme]").textContent = venue.theme;
  const site = venueDialog.querySelector("[data-venue-site]");
  site.href = venue.website;
  site.firstChild.textContent = `${venue.websiteLabel ?? "Venue details"} `;
  const roomLinks = venueDialog.querySelector("[data-room-links]");
  roomLinks.hidden = !venue.roomLinks;
  roomLinks.replaceChildren(...(venue.roomLinks ?? []).map(([label, url]) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = `${label} ↗`;
    return link;
  }));
  const booking = venueDialog.querySelector("[data-venue-booking]");
  booking.hidden = !venue.booking;
  if (venue.booking) booking.href = venue.booking;
  const directions = venueDialog.querySelector("[data-venue-directions]");
  directions.hidden = !trip;
  if (trip) directions.href = mapLink(placeAddress(venue), punchLineAddress, trip.mode);
  const barRoutes = venueDialog.querySelector("[data-bar-routes]");
  barRoutes.hidden = !venue.fromBars;
  barRoutes.replaceChildren(...(venue.fromBars ?? []).flatMap(([id, mode, time]) => {
    const bar = venues.bar.find((option) => option.id === id);
    const name = document.createElement("dt");
    name.textContent = bar.name;
    const travel = document.createElement("dd");
    const link = document.createElement("a");
    link.href = mapLink(placeAddress(bar), placeAddress(venue), mode);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = `${time} ↗`;
    link.setAttribute("aria-label", `Directions from ${bar.name}: ${time}`);
    travel.append(link);
    return [name, travel];
  }));
  const credit = venueDialog.querySelector("[data-venue-credit]");
  credit.textContent = venue.photos.length === 1 ? "Image source ↗" : "Photo sources ↗";
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
  if (result.status === 409) throw new Error(payload.error, { cause: 409 });
  if (!result.ok || !Array.isArray(payload.ballots)) throw new Error("Shared calling cards are unavailable.");
  return payload.ballots;
}

async function refreshCallingCards() {
  if (refreshing || pendingChoices) return;
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

async function saveChoices(panel, choices, successMessage) {
  if (!connected || pendingChoices) {
    renderVotingState();
    return;
  }
  const scope = panel.dataset.ballotPanel;
  if (!activeGuest) {
    renderVotingState();
    const selector = panel.querySelector("[data-ballot-guest]");
    setStatus(scope, selector ? "Choose your name to vote." : "Choose your name from the party roster.");
    const nameControl = selector ?? (compactViews.matches ? showParty : roster.querySelector("[data-calling-card]"));
    nameControl?.focus();
    return;
  }

  const deckAtSave = activeDeck;
  saveVersion += 1;
  pendingChoices = choices;
  renderVotingState();
  if (scope !== "submission" && scope !== "dndHost" && !Object.hasOwn(choices, "breakfastOrder")) setStatus("submission");
  setStatus(scope, "Saving…");
  let refreshAfterFailure = false;
  try {
    callingCards = await requestCallingCards({ inviteeId: activeGuest, ...choices });
    if (scope !== "venue" || deckAtSave === activeDeck) setStatus(scope, successMessage);
  } catch (error) {
    refreshAfterFailure = error.cause === 409;
    if (refreshAfterFailure) {
      setStatus(scope, error.message);
    } else if (scope === "submission") {
      setStatus(scope, "Plan vote could not be submitted. Try again.");
    } else if (Object.hasOwn(choices, "breakfastOrder")) {
      setStatus(scope, "Order could not be saved. Try again.");
    } else if (scope !== "venue" || deckAtSave === activeDeck) {
      setStatus(scope, "Vote could not be saved. Try again.");
    }
  } finally {
    pendingChoices = null;
    renderVotingState();
    if (refreshAfterFailure) refreshCallingCards();
  }
}

function saveVote({ currentTarget }) {
  const { vote, choice } = currentTarget.dataset;
  const selected = selectedCard();
  const choices = { [vote]: choice };
  let message = choice ? "Vote saved." : "Vote cleared.";
  if (vote === "drive") {
    choices.car = choice === "volunteer" ? "offer" : "";
    message = choice === "volunteer" ? "Car offer saved." : "Ride request saved.";
  }
  if (Object.entries(choices).every(([field, value]) => selected?.[field] === value)) return;
  const panel = currentTarget.closest("[data-ballot-panel]");
  return saveChoices(panel, choices, message);
}

passengerCount.addEventListener("change", () => {
  if (passengerField.hidden || passengerCount.value === "") return;
  saveChoices(driverPanel, { car: "offer", passengerSeats: Number(passengerCount.value) }, "Passenger count saved.");
});
orderInput.addEventListener("input", updateOrderSaveButton);
orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (orderSave.disabled) return;
  const breakfastOrder = orderInput.value.trim();
  orderInput.value = breakfastOrder;
  saveChoices(breakfastPanel, { breakfastOrder }, breakfastOrder ? "Order saved." : "Order cleared.");
});
planSubmit.addEventListener("click", () => {
  if (!planSubmit.disabled) saveChoices(planPanel, { planSubmitted: true }, "");
});

for (const selector of guestSelectors) {
  for (const member of party) selector.add(new Option(member.name, member.id));
  selector.addEventListener("change", () => {
    if (pendingChoices) {
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
  if (card && !pendingChoices) selectGuest(card.dataset.callingCard);
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
