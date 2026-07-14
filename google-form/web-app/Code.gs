const BACHELOR_PARTY = {
  title: "Robbie's Bachelor Party RSVP - January 2027",
  sheetProperty: 'BACHELOR_PARTY_SPREADSHEET_ID',
  sheets: {
    invitees: 'Invitees',
    responses: 'Responses',
    updates: 'Updates'
  },
  invitees: [
    { name: 'Max Voorhees', phone: '5302103099' },
    { name: 'Thomas Correll', phone: '5302637719' },
    { name: 'Jonno Christie', phone: '8053414024' },
    { name: 'Lane Carleson', phone: '5309136251' },
    { name: 'Sean Fitzhenry', phone: '5305598103' },
    { name: 'Andrew Kostolefsky', phone: '5305595048' },
    { name: 'Cody Gardi', phone: '9253938441' }
  ],
  weekends: [
    'Weekend of Jan 9: Friday afternoon Jan 8 + Saturday Jan 9',
    'Weekend of Jan 16: Friday afternoon Jan 15 + Saturday Jan 16',
    'Weekend of Jan 23: Friday afternoon Jan 22 + Saturday Jan 23',
    'None of these weekends work for me'
  ],
  defaultUpdates: [
    ['Location', 'Grass Valley, CA', 'Open in Google Maps', 'https://www.google.com/maps/search/?api=1&query=Grass%20Valley%2C%20CA'],
    ['Flights', 'Look up flights once your travel window is clear.', 'Open Google Flights', 'https://www.google.com/travel/flights'],
    ['What to bring', 'Will be updated after finalizing a weekend.', '', ''],
    ['Activities', 'Will be updated after finalizing a weekend.', '', ''],
    ['Est. Cost', 'Will be updated after finalizing a weekend.', '', '']
  ]
};

function setupBachelorPartyWebApp() {
  const spreadsheet = getOrCreateSpreadsheet_();
  ensureInviteesSheet_(spreadsheet);
  ensureResponsesSheet_(spreadsheet);
  ensureUpdatesSheet_(spreadsheet);

  Logger.log('Tracker spreadsheet: ' + spreadsheet.getUrl());
  Logger.log('Fill phone numbers in the Invitees tab.');
  Logger.log('After deploying as a web app, send the shared web app URL to everyone.');
}

function writeInviteLinksToSheet(webAppUrl) {
  if (!webAppUrl) {
    throw new Error('Pass the deployed web app URL, for example writeInviteLinksToSheet("https://script.google.com/macros/s/.../exec").');
  }

  const spreadsheet = getOrCreateSpreadsheet_();
  const sheet = ensureInviteesSheet_(spreadsheet);
  const rows = sheet.getLastRow() - 1;

  if (rows < 1) {
    return;
  }

  const tokens = sheet.getRange(2, 3, rows, 1).getValues();
  const links = tokens.map(function(row) {
    const token = row[0];
    return [token ? webAppUrl + '?t=' + encodeURIComponent(token) : ''];
  });

  sheet.getRange(2, 4, links.length, 1).setValues(links);
}

function writeInviteLinksForDeployment() {
  const webAppUrl = ScriptApp.getService().getUrl();

  if (!webAppUrl) {
    throw new Error('Deploy the project as a web app first, then run writeInviteLinksForDeployment.');
  }

  writeInviteLinksToSheet(webAppUrl);
}

