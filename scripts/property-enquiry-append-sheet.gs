/**
 * Google Apps Script: append Property Partnerships enquiries to a Google Sheet.
 *
 * SETUP (once per spreadsheet)
 * 1. Create a Google Sheet in Drive (or open yours). Share it with whoever needs access (e.g. charity +
 *    property partner) — Editor or Viewer as appropriate.
 * 2. Open Extensions → Apps Script. Paste this entire file as Code.gs (replace defaults).
 * 3. Set PROPERTY_ENQUIRY_SPREADSHEET_ID and SHEET_NAME below (Sheet ID from the spreadsheet URL).
 * 4. Optional: set SCRIPT_SECRET to a random string and use the same value in VITE_PROPERTY_ENQUIRY_SECRET.
 * 5. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 *    Deploy → copy URL ending in /exec → GitHub secret VITE_PROPERTY_ENQUIRY_SUBMIT_URL (and .env locally).
 *
 * TAB HEADERS (row 1 — create manually so collaborators understand columns):
 * Timestamp | Property ID | Title | Type | Suburb | Name | Email | Phone | Preferred contact | Message | Agent email | Listing URL | Status | Notes
 *
 * The charity website POSTs application/x-www-form-urlencoded with field `json` (same pattern as KITF).
 */

/** From spreadsheet URL: …/spreadsheets/d/THIS_PART/edit */
var PROPERTY_ENQUIRY_SPREADSHEET_ID = "REPLACE_WITH_SPREADSHEET_ID";
/** Tab name (exact match). */
var SHEET_NAME = "Sheet1";
/** Empty = no check. If set, must match VITE_PROPERTY_ENQUIRY_SECRET in the site build. */
var SCRIPT_SECRET = "";

function doGet() {
  return jsonResponse({
    ok: true,
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

    var sheet = SpreadsheetApp.openById(PROPERTY_ENQUIRY_SPREADSHEET_ID).getSheetByName(SHEET_NAME);
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
    return jsonResponse({ ok: true });
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
