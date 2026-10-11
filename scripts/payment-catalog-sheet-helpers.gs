/**
 * TFC Payment Catalog — staff helper menu (Google Apps Script, bound to the Sheet).
 *
 * Install: open the "TFC Payment Catalog" Sheet → Extensions → Apps Script → paste this file →
 * Save → reload the Sheet. A "TFC payments" menu appears.
 *
 *   TFC payments → Validate catalog rows   checks every row and highlights problems in red
 *   TFC payments → Add dropdowns           adds kind / active dropdowns so typos are harder
 *
 * This script never publishes a URL, never touches payments and holds no secrets.
 * Rules mirror api/lib/paymentCatalog.ts (the Railway API ignores invalid rows).
 * Docs: docs/PAYMENT_CATALOG_SHEET_SETUP.md
 */

var CATALOG_TAB = "Catalog";
var SETTINGS_TAB = "DonationSettings";
var CATALOG_HEADERS = ["id", "kind", "name", "price_zar", "active", "description"];
var SETTINGS_HEADERS = ["setting", "value"];
var ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var RESERVED_ID_PATTERN = /^(cap|caps|hat|wine)(-|$)/;
var ERROR_COLOUR = "#f8d7da";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("TFC payments")
    .addItem("Validate catalog rows", "validateCatalog")
    .addItem("Add dropdowns (kind / active)", "addDropdowns")
    .addToUi();
}

function validateCatalog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var problems = [];

  var sheet = ss.getSheetByName(CATALOG_TAB);
  if (!sheet) {
    ui.alert('Tab "' + CATALOG_TAB + '" is missing. Do not rename the tabs.');
    return;
  }

  var data = sheet.getDataRange().getValues();
  var headers = (data[0] || []).map(function (h) { return String(h).trim(); });
  CATALOG_HEADERS.forEach(function (h, i) {
    if (headers[i] !== h) problems.push('Catalog row 1: column ' + (i + 1) + ' header must be "' + h + '" (found "' + (headers[i] || "") + '")');
  });

  // Reset previous highlights on data rows
  if (data.length > 1) sheet.getRange(2, 1, data.length - 1, CATALOG_HEADERS.length).setBackground(null);

  var seen = {};
  var activeDonations = 0;
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var rowNum = r + 1;
    var id = String(row[0] || "").trim();
    if (!id && !String(row[2] || "").trim()) continue; // empty line

    var kind = String(row[1] || "").trim().toLowerCase();
    var name = String(row[2] || "").trim();
    var priceRaw = String(row[3] === 0 ? "0" : row[3] || "").trim().replace(/^r\s*/i, "").replace(/[\s,]/g, "");
    var active = String(row[4] || "").trim();

    var bad = function (col, msg) {
      problems.push("Catalog row " + rowNum + ": " + msg);
      sheet.getRange(rowNum, col).setBackground(ERROR_COLOUR);
    };

    if (!ID_PATTERN.test(id)) bad(1, 'id "' + id + '" must be lowercase letters, numbers and hyphens (e.g. donation-750)');
    else if (RESERVED_ID_PATTERN.test(id)) bad(1, '"' + id + '" — caps are sold via Cheyna Dot and wine via the wine page; remove this row');
    else if (seen[id]) bad(1, 'duplicate id "' + id + '" (also row ' + seen[id] + ")");
    else seen[id] = rowNum;

    if (kind !== "donation" && kind !== "product") bad(2, 'kind must be "donation" or "product"');
    if (!name) bad(3, "name is empty");
    if (!/^\d+$/.test(priceRaw) || Number(priceRaw) < 2) bad(4, "price_zar must be whole rands, numbers only (e.g. 250)");
    if (!/^(y|n|yes|no|true|false)$/i.test(active)) bad(5, "active must be Y or N");

    if (kind === "donation" && /^(y|yes|true)$/i.test(active)) activeDonations++;
  }

  var settingsSheet = ss.getSheetByName(SETTINGS_TAB);
  if (!settingsSheet) {
    problems.push('Tab "' + SETTINGS_TAB + '" is missing.');
  } else {
    var s = settingsSheet.getDataRange().getValues();
    var sh = (s[0] || []).map(function (h) { return String(h).trim(); });
    if (sh[0] !== SETTINGS_HEADERS[0] || sh[1] !== SETTINGS_HEADERS[1]) {
      problems.push('DonationSettings row 1 headers must be "setting" and "value"');
    }
    var values = {};
    for (var i = 1; i < s.length; i++) values[String(s[i][0]).trim()] = String(s[i][1]).trim();
    if (!/^(true|false|y|n|yes|no)$/i.test(values.allow_custom_amount || "")) {
      problems.push("DonationSettings: allow_custom_amount must be TRUE or FALSE");
    }
    var min = Number(values.min_amount_zar);
    var max = Number(values.max_amount_zar);
    if (!(min >= 2) || Math.floor(min) !== min) problems.push("DonationSettings: min_amount_zar must be whole rands (at least 2)");
    if (!(max >= min) || Math.floor(max) !== max) problems.push("DonationSettings: max_amount_zar must be whole rands and not below the minimum");
  }

  if (activeDonations === 0) problems.push("Warning: no active donation rows — the Donate page will only offer a custom amount.");

  if (problems.length === 0) {
    ui.alert("All good ✓", "Catalog and DonationSettings look valid. Changes show on the website within about 5 minutes.", ui.ButtonSet.OK);
  } else {
    ui.alert("Please fix " + problems.length + " item(s)", problems.slice(0, 25).join("\n"), ui.ButtonSet.OK);
  }
}

function addDropdowns() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CATALOG_TAB);
  if (!sheet) return;
  var rows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 2, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(["donation", "product"], true).setAllowInvalid(false).build()
  );
  sheet.getRange(2, 5, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(["Y", "N"], true).setAllowInvalid(false).build()
  );
  sheet.getRange(2, 4, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(2)
      .setHelpText("Whole rands, numbers only (250 = R250)")
      .setAllowInvalid(false)
      .build()
  );
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert("Dropdowns added for kind (donation/product) and active (Y/N).");
}