function doGet(event) {
  const template = HtmlService.createTemplateFromFile('Index');
  template.initialToken = event && event.parameter && event.parameter.t ? event.parameter.t : '';
  template.appTitle = BACHELOR_PARTY.title;

  return template.evaluate()
    .setTitle(BACHELOR_PARTY.title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getPublicConfig() {
  return {
    ok: true,
    title: BACHELOR_PARTY.title,
    inviteeNames: getInvitees_().map(function(invitee) {
      return invitee.name;
    }),
    weekends: BACHELOR_PARTY.weekends,
    updates: getUpdates_()
  };
}

function getStateForToken(token) {
  const invitee = getInviteeByToken_(token);

  if (!invitee) {
    return {
      ok: false,
      error: 'This invite link was not recognized. Please use the shared link and select your name.'
    };
  }

  return buildState_(invitee);
}

function getStateForName(name) {
  const invitee = getInviteeByName_(name);

  if (!invitee) {
    return {
      ok: false,
      error: 'That name is not on the invite list.'
    };
  }

  return buildState_(invitee);
}

function verifyInvitee(name, phone) {
  const invitee = getInviteeByName_(name);

  if (!invitee) {
    return {
      ok: false,
      error: 'That name is not on the invite list.'
    };
  }

  if (!invitee.phone) {
    return {
      ok: false,
      error: 'This invitee does not have a phone number saved yet. Add it in the Invitees tab before sending the link.'
    };
  }

  if (!phoneMatches_(invitee.phone, phone)) {
    return {
      ok: false,
      error: 'That phone number does not match the selected invitee.'
    };
  }

  return buildState_(invitee);
}

function submitRsvp(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const invitee = getInviteeByToken_(payload && payload.token);

    if (!invitee) {
      return {
        ok: false,
        error: 'Your invite session expired. Please reopen the invite link and select your name again.'
      };
    }

    const existingResponse = getResponseByToken_(invitee.token);
    if (existingResponse) {
      return buildState_(invitee);
    }

    const rsvp = String(payload.rsvp || '').trim();
    const availability = Array.isArray(payload.availability) ? payload.availability : [];
    const notes = String(payload.notes || '').trim();

    if (!rsvp) {
      return {
        ok: false,
        error: 'Please choose an RSVP option.'
      };
    }

    if (availability.length < 1) {
      return {
        ok: false,
        error: 'Please select at least one availability option.'
      };
    }

    const spreadsheet = getOrCreateSpreadsheet_();
    const responsesSheet = ensureResponsesSheet_(spreadsheet);
    responsesSheet.appendRow([
      new Date(),
      invitee.token,
      invitee.name,
      invitee.phone,
      rsvp,
      availability.join(', '),
      notes
    ]);

    return buildState_(invitee);
  } finally {
    lock.releaseLock();
  }
}

function buildState_(invitee) {
  return {
    ok: true,
    title: BACHELOR_PARTY.title,
    token: invitee.token,
    invitee: {
      name: invitee.name,
      phone: formatPhone_(invitee.phone)
    },
    weekends: BACHELOR_PARTY.weekends,
    updates: getUpdates_(),
    response: getResponseByToken_(invitee.token)
  };
}

function getOrCreateSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty(BACHELOR_PARTY.sheetProperty);

  if (existingId) {
    try {
      return SpreadsheetApp.openById(existingId);
    } catch (error) {
      properties.deleteProperty(BACHELOR_PARTY.sheetProperty);
    }
  }

  const spreadsheet = SpreadsheetApp.create(BACHELOR_PARTY.title + ' Tracker');
  properties.setProperty(BACHELOR_PARTY.sheetProperty, spreadsheet.getId());
  return spreadsheet;
}

function ensureInviteesSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(BACHELOR_PARTY.sheets.invitees) || spreadsheet.insertSheet(BACHELOR_PARTY.sheets.invitees);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Name', 'Phone', 'Token', 'Invite link']);
  }

  const rows = Math.max(sheet.getLastRow() - 1, 0);
  const values = rows ? sheet.getRange(2, 1, rows, 4).getValues() : [];
  const existingNames = values.map(function(row) {
    return String(row[0] || '').trim().toLowerCase();
  });

  BACHELOR_PARTY.invitees.forEach(function(invitee) {
    const normalizedName = invitee.name.trim().toLowerCase();
    const existingIndex = existingNames.indexOf(normalizedName);

    if (existingIndex === -1) {
      sheet.appendRow([invitee.name, invitee.phone, Utilities.getUuid(), '']);
      return;
    }

    const sheetRow = existingIndex + 2;
    const existing = values[existingIndex];

    if (String(existing[0] || '').trim() !== invitee.name) {
      sheet.getRange(sheetRow, 1).setValue(invitee.name);
    }

    if (normalizePhone_(existing[1]) !== normalizePhone_(invitee.phone)) {
      sheet.getRange(sheetRow, 2).setValue(invitee.phone);
    }
  });

  const refreshedRows = Math.max(sheet.getLastRow() - 1, 0);
  if (refreshedRows > 0) {
    const tokens = sheet.getRange(2, 3, refreshedRows, 1).getValues();
    const tokenUpdates = tokens.map(function(row) {
      return [row[0] || Utilities.getUuid()];
    });
    sheet.getRange(2, 3, tokenUpdates.length, 1).setValues(tokenUpdates);
  }

  sheet.autoResizeColumns(1, 4);
  return sheet;
}

function ensureResponsesSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(BACHELOR_PARTY.sheets.responses) || spreadsheet.insertSheet(BACHELOR_PARTY.sheets.responses);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Token', 'Name', 'Phone', 'RSVP', 'Availability', 'Notes']);
  }

  sheet.autoResizeColumns(1, 7);
  return sheet;
}

function ensureUpdatesSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(BACHELOR_PARTY.sheets.updates) || spreadsheet.insertSheet(BACHELOR_PARTY.sheets.updates);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Section', 'Details', 'Link Label', 'Link URL']);
    BACHELOR_PARTY.defaultUpdates.forEach(function(row) {
      sheet.appendRow(row);
    });
  } else {
    ensureUpdatesColumns_(sheet);
    ensureDefaultUpdateRows_(sheet);
  }

  sheet.autoResizeColumns(1, 4);
  return sheet;
}

function ensureUpdatesColumns_(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 4));
  const headers = headerRange.getValues()[0];

  if (headers[0] !== 'Section') {
    sheet.getRange(1, 1).setValue('Section');
  }

  if (headers[1] !== 'Details') {
    sheet.getRange(1, 2).setValue('Details');
  }

  if (headers[2] !== 'Link Label') {
    sheet.getRange(1, 3).setValue('Link Label');
  }

  if (headers[3] !== 'Link URL') {
    sheet.getRange(1, 4).setValue('Link URL');
  }
}

