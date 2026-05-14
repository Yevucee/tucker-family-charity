/**
 * Google Apps Script: append Property Partnerships enquiries to a Google Sheet.
 *
 * SETUP (once per spreadsheet)
 * 1. Create a Google Sheet in Drive (or open yours). Share it with whoever needs access (e.g. charity +
 *    property partner) — Editor or Viewer as appropriate.
 * 2. Open Extensions → Apps Script. Paste this entire file as Code.gs (replace defaults).
 * 3. Set PROPERTY_ENQUIRY_SPREADSHEET_ID and SHEET_NAME below (Sheet ID from the spreadsheet URL).
 * 4. Optional: set SCRIPT_SECRET to a random string and use the same value in VITE_PROPERTY_ENQUIRY_SECRET.
 * 5. Optional email: NOTIFY_EMAILS (Pam Golding route), NOTIFY_EMAILS_TFC (TFC IDs only — fallback = NOTIFY_EMAILS if empty).
 *    PROPERTY_IDS_OWNER_TFC_CSV lists site property ids that are charity direct (Owner=TFC). Run testNotify for Mail permission.
 *    Then run installPropertyEnquiryChangeTrigger once (installs a Sheet onChange watcher so new rows notify
 *    even if you add them by hand). That run also primes dedupe from the current bottom row when data exists.
 *    You can run primeEnquiryNotifyDedupe_ again later after bulk imports. Deploy → Manage deployments → New version so /exec stays current.
 * 6. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone   ← MUST be “Anyone”, not “Anyone within Org only”.
 *        If this is wrong, the website gets HTML login pages / HTTP 401 and NO rows are appended.
 *    Deploy → copy URL ending in /exec → GitHub secret VITE_PROPERTY_ENQUIRY_SUBMIT_URL (and .env locally).
 *
 * TAB HEADERS (row 1 — create manually so collaborators understand columns):
 * Timestamp | Property ID | Title | Type | Suburb | Name | Email | Phone | Preferred contact | Message | Agent email | Listing URL | Status | Notes | Owner
 * Owner = "Pam Golding" (partnership listings) or "TFC" (charity direct). Set emails per route below; TFC property IDs in PROPERTY_IDS_OWNER_TFC_CSV.
 *
 * The charity website POSTs application/x-www-form-urlencoded with field `json` (same pattern as KITF).
 */

/** From spreadsheet URL: …/spreadsheets/d/THIS_PART/edit */
var PROPERTY_ENQUIRY_SPREADSHEET_ID = "1t5eGqP2OAkoZEiQ5NHlzkrPvgoy8FXtSXlIni670t9A";
/** Tab name (exact match). */
var SHEET_NAME = "Sheet1";
/** Empty = no check. If set, must match VITE_PROPERTY_ENQUIRY_SECRET in the site build. */
var SCRIPT_SECRET = "";
/** Sheet / email label for partnership route (must match column values). */
var OWNER_LABEL_PAM_GOLDING = 'Pam Golding';
/** Sheet / email label for charity-owned direct listings. */
var OWNER_LABEL_TFC = 'TFC';

/**
 * Property IDs (from the website `properties.json`) that are charity direct — Owner column = TFC, mail list = NOTIFY_EMAILS_TFC.
 * Comma-separated, spaces OK. Empty = all enquiries use Pam Golding route.
 */
var PROPERTY_IDS_OWNER_TFC_CSV = 'property-tfc-parkmore-office';

/**
 * Comma-separated addresses for Pam Golding / partnership enquiries (spaces OK).
 * Uses MailApp — quota limits apply (see Google Apps Script quotas).
 */
var NOTIFY_EMAILS = "brett@tuckerfamilycharity.co.za, samuel.polley1@gmail.com";

/**
 * Comma-separated addresses for TFC-owned listing enquiries only.
 * If empty, NOTIFY_EMAILS is used so mail is never silently dropped for TFC IDs.
 */
var NOTIFY_EMAILS_TFC = '';

var LAST_COL_ENQUIRY_ = 15;

