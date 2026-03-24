/**
 * Google Apps Script: append a row to the Keep It In The Family directory sheet.
 *
 * 1. Create a new Apps Script project bound to the spreadsheet OR standalone.
 * 2. Paste this file, set DIRECTORY_SPREADSHEET_ID (and optional SCRIPT_SECRET).
 * 3. Deploy → New deployment → Web app: Execute as you, Who has access: Anyone (or Anyone with Google account).
 * 4. Copy the Web app URL into VITE_KITF_SUBMIT_URL (and match SCRIPT_SECRET to VITE_KITF_SUBMIT_SECRET if used).
 *
 * Expected Sheet1 column order: name, profession, area, phone, endorsed_by, notes, website
 */
var DIRECTORY_SPREADSHEET_ID = "PASTE_YOUR_DIRECTORY_SHEET_ID";
var SHEET_NAME = "Sheet1";
/** Leave empty to skip checks; otherwise must match VITE_KITF_SUBMIT_SECRET from the site build. */
var SCRIPT_SECRET = "";

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "No body" });
    }
    var body = JSON.parse(e.postData.contents);
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