function ensureDefaultUpdateRows_(sheet) {
  const rows = Math.max(sheet.getLastRow() - 1, 0);
  const existingRows = rows ? sheet.getRange(2, 1, rows, 4).getValues() : [];
  const existingSections = existingRows.map(function(row) {
    return String(row[0] || '').trim().toLowerCase();
  });

  BACHELOR_PARTY.defaultUpdates.forEach(function(row) {
    const section = String(row[0]).trim().toLowerCase();
    const rowIndex = existingSections.indexOf(section);

    if (rowIndex === -1) {
      sheet.appendRow(row);
      return;
    }

    const sheetRow = rowIndex + 2;
    const existing = existingRows[rowIndex];
    if (!existing[1] && row[1]) {
      sheet.getRange(sheetRow, 2).setValue(row[1]);
    }
    if (!existing[2] && row[2]) {
      sheet.getRange(sheetRow, 3).setValue(row[2]);
    }
    if (!existing[3] && row[3]) {
      sheet.getRange(sheetRow, 4).setValue(row[3]);
    }
  });
}

function getInvitees_() {
  const spreadsheet = getOrCreateSpreadsheet_();
  const sheet = ensureInviteesSheet_(spreadsheet);
  const rows = Math.max(sheet.getLastRow() - 1, 0);
  const configuredInvitees = getConfiguredInviteesByName_();

  if (rows < 1) {
    return [];
  }

  return sheet.getRange(2, 1, rows, 4).getValues()
    .filter(function(row) {
      return row[0] && row[2] && configuredInvitees[String(row[0]).trim().toLowerCase()];
    })
    .map(function(row) {
      const configuredInvitee = configuredInvitees[String(row[0]).trim().toLowerCase()];
      return {
        name: String(row[0]).trim(),
        phone: String(row[1] || configuredInvitee.phone || '').trim(),
        token: String(row[2]).trim(),
        inviteLink: String(row[3] || '').trim()
      };
    });
}

function getConfiguredInviteesByName_() {
  return BACHELOR_PARTY.invitees.reduce(function(inviteesByName, invitee) {
    inviteesByName[invitee.name.trim().toLowerCase()] = invitee;
    return inviteesByName;
  }, {});
}

function getInviteeByName_(name) {
  const normalizedName = String(name || '').trim().toLowerCase();
  return getInvitees_().find(function(invitee) {
    return invitee.name.toLowerCase() === normalizedName;
  });
}

function getInviteeByToken_(token) {
  const normalizedToken = String(token || '').trim();
  return getInvitees_().find(function(invitee) {
    return invitee.token === normalizedToken;
  });
}

function getUpdates_() {
  const spreadsheet = getOrCreateSpreadsheet_();
  const sheet = ensureUpdatesSheet_(spreadsheet);
  const rows = Math.max(sheet.getLastRow() - 1, 0);

  if (rows < 1) {
    return BACHELOR_PARTY.defaultUpdates.map(function(row) {
      return {
        title: row[0],
        detail: row[1],
        linkLabel: row[2],
        linkUrl: row[3]
      };
    });
  }

  return sheet.getRange(2, 1, rows, 4).getValues()
    .filter(function(row) {
      return row[0];
    })
    .map(function(row) {
      return {
        title: String(row[0]).trim(),
        detail: String(row[1] || '').trim(),
        linkLabel: String(row[2] || '').trim(),
        linkUrl: String(row[3] || '').trim()
      };
    });
}

function getResponseByToken_(token) {
  const spreadsheet = getOrCreateSpreadsheet_();
  const sheet = ensureResponsesSheet_(spreadsheet);
  const rows = Math.max(sheet.getLastRow() - 1, 0);

  if (rows < 1) {
    return null;
  }

  const values = sheet.getRange(2, 1, rows, 7).getValues();
  const normalizedToken = String(token || '').trim();

  for (let index = 0; index < values.length; index += 1) {
    const row = values[index];
    if (String(row[1]).trim() === normalizedToken) {
      return {
        timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
        rsvp: String(row[4] || ''),
        availability: String(row[5] || '').split(', ').filter(Boolean),
        notes: String(row[6] || '')
      };
    }
  }

  return null;
}

function phoneMatches_(savedPhone, enteredPhone) {
  const saved = normalizePhone_(savedPhone);
  const entered = normalizePhone_(enteredPhone);

  if (!saved || !entered) {
    return false;
  }

  const savedComparable = saved.length > 10 ? saved.slice(-10) : saved;
  const enteredComparable = entered.length > 10 ? entered.slice(-10) : entered;
  return savedComparable === enteredComparable;
}

function normalizePhone_(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function maskPhone_(phone) {
  const digits = normalizePhone_(phone);

  if (digits.length < 4) {
    return '';
  }

  return '***-***-' + digits.slice(-4);
}

function formatPhone_(phone) {
  const digits = normalizePhone_(phone);
  const localDigits = digits.length > 10 ? digits.slice(-10) : digits;

  if (localDigits.length !== 10) {
    return String(phone || '').trim();
  }

  return '(' + localDigits.slice(0, 3) + ') ' + localDigits.slice(3, 6) + '-' + localDigits.slice(6);
}
