/**
 * Google Apps Script: wine shop order enquiries → email Bret + optional Sheet log.
 *
 * SETUP
 * 1. Create a Google Sheet (optional audit log) or reuse an existing workbook tab.
 * 2. Extensions → Apps Script → paste this file as Code.gs.
 * 3. Set WINE_ORDER_SPREADSHEET_ID, SHEET_NAME, WINE_ORDER_RECIPIENT_EMAIL below.
 * 4. Optional: SCRIPT_SECRET (same value as VITE_WINE_ORDER_SECRET in the site build).
 * 5. Update WINE_CATALOG prices when Bret confirms bottle pricing (must match src/data/charityWine.ts slugs).
 * 6. Deploy → New deployment → Web app → Execute as Me → Who has access: Anyone → copy /exec URL
 *    → GitHub secret VITE_WINE_ORDER_SUBMIT_URL.
 *
 * TAB HEADERS (row 1):
 * Timestamp | Mode | Name | Email | Phone | Delivery area | Wines JSON | Total bottles | Est. total ZAR | Notes | Status
 *
 * The charity website POSTs application/x-www-form-urlencoded with field `json`.
 */

var WINE_ORDER_SPREADSHEET_ID = "";
var SHEET_NAME = "Wine orders";
var SCRIPT_SECRET = "";

/** Bret’s order inbox — also set in Script properties as WINE_ORDER_RECIPIENT_EMAIL if preferred. */
var WINE_ORDER_RECIPIENT_EMAIL = "info@tuckerfamilycharity.co.za";

/** CC for charity visibility (optional, comma-separated). */
var WINE_ORDER_CC_EMAILS = "";

/** Send customer an acknowledgement copy (true/false). */
var WINE_ORDER_SEND_CUSTOMER_COPY = true;

/** Max submissions per email address per hour. */
var RATE_LIMIT_PER_HOUR = 5;

var DELIVERY_FEE_JOHANNESBURG_ZAR = 50;
var DELIVERY_FEE_ELSEWHERE_SA_ZAR = 200;
var WINE_BOTTLES_PER_CASE = 6;

/** Trusted catalog — slugs must match src/data/charityWine.ts. priceZar = per bottle. */
var WINE_CATALOG = {
  chloe: { name: "Chloe", vintage: 2024, varietal: "Sauvignon Blanc", priceZar: 159 },
  ella: { name: "Ella", vintage: 2025, varietal: "Pinot Noir", priceZar: 205 },
  madison: { name: "Madison", vintage: 2021, varietal: "Merlot / Shiraz", priceZar: 175 },
};

var LAST_COL_WINE_ = 11;

function doGet() {
  return jsonResponse({
    ok: true,
    live: true,
    message: "Wine order endpoint is live. Submissions from the Tucker Family Charity site use POST only.",
  });
}