function sheetOwnerLabelForPropertyId_(propertyId) {
  var pid = String(propertyId || '').trim();
  if (!PROPERTY_IDS_OWNER_TFC_CSV || !pid) return OWNER_LABEL_PAM_GOLDING;
  var matched = false;
  String(PROPERTY_IDS_OWNER_TFC_CSV).split(',').forEach(function (part) {
    if (String(part).trim() === pid) matched = true;
  });
  return matched ? OWNER_LABEL_TFC : OWNER_LABEL_PAM_GOLDING;
}

/** Resolves Owner from Sheet column O (15) when set; else from property ID whitelist (same as web). */
function ownerLabelFromRowVals_(rowVals, propertyId) {
  var fromCell = String(rowVals[14] || '').trim();
  if (fromCell === OWNER_LABEL_TFC || fromCell === OWNER_LABEL_PAM_GOLDING) return fromCell;
  return sheetOwnerLabelForPropertyId_(propertyId);
}

/** Notification email list JSON string split for MailApp — empty TFC falls back to partnership list. */
function notifyEmailCsvForOwner_(ownerLabel) {
  if (ownerLabel === OWNER_LABEL_TFC) {
    var tfc = String(NOTIFY_EMAILS_TFC || '').trim();
    if (tfc) return tfc;
  }
  return String(NOTIFY_EMAILS || '').trim();
}

/** Optional test from Apps Script editor: Run → send sample mail (Pam Golding route recipients). */
function testNotify() {
  notifyNewEnquiry_({
    timestamp: new Date().toISOString(),
    propertyId: "(test)",
    propertyTitle: "(test)",
    propertyType: "",
    suburb: "",
    visitorName: "Test User",
    visitorEmail: "test@example.com",
    visitorPhone: "+000",
    contactMethod: "email",
    message: "Script notification test.",
    listingUrl: "",
    agentEmail: "",
    owner: OWNER_LABEL_PAM_GOLDING,
  });
}

/**
 * One-time: register an installable trigger so any new enquiry row on SHEET_NAME can send NOTIFY_EMAILS.
 * Run from the Apps Script editor after saving this project (same account as the spreadsheet).
 */
function installPropertyEnquiryChangeTrigger() {
  var handler = 'propertyEnquirySheetOnChange_';
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === handler) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger(handler).forSpreadsheet(PROPERTY_ENQUIRY_SPREADSHEET_ID).onChange().create();
  primeEnquiryNotifyDedupe_();
}

/**
 * Run once before or after installPropertyEnquiryChangeTrigger if the sheet already has enquiry rows —
 * remembers the bottom row so routine edits don’t look like a “new enquiry”.
 */
