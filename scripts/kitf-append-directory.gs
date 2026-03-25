/**
 * Google Apps Script: append a row to the Keep It In The Family directory sheet.
 *
 * 1. Create or open the project (Extensions → Apps Script from the sheet, or script.google.com).
 * 2. Replace ALL of Code.gs with this file (these vars + functions).
 * 3. Deploy → New deployment → Web app: Execute as Me, Who has access: Anyone.
 * 4. Copy Web app URL → GitHub secret VITE_KITF_SUBMIT_URL (not the Library URL).
 * 5. If SCRIPT_SECRET is non-empty, set the same value in VITE_KITF_SUBMIT_SECRET and redeploy the site.
 *
 * Sheet tab column order: name, profession, area, phone, endorsed_by, notes, website
 */

var DIRECTORY_SPREADSHEET_ID = "1tC3IcX81_tdA2_UHTjT2JEIG-i9hr_ovgCQS5fJV7tw";
var SHEET_NAME = "Sheet1";
/** Empty = no check. If set, must match VITE_KITF_SUBMIT_SECRET on the website build. */
var SCRIPT_SECRET = "";

function doGet() {
  return jsonResponse({
    ok: true,
    message:
      "KITF directory endpoint is live. Submissions from the website use POST only.",
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

/**
 * Charity site sends x-www-form-urlencoded with field `json`; other clients may POST raw JSON.
 */
function parseRequestBody_(e) {
  if (e.parameter && e.parameter.json) {
    return JSON.parse(e.parameter.json);
  }
  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  return null;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Avoids ReferenceError if SCRIPT_SECRET line was ever removed from the top of this file.
 */
function readScriptSecret_() {
  try {
    return SCRIPT_SECRET ? String(SCRIPT_SECRET) : "";
  } catch (e) {
    return "";
  }
}
