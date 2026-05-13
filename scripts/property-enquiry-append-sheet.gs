/**
 * Google Apps Script: append Property Partnerships enquiries to a Google Sheet.
 *
 * SETUP (once per spreadsheet)
 * 1. Create a Google Sheet in Drive (or open yours). Share it with whoever needs access (e.g. charity +
 *    property partner) — Editor or Viewer as appropriate.
 * 2. Open Extensions → Apps Script. Paste this entire file as Code.gs (replace defaults).
 * 3. Set PROPERTY_ENQUIRY_SPREADSHEET_ID and SHEET_NAME below (Sheet ID from the spreadsheet URL).
 * 4. Optional: set SCRIPT_SECRET to a random string and use the same value in VITE_PROPERTY_ENQUIRY_SECRET.
 * 5. Optional email alerts: set NOTIFY_EMAILS (comma-separated). First send requires authorizing MailApp (run testNotify once).
 * 6. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone   ← MUST be “Anyone”, not “Anyone within Org only”.
 *        If this is wrong, the website gets HTML login pages / HTTP 401 and NO rows are appended.
 *    Deploy → copy URL ending in /exec → GitHub secret VITE_PROPERTY_ENQUIRY_SUBMIT_URL (and .env locally).
 *
 * TAB HEADERS (row 1 — create manually so collaborators understand columns):
 * Timestamp | Property ID | Title | Type | Suburb | Name | Email | Phone | Preferred contact | Message | Agent email | Listing URL | Status | Notes
 *
 * The charity website POSTs application/x-www-form-urlencoded with field `json` (same pattern as KITF).
 */

/** From spreadsheet URL: …/spreadsheets/d/THIS_PART/edit */
var PROPERTY_ENQUIRY_SPREADSHEET_ID = "1t5eGqP2OAkoZEiQ5NHlzkrPvgoy8FXtSXlIni670t9A";
/** Tab name (exact match). */
var SHEET_NAME = "Sheet1";
/** Empty = no check. If set, must match VITE_PROPERTY_ENQUIRY_SECRET in the site build. */
var SCRIPT_SECRET = "";
/**
 * Optional: comma-separated addresses (spaces OK). Empty = no notification emails.
 * Uses MailApp — quota limits apply (see Google Apps Script quotas).
 */
var NOTIFY_EMAILS = "";

/** Optional test from Apps Script editor: Run → send sample mail (must set NOTIFY_EMAILS first). */
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
  });
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
    ]);

    notifyNewEnquiry_({
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
    });

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
 * Sends plain-text summary via MailApp. Never fails the web response — failures are swallowed so enquiries still save.
 */
function notifyNewEnquiry_(row) {
  try {
    var raw = String(NOTIFY_EMAILS || "").trim();
    if (!raw) return;

    var recipients = [];
    raw.split(",").forEach(function (part) {
      var e = String(part).trim();
      if (e) recipients.push(e);
    });
    if (!recipients.length) return;

    var subject =
      'New property enquiry: ' +
      String(row.propertyTitle || '').substring(0, 80) +
      (String(row.propertyTitle || '').length > 80 ? '…' : '');

    var lines = [
      'A new enquiry was submitted on the Tucker Family Charity website.',
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

    MailApp.sendEmail({
      to: recipients.join(','),
      subject: subject,
      body: lines.join('\n'),
    });
  } catch (notifyErr) {
    /* Still return saved:true to the website — row is already appended */
    Logger.log('notifyNewEnquiry_ failed: ' + String(notifyErr));
  }
}