function primeEnquiryNotifyDedupe_() {
  var ss = SpreadsheetApp.openById(PROPERTY_ENQUIRY_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return;
  var lastRow = sheet.getLastRow();
  var rowVals = sheet.getRange(lastRow, 1, lastRow, LAST_COL_ENQUIRY_).getValues()[0];
  PropertiesService.getScriptProperties().setProperty(
    'LAST_NOTIFIED_ENQUIRY_KEY',
    enquiryDedupeKey_(lastRow, rowVals[1], rowVals[6]),
  );
}

function propertyEnquirySheetOnChange_(e) {
  try {
    var ct = e.changeType;
    if (ct !== SpreadsheetApp.ChangeType.EDIT && ct !== SpreadsheetApp.ChangeType.INSERT_ROW) return;

    var ss = e.source;
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return;

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return;

    var rowVals = sheet.getRange(lastRow, 1, lastRow, LAST_COL_ENQUIRY_).getValues()[0];
    var propertyId = String(rowVals[1] || '').trim();
    var visitorName = String(rowVals[5] || '').trim();
    var visitorEmail = String(rowVals[6] || '').trim();
    if (!propertyId || !visitorName || !visitorEmail) return;

    var owner = ownerLabelFromRowVals_(rowVals, propertyId);

    notifyNewEnquiryAfterDedupe_(
      {
        timestamp: timestampCellToIso_(rowVals[0]),
        propertyId: propertyId,
        propertyTitle: String(rowVals[2] || '').trim(),
        propertyType: String(rowVals[3] || '').trim(),
        suburb: String(rowVals[4] || '').trim(),
        visitorName: visitorName,
        visitorEmail: visitorEmail,
        visitorPhone: String(rowVals[7] || '').trim(),
        contactMethod: String(rowVals[8] || '').trim(),
        message: String(rowVals[9] || '').trim(),
        agentEmail: String(rowVals[10] || '').trim(),
        listingUrl: String(rowVals[11] || '').trim(),
        owner: owner,
      },
      lastRow,
    );
  } catch (err) {
    Logger.log('propertyEnquirySheetOnChange_: ' + String(err));
  }
}

/** Row identity for Mail dedupe (matches between doPost + onChange even if Timestamp cell format differs). */
function enquiryDedupeKey_(sheetRowNum, propertyId, visitorEmail) {
  return (
    String(sheetRowNum) +
    '|' +
    String(propertyId || '').trim() +
    '|' +
    String(visitorEmail || '').trim()
  );
}

function timestampCellToIso_(cell) {
  if (cell instanceof Date) return cell.toISOString();
  return String(cell || '').trim();
}

/** Sends MailApp notification unless this enquiry row was already notified (doPost + Sheet onChange deduped). */
function notifyNewEnquiryAfterDedupe_(row, sheetRowNum) {
  var key = enquiryDedupeKey_(sheetRowNum, row.propertyId, row.visitorEmail);
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('LAST_NOTIFIED_ENQUIRY_KEY') === key) return;
  props.setProperty('LAST_NOTIFIED_ENQUIRY_KEY', key);
  notifyNewEnquiry_(row);
}

function doGet() {
  /** `live` only — POST responses include `saved: true` so the website knows doPost actually ran. */
  return jsonResponse({
    ok: true,
    live: true,
    message:
      "Property enquiry endpoint is live. Submissions from the Tucker Family Charity site use POST only.",
  });
}

