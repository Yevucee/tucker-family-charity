/**
 * Google Apps Script: append a row to the Keep It In The Family directory sheet.
 *
 * 1. Create a new Apps Script project bound to the spreadsheet OR standalone.
 * 2. Paste this file, set DIRECTORY_SPREADSHEET_ID (and optional SCRIPT_SECRET).
 * 3. Deploy → New deployment → Web app: Execute as you, Who has access: Anyone (or Anyone with Google account).
 * 4. Copy the Web app URL (/exec) into VITE_KITF_SUBMIT_URL only. Put SCRIPT_SECRET in VITE_KITF_SUBMIT_SECRET — never swap these.
 *
 * Expected Sheet1 column order: name, profession, area, phone, endorsed_by, notes, website
 */
var DIRECTORY_SPREADSHEET_ID = "PASTE_YOUR_DIRECTORY_SHEET_ID";
var SHEET_NAME = "Sheet1";
/** Leave empty to skip checks; otherwise must match VITE_KITF_SUBMIT_SECRET from the site build. */
var SCRIPT_SECRET = "";

/** Opening the Web app URL in a browser uses GET — avoids “doGet not found”. Submissions use POST only. */
function doGet() {
  return jsonResponse({
    ok: true,
    message: "KITF directory endpoint is live. Use POST JSON from the website; do not expect a form here.",
  });
}

function doPost(e) {
  try {
    /** Prefer form field `json` (x-www-form-urlencoded from the charity site); fall back to raw JSON body */
    var body;
    if (e.parameter && e.parameter.json) {
      body = JSON.parse(e.parameter.json);
    } else if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else {
      return jsonResponse({ ok: false, error: "No body" });
    }
    if (SCRIPT_SECRET) {
      if (body.secret !== SCRIPT_SECRET) {
        return jsonResponse({ ok: false, error: "Unauthorized" });
      }
    }
    var name = String(body.name || "").trim();
    var profession = String(body.profession || "").trim();
    var area = String(body.area || "").trim();
    var phone = String(body.phone || "").trim();
    var endorsedBy = String(body.endorsed_by || "").trim();
    var notes = String(body.notes || "").trim();
    var website = String(body.website || "").trim();

    if (!name || !profession || !area || !phone || !endorsedBy) {
      return jsonResponse({ ok: false, error: "Missing required fields" });
    }

    var sheet = SpreadsheetApp.openById(DIRECTORY_SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([name, profession, area, phone, endorsedBy, notes, website]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
