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
    {
      id: "pier-50-sushi",
      name: "Pier 50 Sushi",
      type: "Arden Fair · Japanese dining room",
      address: "1735 Arden Way #200",
      toComedy: { mode: "walking", time: "About 10 min walk to Punch Line" },
      note: "All-you-can-eat dinner starts at $34.95. Vegetarian choices include edamame and avocado, cucumber, and asparagus rolls.",
      theme: "A locally owned sushi dining room with wood tables, banquettes, and low lighting. Reservations for groups of five or more.",
      website: "https://www.pier50sushi.com/_files/ugd/bc4c66_da1ee28156a24315b92e6fd4df438bd0.pdf",
      websiteLabel: "Menu",
      booking: "https://tables.toasttab.com/restaurants/cdcb8ac0-9b57-4489-94aa-53545d8be53a/findTime",
      photos: [
        ["pier-50-room", "Wood tables and banquette seating in Pier 50’s Arden dining room", "https://restaurantjun.com/japanese-restaurant-near-me/pier-50-sushi-arden/"],
        ["pier-50-plates", "Spicy rolls and sashimi served at Pier 50", "https://restaurantjun.com/japanese-restaurant-near-me/pier-50-sushi-arden/"],
        ["pier-50-arden", "Pier 50’s Arden dining room and sushi counter"],
      ],
      photoSource: "https://www.pier50sushi.com/",
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
const venueVotePrompts = { bar: "for a bar", dinner: "for dinner", room: "for an escape room location" };
const planChoiceLabels = {
  transport: "Ride or car", dndHost: "Friday D&D host",
  breakfast: "Breakfast", bar: "Bar", room: "Escape room", dinner: "Dinner", seating: "Comedy seating",
};
const dashboard = document.querySelector("[data-view]");
const scheduleTabs = Array.from(document.querySelectorAll('[role="tab"]'));
const compactViews = window.matchMedia("(max-width: 48rem), (max-height: 40rem)");
const showParty = document.querySelector("[data-show-party]");
const roster = document.querySelector("[data-response-list]");
const guestSelectors = Array.from(document.querySelectorAll("[data-ballot-guest]"));
const carOffer = document.querySelector("[data-car-offer]");
const designatedDriverInput = document.querySelector("[data-designated-driver]");
const driverSummary = document.querySelector("[data-driver-count]");
const driverPanel = carOffer.closest("[data-ballot-panel]");
const driverOpener = document.querySelector('[data-open-dialog="transportation"]');
const driverChoices = driverPanel.querySelector(".driver-choices");
const driverGuestButton = driverPanel.querySelector("[data-choose-transport-guest]");
const venueDialog = document.querySelector("#venue-voting");
const venueVote = venueDialog.querySelector("[data-venue-vote]");
const clearVenue = venueDialog.querySelector("[data-clear-venue]");
const flipButton = venueDialog.querySelector("[data-flip-card]");
const venueSnapshot = document.querySelector("#venue-snapshot");
const voteButtons = Array.from(document.querySelectorAll("[data-vote]"));
const retryButtons = Array.from(document.querySelectorAll("[data-ballot-retry]"));
const deckOpeners = Array.from(document.querySelectorAll("[data-open-ballot]"));
const polls = [
  { field: "dndHost", dialogId: "dnd-host", prompt: "on hosting Friday’s D&D game" },
  { field: "breakfast", dialogId: "breakfast", prompt: "on Bubba’s Bagels" },
  { field: "seating", dialogId: "seating-voting", prompt: "on seating" },
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
const orderDetails = breakfastPanel.querySelector("[data-breakfast-order]");
const orderInput = orderDetails.querySelector("textarea");
const pickupOrders = breakfastPanel.querySelector("[data-pickup-orders]");
const pickupEmpty = breakfastPanel.querySelector("[data-pickup-empty]");
const planSubmit = document.querySelector("[data-plan-submit]");
const planPanel = planSubmit.closest("[data-ballot-panel]");
const ballotStoreUrl = persistenceConfig.ballotEndpointUrl ?? remoteStoreUrl;
const ballotGuestKey = "bachelor-party-calling-card-guest";
const draftChoices = new Map();

let activeGuest = "";
let activeDeck = "bar";
let venueIndex = 0;
let callingCards = [];
let connected = false;
let refreshing = false;
let submitting = false;
let saveVersion = 0;

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

function currentChoices(saved = selectedCard()) {
  return { ...saved, ...draftChoices.get(activeGuest) };
}

function setStatus(scope, message = "") {
  const selector = scope ? `[data-ballot-status="${scope}"]` : "[data-ballot-status]";
  for (const status of document.querySelectorAll(selector)) {
    if (status.textContent !== message) status.textContent = message;
  }
}

function voteCount(field, choice) {
  return callingCards.filter((card) => card.planSubmitted && card[field] === choice).length;
}

function voteTally(field, choice) {
  if (!connected && !callingCards.length) return "Tally unavailable";
  const count = voteCount(field, choice);
  return `${count} ${count === 1 ? "vote" : "votes"}`;
}

function renderVoteSummaries() {
  if (!connected && !callingCards.length) {
    const status = refreshing ? "Loading votes…" : "Votes unavailable";
    for (const { display } of voteSummaries) display.textContent = status;
    driverSummary.textContent = status;
    return;
  }
  for (const { display, field, options } of voteSummaries) {
    display.textContent = options.map(({ id, name }) => `${name} · ${voteTally(field, id)}`).join(" / ");
  }
  const drivers = voteCount("designatedDriver", true);
  const riders = voteCount("drive", "rider");
  const cars = voteCount("car", "offer");
  const driverTally = drivers > 2 ? `${drivers} designated drivers` : `${drivers}/2 designated drivers`;
  const carTally = cars > 2 ? `${cars} cars` : `${cars}/2 cars`;
  driverSummary.textContent = `${driverTally} · ${riders} ${riders === 1 ? "rider" : "riders"} · ${carTally}`;
}

function renderVoteButton(button, prompt, name) {
  const action = name ? "Change your vote" : "Vote";
  const detail = name ? `Your vote is ${name}.` : "";
  button.textContent = name ? "Change" : "Vote";
  button.setAttribute("aria-label", detail ? `${action} ${prompt}. ${detail}` : `${action} ${prompt}`);
  button.title = detail;
  button.toggleAttribute("data-voted", Boolean(name));
}

function renderBreakfastOrders(card) {
  const order = card.breakfastOrder ?? "";
  if (orderInput.value !== order) orderInput.value = order;
  orderDetails.hidden = card.breakfast !== "bubbas";
  orderInput.readOnly = !connected || submitting;

  const rows = party.flatMap(({ id, name }) => {
    const voter = callingCards.find(({ inviteeId }) => inviteeId === id);
    if (!voter?.planSubmitted || voter.breakfast !== "bubbas") return [];
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

function renderPlanSubmission(card, saved) {
  const missing = [];
  const offered = card.drive === "volunteer" && card.car === "offer";
  if (card.drive !== "rider" && !offered) missing.push("transport");
  for (const { field, options } of voteSummaries) {
    if (!options.some(({ id }) => id === card[field])) missing.push(field);
  }
  const changed = Object.entries(draftChoices.get(activeGuest) ?? {}).some(([field, value]) => {
    if (field === "breakfastOrder") {
      return card.breakfast === "bubbas" && value.trim() !== (saved?.breakfastOrder ?? "");
    }
    return value !== saved?.[field];
  });
  const submitted = saved?.planSubmitted === true && !changed;
  planSubmit.disabled = !connected || !activeGuest || submitting || missing.length > 0 || submitted;
  planSubmit.textContent = submitted ? "Votes submitted" : "Submit Votes";
  planSubmit.toggleAttribute("data-submitted", submitted);

  let progress = activeGuest ? "" : "Choose your name to see what’s left.";
  if (activeGuest && connected) {
    if (missing.length) progress = `Still needed · ${missing.map((field) => planChoiceLabels[field]).join(" · ")}`;
    else if (!submitted && !submitting) progress = "Choices ready to submit.";
  }
  planPanel.querySelector("[data-plan-progress]").textContent = progress;
  planPanel.querySelector("[data-plan-tally]").textContent = connected
    ? `${voteCount("planSubmitted", true)} of ${party.length} plan votes submitted`
    : "";
}

function renderVotingState() {
  const saved = selectedCard();
  const selected = currentChoices(saved);
  const submitted = saved?.planSubmitted ? saved : undefined;
  const controlsDisabled = !connected || submitting;
  const offered = selected.drive === "volunteer" && selected.car === "offer";
  const transportSaved = Boolean(submitted);
  driverOpener.textContent = transportSaved ? "Change" : "Vote";
  driverOpener.setAttribute("aria-label", transportSaved ? "Change your transportation vote" : "Vote on transportation");
  driverOpener.toggleAttribute("data-voted", transportSaved);
  driverChoices.hidden = !activeGuest;
  driverGuestButton.parentElement.hidden = Boolean(activeGuest);
  designatedDriverInput.checked = selected.designatedDriver === true;
  designatedDriverInput.disabled = controlsDisabled;
  for (const button of voteButtons) {
    const { vote, choice } = button.dataset;
    button.setAttribute("aria-disabled", String(controlsDisabled));
    if (button.hasAttribute("aria-pressed")) {
      const pressed = button === carOffer ? offered : selected[vote] === choice;
      button.setAttribute("aria-pressed", String(pressed));
    }
  }
  for (const selector of guestSelectors) selector.value = activeGuest;
  for (const member of roster.querySelectorAll("[data-calling-card]")) {
    member.setAttribute("aria-pressed", String(member.dataset.callingCard === activeGuest));
  }
  for (const button of retryButtons) button.hidden = connected || refreshing;

  for (const entry of document.querySelectorAll("[data-roll-call]")) {
    const { rollCall, choice } = entry.dataset;
    const names = party.flatMap(({ id, name }) => {
      const card = callingCards.find(({ inviteeId }) => inviteeId === id);
      return card?.planSubmitted && card[rollCall] === choice ? [name] : [];
    });
    entry.textContent = names.join(", ") || (connected ? "None yet" : "Tally unavailable");
  }

  const deck = venues[activeDeck];
  const venue = deck[venueIndex];
  const canChange = Boolean(submitted?.[activeDeck]);
  const isSelectedVenue = venue.id === selected[activeDeck];
  const venueAction = canChange ? "Change your vote to" : "Vote for";
  venueVote.textContent = canChange ? "Change" : "Vote";
  venueVote.setAttribute("aria-current", String(isSelectedVenue));
  venueVote.setAttribute("aria-label", canChange && isSelectedVenue ? `Change your choice from ${venue.name}. Browse the next option.` : `${venueAction} ${venue.name}`);
  venueDialog.querySelector("[data-venue-tally]").textContent = voteTally(activeDeck, venue.id);
  clearVenue.hidden = !selected[activeDeck];

  for (const button of deckOpeners) {
    const field = button.dataset.openBallot;
    const choice = venues[field].find(({ id }) => id === submitted?.[field]);
    renderVoteButton(button, venueVotePrompts[field], choice?.name);
  }
  for (const { field, prompt, opener, buttons, clear } of polls) {
    const selection = buttons.find((button) => button.dataset.choice === submitted?.[field]);
    renderVoteButton(opener, prompt, selection?.querySelector("strong").textContent);
    clear.hidden = !selected[field];
    for (const button of buttons) {
      button.querySelector("[data-poll-tally]").textContent = voteTally(field, button.dataset.choice);
    }
  }
  renderVoteSummaries();
  renderBreakfastOrders(selected);
  renderPlanSubmission(selected, saved);
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
  venueDialog.querySelector("[data-venue-ballot-title]").textContent = `Vote ${venueVotePrompts[activeDeck]}`;
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
  clearVenue.dataset.vote = activeDeck;
  flipCard(false);
  renderVotingState();
}

for (const button of deckOpeners) {
  button.addEventListener("click", () => {
    activeDeck = button.dataset.openBallot;
    const currentChoice = currentChoices()[activeDeck];
    const currentIndex = venues[activeDeck].findIndex(({ id }) => id === currentChoice);
    venueIndex = Math.max(currentIndex, 0);
    if (connected) setStatus("venue", currentChoice && currentIndex < 0 ? "Choose again from the updated venues." : "");
    renderVenue();
    showDialog("venue-voting");
  });
}

function stepVenue(step) {
  const length = venues[activeDeck].length;
  venueIndex = (venueIndex + step + length) % length;
  renderVenue();
}

for (const button of venueDialog.querySelectorAll("[data-deck-step]")) {
  button.addEventListener("click", () => stepVenue(Number(button.dataset.deckStep)));
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
  if (refreshing || submitting) return;
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

function stageChoices(panel, choices, message) {
  if (!connected || submitting) {
    renderVotingState();
    return;
  }
  const scope = panel.dataset.ballotPanel;
  if (!activeGuest) {
    renderVotingState();
    const selector = panel.querySelector("[data-ballot-guest]");
    setStatus(scope, "Choose your name to vote.");
    const nameControl = selector ?? driverGuestButton;
    nameControl.focus();
    return;
  }

  draftChoices.set(activeGuest, { ...draftChoices.get(activeGuest), ...choices });
  setStatus("submission");
  setStatus(scope, message);
  renderVotingState();
}

async function submitVotes() {
  if (planSubmit.disabled) return;
  const inviteeId = activeGuest;
  const choices = { ...draftChoices.get(inviteeId) };
  if (currentChoices().breakfast !== "bubbas") delete choices.breakfastOrder;
  saveVersion += 1;
  submitting = true;
  setStatus("submission", "Submitting votes…");
  renderVotingState();
  let refreshAfterFailure = false;
  try {
    callingCards = await requestCallingCards({ inviteeId, ...choices, planSubmitted: true });
    draftChoices.delete(inviteeId);
    setStatus();
  } catch (error) {
    refreshAfterFailure = error.cause === 409;
    setStatus("submission", refreshAfterFailure ? error.message : "Votes could not be submitted. Try again.");
  } finally {
    submitting = false;
    renderVotingState();
    if (refreshAfterFailure) refreshCallingCards();
  }
}

function stageVote({ currentTarget }) {
  const { vote, choice } = currentTarget.dataset;
  const saved = selectedCard();
  const selected = currentChoices(saved);
  if (currentTarget === venueVote && saved?.planSubmitted && choice === selected[vote]) {
    if (!connected || submitting) return;
    setStatus("venue");
    stepVenue(1);
    return;
  }
  const choices = { [vote]: choice };
  if (vote === "drive") {
    choices.car = choice === "volunteer" ? "offer" : "";
  }
  if (Object.entries(choices).every(([field, value]) => selected[field] === value)) return;
  const panel = currentTarget.closest("[data-ballot-panel]");
  const message = choice ? "Selected. Press Submit Votes on Saturday to save." : "Choice cleared. Pick an option before submitting.";
  stageChoices(panel, choices, message);
}

driverGuestButton.addEventListener("click", () => {
  driverPanel.close();
  if (compactViews.matches) showParty.click();
  roster.querySelector("[data-calling-card]")?.focus();
});
designatedDriverInput.addEventListener("change", () => {
  const designatedDriver = designatedDriverInput.checked;
  stageChoices(driverPanel, { designatedDriver }, "Press Submit Votes on Saturday to save your choice.");
});
orderInput.addEventListener("input", () => {
  stageChoices(breakfastPanel, { breakfastOrder: orderInput.value }, "Press Submit Votes on Saturday to save your order.");
});
planSubmit.addEventListener("click", submitVotes);

for (const selector of guestSelectors) {
  for (const member of party) selector.add(new Option(member.name, member.id));
  selector.addEventListener("change", () => {
    if (submitting) {
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
  if (card && !submitting) selectGuest(card.dataset.callingCard);
});

document.addEventListener("DOMContentLoaded", renderVotingState);
for (const button of voteButtons) button.addEventListener("click", stageVote);
for (const button of retryButtons) button.addEventListener("click", refreshCallingCards);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshCallingCards();
});
window.setInterval(() => {
  if (!document.hidden) refreshCallingCards();
}, 30000);
refreshCallingCards();
