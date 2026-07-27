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
var WINE_ORDER_RECIPIENT_EMAIL = "brett@tuckerfamilycharity.co.za";

/** CC for charity visibility (optional, comma-separated). */
var WINE_ORDER_CC_EMAILS = "info@tuckerfamilycharity.org";

/** Send customer an acknowledgement copy (true/false). */
var WINE_ORDER_SEND_CUSTOMER_COPY = true;

/** Max submissions per email address per hour. */
var RATE_LIMIT_PER_HOUR = 5;

var DELIVERY_FEE_JOHANNESBURG_ZAR = 50;
var DELIVERY_FEE_ELSEWHERE_SA_ZAR = 200;

/** Trusted catalog — slugs must match src/data/charityWine.ts. priceZar null = price on enquiry. */
var WINE_CATALOG = {
  chloe: { name: "Chloe", vintage: 2024, varietal: "Sauvignon Blanc", priceZar: null },
  ella: { name: "Ella", vintage: 2025, varietal: "Pinot Noir", priceZar: null },
  madison: { name: "Madison", vintage: 2021, varietal: "Merlot / Shiraz", priceZar: null },
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
    var deliveryArea = String(body.deliveryArea || "").trim();
    var notes = String(body.notes || "").trim();
    var submissionMode = String(body.submissionMode || "enquiry").trim();
    var ts = String(body.timestamp || new Date().toISOString()).trim();

    if (!customerName || !customerEmail || !customerPhone || !deliveryZone || !deliveryArea) {
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
      return jsonResponse({ ok: false, error: "Select at least one bottle" });
    }

    appendSheetRow_(ts, submissionMode, customerName, customerEmail, customerPhone, deliveryMeta, deliveryArea, order, notes);
    sendOrderEmails_(ts, submissionMode, customerName, customerEmail, customerPhone, deliveryMeta, deliveryArea, order, notes);

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
  var totalBottles = 0;
  var wineSubtotalZar = 0;
  var hasAllPrices = true;

  if (!Array.isArray(rawLines)) rawLines = [];

  rawLines.forEach(function (raw) {
    var slug = String((raw && raw.wineSlug) || "").trim();
    var qty = parseInt(raw && raw.quantity, 10);
    if (!slug || !WINE_CATALOG[slug] || !(qty > 0)) return;
    if (qty > 99) qty = 99;

    var cat = WINE_CATALOG[slug];
    var label = cat.name + " " + cat.vintage + " (" + cat.varietal + ")";
    var priceZar = cat.priceZar;
    var lineTotalZar = priceZar != null ? priceZar * qty : null;

    if (priceZar == null) hasAllPrices = false;
    else wineSubtotalZar += lineTotalZar;

    totalBottles += qty;
    lines.push({
      slug: slug,
      label: label,
      quantity: qty,
      priceZar: priceZar,
      lineTotalZar: lineTotalZar,
    });
  });

  var deliveryFeeZar = deliveryMeta ? deliveryMeta.feeZar : null;
  var wineSubtotal = hasAllPrices && lines.length ? wineSubtotalZar : null;
  var estimatedGrandTotalZar = wineSubtotal != null && deliveryFeeZar != null ? wineSubtotal + deliveryFeeZar : null;

  return {
    lines: lines,
    totalBottles: totalBottles,
    wineSubtotalZar: wineSubtotal,
    deliveryZone: deliveryMeta ? deliveryMeta.zone : "",
    deliveryZoneLabel: deliveryMeta ? deliveryMeta.label : "",
    deliveryFeeZar: deliveryFeeZar,
    estimatedGrandTotalZar: estimatedGrandTotalZar,
  };
}

function appendSheetRow_(ts, mode, name, email, phone, deliveryMeta, deliverySuburb, order, notes) {
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
        "Delivery suburb",
        "Wines JSON",
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
      deliverySuburb,
      JSON.stringify(order.lines),
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

function sendOrderEmails_(ts, mode, name, email, phone, deliveryMeta, deliverySuburb, order, notes) {
  var recipient = readRecipientEmail_();
  if (!recipient) {
    Logger.log("sendOrderEmails_: no WINE_ORDER_RECIPIENT_EMAIL configured");
    return;
  }

  var subject = "New wine order enquiry — " + name;
  var bodyText = formatOrderEmailBody_(ts, mode, name, email, phone, deliveryMeta, deliverySuburb, order, notes, false);

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
        body: formatOrderEmailBody_(ts, mode, name, email, phone, deliveryMeta, deliverySuburb, order, notes, true),
        name: "Tucker Family Charity",
      });
    } catch (custErr) {
      Logger.log("sendOrderEmails_ customer copy failed: " + String(custErr));
    }
  }
}

function formatOrderEmailBody_(ts, mode, name, email, phone, deliveryMeta, deliverySuburb, order, notes, forCustomer) {
  var lines = [];
  if (forCustomer) {
    lines.push("Hi " + name + ",", "");
    lines.push(
      "Thank you — we received your wine order enquiry. Bret will contact you to confirm availability, wine pricing, delivery, and payment.",
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
  lines.push("  Suburb / address details: " + deliverySuburb);
  lines.push("");
  lines.push("Order");
  lines.push(padRight_("Wine", 42) + padRight_("Qty", 6) + padRight_("Price/btl", 14) + "Line total");
  lines.push(repeatChar_("-", 78));

  order.lines.forEach(function (line) {
    var priceStr = line.priceZar != null ? formatZar_(line.priceZar) : "On enquiry";
    var lineStr = line.lineTotalZar != null ? formatZar_(line.lineTotalZar) : "—";
    lines.push(
      padRight_(line.label, 42) +
        padRight_(String(line.quantity), 6) +
        padRight_(priceStr, 14) +
        lineStr
    );
  });

  lines.push(repeatChar_("-", 78));
  lines.push("Total bottles: " + order.totalBottles);
  lines.push(
    "Wine subtotal: " + (order.wineSubtotalZar != null ? formatZar_(order.wineSubtotalZar) : "Confirm with Bret")
  );
  lines.push(
    "Delivery (" + deliveryMeta.label + "): " + formatZar_(order.deliveryFeeZar)
  );
  lines.push(
    "Estimated order total: " +
      (order.estimatedGrandTotalZar != null ? formatZar_(order.estimatedGrandTotalZar) : "Confirm with Bret")
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
  var order = buildTrustedOrder_([{ wineSlug: "chloe", quantity: 2 }], deliveryMeta);
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