function doPost(e) {
  try {
    var body = parseRequestBody_(e);
    if (!body) {
      return jsonResponse({ ok: false, error: "No body" });
    }

    var scriptSecret = readScriptSecret_();
    if (scriptSecret && body.secret !== scriptSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    var ts = String(body.timestamp || "").trim();
    var propertyId = String(body.propertyId || "").trim();
    var propertyTitle = String(body.propertyTitle || "").trim();
    var propertyType = String(body.propertyType || "").trim();
    var suburb = String(body.suburb || "").trim();
    var visitorName = String(body.visitorName || "").trim();
    var visitorEmail = String(body.visitorEmail || "").trim();
    var visitorPhone = String(body.visitorPhone || "").trim();
    var contactMethod = String(body.contactMethod || "").trim();
    var message = String(body.message || "").trim();
    var agentEmail = String(body.agentEmail || "").trim();
    var listingUrl = String(body.originalListingUrl || "").trim();
    var status = String(body.status || "new").trim();
    var notes = String(body.notes || "").trim();

    if (!visitorName || !visitorEmail || !visitorPhone || !propertyId) {
      return jsonResponse({ ok: false, error: "Missing required fields" });
    }

    var ss = SpreadsheetApp.openById(PROPERTY_ENQUIRY_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({
        ok: false,
        error: 'Missing sheet tab "' + SHEET_NAME + '". Rename the tab or set SHEET_NAME in Code.gs.',
      });
    }
    var owner = sheetOwnerLabelForPropertyId_(propertyId);

    sheet.appendRow([
      ts,
      propertyId,
      propertyTitle,
      propertyType,
      suburb,
      visitorName,
      visitorEmail,
      visitorPhone,
      contactMethod,
      message,
      agentEmail,
      listingUrl,
      status,
      notes,
      owner,
    ]);

    var appendedRowNum = sheet.getLastRow();

    notifyNewEnquiryAfterDedupe_(
      {
        timestamp: ts,
        propertyId: propertyId,
        propertyTitle: propertyTitle,
        propertyType: propertyType,
        suburb: suburb,
        visitorName: visitorName,
        visitorEmail: visitorEmail,
        visitorPhone: visitorPhone,
        contactMethod: contactMethod,
        message: message,
        agentEmail: agentEmail,
        listingUrl: listingUrl,
        owner: owner,
      },
      appendedRowNum,
    );

    return jsonResponse({ ok: true, saved: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

/**
 * Charity site sends x-www-form-urlencoded with field `json`; other clients may POST raw JSON.
 */
function parseRequestBody_(e) {
  try {
    if (e.parameter && e.parameter.json) {
      return JSON.parse(e.parameter.json);
    }
    if (e.postData && e.postData.contents) {
      return JSON.parse(e.postData.contents);
    }
  } catch (ignore) {
    return null;
  }
  return null;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function readScriptSecret_() {
  try {
    return SCRIPT_SECRET ? String(SCRIPT_SECRET) : "";
  } catch (e) {
    return "";
  }
}

/**
 * Sends plain-text summary via MailApp (one message per recipient — avoids comma-list quirks).
 * Recipients chosen from NOTIFY_EMAILS (Pam Golding) vs NOTIFY_EMAILS_TFC via row.owner.
 * Never fails the web response — failures are logged per address so enquiries still save.
 */
function notifyNewEnquiry_(row) {
  try {
    var ownerRoute =
      row.owner === OWNER_LABEL_TFC || row.owner === OWNER_LABEL_PAM_GOLDING
        ? row.owner
        : sheetOwnerLabelForPropertyId_(row.propertyId);

    var raw = String(notifyEmailCsvForOwner_(ownerRoute) || '').trim();
    if (!raw) return;

    var recipients = [];
    raw.split(",").forEach(function (part) {
      var e = String(part).trim();
      if (e) recipients.push(e);
    });
    if (!recipients.length) return;

    var routeTag = ownerRoute === OWNER_LABEL_TFC ? '[TFC] ' : '[Pam Golding] ';
    var subject =
      routeTag +
      'New property enquiry: ' +
      String(row.propertyTitle || '').substring(0, 70) +
      (String(row.propertyTitle || '').length > 70 ? '…' : '');

    var visitorReply = String(row.visitorEmail || '').trim();
    var replyToOpt = visitorReply.indexOf('@') > 0 ? visitorReply : undefined;

    var lines = [
      'A new property enquiry row was added (website form or directly in the Sheet).',
      '',
      'Owner / route: ' + String(ownerRoute),
      '',
      'Property: ' + String(row.propertyTitle || ''),
      'Suburb: ' + String(row.suburb || ''),
      'Type: ' + String(row.propertyType || ''),
      'Property ID: ' + String(row.propertyId || ''),
      '',
      'Name: ' + String(row.visitorName || ''),
      'Email: ' + String(row.visitorEmail || ''),
      'Phone: ' + String(row.visitorPhone || ''),
      'Preferred contact: ' + String(row.contactMethod || ''),
      '',
      'Message:',
      String(row.message || '(none)'),
      '',
      'Listing URL: ' + String(row.listingUrl || '(none)'),
      'Agent email (from listing): ' + String(row.agentEmail || '(none)'),
      '',
      'Timestamp (UTC): ' + String(row.timestamp || ''),
      '',
      'Open the Property enquiries sheet tab to see the full row.',
    ];

    var bodyText = lines.join('\n');

    recipients.forEach(function (addr) {
      try {
        var opts = {
          to: addr,
          subject: subject,
          body: bodyText,
          name: 'Tucker Family Charity — property enquiry',
        };
        if (replyToOpt) opts.replyTo = replyToOpt;
        MailApp.sendEmail(opts);
      } catch (oneErr) {
        Logger.log('notifyNewEnquiry_ failed for ' + addr + ': ' + String(oneErr));
      }
    });
  } catch (notifyErr) {
    Logger.log('notifyNewEnquiry_ outer failure: ' + String(notifyErr));
  }
}