function doPost(e) {
  try {
    var body = parseRequestBody_(e);
    if (!body) return jsonResponse({ ok: false, error: "No body" });

    if (String(body.website || "").trim()) {
      return jsonResponse({ ok: true, saved: true });
    }

    var scriptSecret = readScriptSecret_();
    if (scriptSecret && body.secret !== scriptSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    var customerName = String(body.customerName || "").trim();
    var customerEmail = String(body.customerEmail || "").trim().toLowerCase();
    var customerPhone = String(body.customerPhone || "").trim();
    var deliveryZone = String(body.deliveryZone || "").trim();
    var deliveryAddress = String(body.deliveryAddress || body.deliveryArea || "").trim();
    var notes = String(body.notes || "").trim();
    var submissionMode = String(body.submissionMode || "enquiry").trim();
    var ts = String(body.timestamp || new Date().toISOString()).trim();

    if (!customerName || !customerEmail || !customerPhone || !deliveryZone || !deliveryAddress) {
      return jsonResponse({ ok: false, error: "Missing required customer fields" });
    }
    var deliveryMeta = deliveryMetaForZone_(deliveryZone);
    if (!deliveryMeta) {
      return jsonResponse({ ok: false, error: "Invalid delivery area" });
    }
    if (customerEmail.indexOf("@") < 1 || customerEmail.indexOf(".") < 3) {
      return jsonResponse({ ok: false, error: "Invalid email address" });
    }

    if (!checkRateLimit_("wine-email-" + customerEmail)) {
      return jsonResponse({ ok: false, error: "Too many submissions — please try again later or email us directly." });
    }

    var order = buildTrustedOrder_(body.lines || [], deliveryMeta);
    if (!order.lines.length) {
      return jsonResponse({ ok: false, error: "Select at least one case" });
    }

    appendSheetRow_(ts, submissionMode, customerName, customerEmail, customerPhone, deliveryMeta, deliveryAddress, order, notes);
    sendOrderEmails_(ts, submissionMode, customerName, customerEmail, customerPhone, deliveryMeta, deliveryAddress, order, notes);

    return jsonResponse({ ok: true, saved: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function deliveryMetaForZone_(zone) {
  if (zone === "johannesburg") {
    return { zone: zone, label: "Johannesburg", feeZar: DELIVERY_FEE_JOHANNESBURG_ZAR };
  }
  if (zone === "elsewhere_sa") {
    return { zone: zone, label: "Elsewhere in South Africa", feeZar: DELIVERY_FEE_ELSEWHERE_SA_ZAR };
  }
  return null;
}

function buildTrustedOrder_(rawLines, deliveryMeta) {
  var lines = [];
  var totalCases = 0;
  var totalBottles = 0;
  var wineSubtotalZar = 0;

  if (!Array.isArray(rawLines)) rawLines = [];

  rawLines.forEach(function (raw) {
    var slug = String((raw && raw.wineSlug) || "").trim();
    var caseQty = parseInt(raw && (raw.caseQuantity != null ? raw.caseQuantity : raw.quantity), 10);
    if (!slug || !WINE_CATALOG[slug] || !(caseQty > 0)) return;
    if (caseQty > 99) caseQty = 99;

    var cat = WINE_CATALOG[slug];
    var label = cat.name + " " + cat.vintage + " (" + cat.varietal + ")";
    var pricePerBottleZar = cat.priceZar;
    var pricePerCaseZar = pricePerBottleZar * WINE_BOTTLES_PER_CASE;
    var bottleQty = caseQty * WINE_BOTTLES_PER_CASE;
    var lineTotalZar = pricePerCaseZar * caseQty;

    wineSubtotalZar += lineTotalZar;
    totalCases += caseQty;
    totalBottles += bottleQty;
    lines.push({
      slug: slug,
      label: label,
      caseQuantity: caseQty,
      bottleQuantity: bottleQty,
      pricePerBottleZar: pricePerBottleZar,
      pricePerCaseZar: pricePerCaseZar,
      lineTotalZar: lineTotalZar,
    });
  });

  var deliveryFeeZar = deliveryMeta ? deliveryMeta.feeZar : null;
  var estimatedGrandTotalZar =
    lines.length && deliveryFeeZar != null ? wineSubtotalZar + deliveryFeeZar : null;

  return {
    lines: lines,
    totalCases: totalCases,
    totalBottles: totalBottles,
    wineSubtotalZar: lines.length ? wineSubtotalZar : null,
    deliveryZone: deliveryMeta ? deliveryMeta.zone : "",
    deliveryZoneLabel: deliveryMeta ? deliveryMeta.label : "",
    deliveryFeeZar: deliveryFeeZar,
    estimatedGrandTotalZar: estimatedGrandTotalZar,
  };
}

function appendSheetRow_(ts, mode, name, email, phone, deliveryMeta, deliveryAddress, order, notes) {
  if (!WINE_ORDER_SPREADSHEET_ID) return;
  try {
    var ss = SpreadsheetApp.openById(WINE_ORDER_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Mode",
        "Name",
        "Email",
        "Phone",
        "Delivery zone",
        "Delivery address",
        "Wines JSON",
        "Total cases",
        "Total bottles",
        "Wine subtotal ZAR",
        "Delivery fee ZAR",
        "Est. grand total ZAR",
        "Notes",
        "Status",
      ]);
    }
    sheet.appendRow([
      ts,
      mode,
      name,
      email,
      phone,
      deliveryMeta.label,
      deliveryAddress,
      JSON.stringify(order.lines),
      order.totalCases,
      order.totalBottles,
      order.wineSubtotalZar != null ? order.wineSubtotalZar : "",
      order.deliveryFeeZar != null ? order.deliveryFeeZar : "",
      order.estimatedGrandTotalZar != null ? order.estimatedGrandTotalZar : "",
      notes,
      "new",
    ]);
  } catch (err) {
    Logger.log("appendSheetRow_: " + String(err));
  }
}

function sendOrderEmails_(ts, mode, name, email, phone, deliveryMeta, deliveryAddress, order, notes) {
  var recipient = readRecipientEmail_();
  if (!recipient) {
    Logger.log("sendOrderEmails_: no WINE_ORDER_RECIPIENT_EMAIL configured");
    return;
  }

  var subject = "New wine order enquiry — " + name;
  var bodyText = formatOrderEmailBody_(ts, mode, name, email, phone, deliveryMeta, deliveryAddress, order, notes, false);

  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: bodyText,
      name: "Tucker Family Charity — wine shop",
      replyTo: email,
    });
  } catch (err) {
    Logger.log("sendOrderEmails_ Bret mail failed: " + String(err));
  }

  var ccRaw = String(WINE_ORDER_CC_EMAILS || "").trim();
  if (ccRaw) {
    ccRaw.split(",").forEach(function (addr) {
      var cc = String(addr).trim();
      if (!cc || cc === recipient) return;
      try {
        MailApp.sendEmail({
          to: cc,
          subject: subject,
          body: bodyText,
          name: "Tucker Family Charity — wine shop",
          replyTo: email,
        });
      } catch (ccErr) {
        Logger.log("sendOrderEmails_ CC failed for " + cc + ": " + String(ccErr));
      }
    });
  }

  if (WINE_ORDER_SEND_CUSTOMER_COPY) {
    try {
      MailApp.sendEmail({
        to: email,
        subject: "We received your Tucker Family Charity wine enquiry",
        body: formatOrderEmailBody_(ts, mode, name, email, phone, deliveryMeta, deliveryAddress, order, notes, true),
        name: "Tucker Family Charity",
      });
    } catch (custErr) {
      Logger.log("sendOrderEmails_ customer copy failed: " + String(custErr));
    }
  }
}

function formatOrderEmailBody_(ts, mode, name, email, phone, deliveryMeta, deliveryAddress, order, notes, forCustomer) {
  var lines = [];
  if (forCustomer) {
    lines.push("Hi " + name + ",", "");
    lines.push(
      "Thank you — we received your wine order enquiry. We will contact you to confirm delivery and payment.",
      ""
    );
  } else {
    lines.push("New wine order enquiry from the Tucker Family Charity website.", "");
  }

  lines.push("Submitted: " + formatTimestampLocal_(ts));
  lines.push("Submission mode: " + mode);
  lines.push("");
  lines.push("Customer");
  lines.push("  Name: " + name);
  lines.push("  Email: " + email);
  lines.push("  Phone / WhatsApp: " + phone);
  lines.push("  Delivery zone: " + deliveryMeta.label + " (" + formatZar_(deliveryMeta.feeZar) + " delivery)");
  lines.push("  Delivery address: " + deliveryAddress);
  lines.push("");
  lines.push("Order (sold by the case — " + WINE_BOTTLES_PER_CASE + " bottles per case)");
  lines.push(
    padRight_("Wine", 36) +
      padRight_("Cases", 7) +
      padRight_("Bottles", 9) +
      padRight_("Case price", 12) +
      "Line total"
  );
  lines.push(repeatChar_("-", 78));

  order.lines.forEach(function (line) {
    lines.push(
      padRight_(line.label, 36) +
        padRight_(String(line.caseQuantity), 7) +
        padRight_(String(line.bottleQuantity), 9) +
        padRight_(formatZar_(line.pricePerCaseZar), 12) +
        formatZar_(line.lineTotalZar)
    );
  });

  lines.push(repeatChar_("-", 78));
  lines.push("Total cases: " + order.totalCases);
  lines.push("Total bottles: " + order.totalBottles);
  lines.push("Wine subtotal: " + formatZar_(order.wineSubtotalZar));
  lines.push("Delivery (" + deliveryMeta.label + "): " + formatZar_(order.deliveryFeeZar));
  lines.push(
    "Order total: " +
      (order.estimatedGrandTotalZar != null ? formatZar_(order.estimatedGrandTotalZar) : formatZar_(order.wineSubtotalZar + order.deliveryFeeZar))
  );

  if (notes) {
    lines.push("");
    lines.push("Notes / gift message:");
    lines.push(notes);
  }

  if (forCustomer) {
    lines.push("");
    lines.push("Questions? Reply to this email or contact " + readRecipientEmail_() + ".");
  }

  return lines.join("\n");
}

function formatTimestampLocal_(iso) {
  try {
    return Utilities.formatDate(new Date(iso), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss z");
  } catch (e) {
    return String(iso || "");
  }
}

function formatZar_(n) {
  return "R" + Number(n).toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

function padRight_(s, width) {
  s = String(s || "");
  while (s.length < width) s += " ";
  return s.substring(0, width);
}

function repeatChar_(ch, n) {
  var out = "";
  for (var i = 0; i < n; i++) out += ch;
  return out;
}

function readRecipientEmail_() {
  try {
    var fromProps = PropertiesService.getScriptProperties().getProperty("WINE_ORDER_RECIPIENT_EMAIL");
    if (fromProps && String(fromProps).trim()) return String(fromProps).trim();
  } catch (e) {}
  return String(WINE_ORDER_RECIPIENT_EMAIL || "").trim();
}

function checkRateLimit_(key) {
  try {
    var cache = CacheService.getScriptCache();
    var count = parseInt(cache.get(key) || "0", 10);
    if (count >= RATE_LIMIT_PER_HOUR) return false;
    cache.put(key, String(count + 1), 3600);
    return true;
  } catch (e) {
    return true;
  }
}

function parseRequestBody_(e) {
  try {
    if (e.parameter && e.parameter.json) return JSON.parse(e.parameter.json);
    if (e.postData && e.postData.contents) return JSON.parse(e.postData.contents);
  } catch (ignore) {}
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

/** Run once from the editor to authorise MailApp. */
function testWineOrderNotify() {
  var deliveryMeta = deliveryMetaForZone_("johannesburg");
  var order = buildTrustedOrder_([{ wineSlug: "chloe", caseQuantity: 2 }], deliveryMeta);
  sendOrderEmails_(
    new Date().toISOString(),
    "enquiry",
    "Test Customer",
    "test@example.com",
    "+27 82 000 0000",
    deliveryMeta,
    "Sandton",
    order,
    "Script test — please ignore."
  );
}
