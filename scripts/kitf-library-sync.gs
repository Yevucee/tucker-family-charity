/**
 * KITF "Learning from the best" — sync source tabs → Website tab (Sheet log for public library).
 * Bind to the master spreadsheet. The charity site reads Website via opensheet.elk.sh only.
 *
 * SETUP
 * 1. Extensions → Apps Script → paste as Code.gs on the master workbook.
 * 2. Run installWebsiteSyncTriggers once (on-edit debounce + every 6 hours).
 * 3. Run syncWebsiteFromSourceTabs once, or menu KITF Library → Sync Website tab now.
 *
 * Brett edits Podcast / You Tube / etc.; Website tab updates for the website automatically.
 * See docs/KITF_LIBRARY_SETUP.md
 */

var WEBSITE_TAB = "Website";
var DEBOUNCE_SECONDS = 90;

var WEBSITE_HEADERS = [
  "title", "type", "topic", "author", "description", "link",
  "tags", "duration", "featured", "show_on_site", "source_tab"
];

var SIMPLE_ITEM_LINK_TABS = {
  "Podcast": "Podcast",
  "Netflix": "Netflix",
  "LinkedIn_Articles": "LinkedIn Article",
  "IG_FB": "Instagram / Facebook"
};

var ARTICLE_AUTHOR_LINK_TABS = {
  "You Tube": "YouTube",
  "Ted Talks": "Ted Talk"
};

var ARTICLE_AUTHOR_TYPE_LINK_TABS = {
  "Wildlife": "Wildlife",
  "Motivation": "Motivation",
  "Health": "Health"
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("KITF Library")
    .addItem("Sync Website tab now", "syncWebsiteFromSourceTabs")
    .addItem("Install auto-sync triggers", "installWebsiteSyncTriggers")
    .addToUi();
}

function installWebsiteSyncTriggers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (fn === "syncWebsiteFromSourceTabs" || fn === "syncWebsiteFromSourceTabsDebounced") {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger("syncWebsiteFromSourceTabsDebounced")
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  ScriptApp.newTrigger("syncWebsiteFromSourceTabs")
    .timeBased()
    .everyHours(6)
    .create();
  ss.toast("Auto-sync installed (on edit + every 6 hours).", "KITF Library", 5);
}

function syncWebsiteFromSourceTabsDebounced(e) {
  if (!e || !e.range) return;
  if (e.range.getSheet().getName() === WEBSITE_TAB) return;
  var cache = CacheService.getScriptCache();
  if (cache.get("kitf_sync_pending")) return;
  cache.put("kitf_sync_pending", "1", DEBOUNCE_SECONDS);
  syncWebsiteFromSourceTabs();
}

function syncWebsiteFromSourceTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var preserved = readPreservedWebsiteFields_(ss);
  var rows = dedupeRowsByLink_(collectAllSourceRows_(ss));
  writeWebsiteTab_(ss, rows, preserved);
  CacheService.getScriptCache().remove("kitf_sync_pending");
}

function readPreservedWebsiteFields_(ss) {
  var map = {};
  var sh = ss.getSheetByName(WEBSITE_TAB);
  if (!sh || sh.getLastRow() < 2) return map;
  var data = sh.getDataRange().getValues();
  var headers = data[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var linkIdx = headers.indexOf("link");
  if (linkIdx < 0) return map;
  var fields = ["topic", "description", "tags", "duration", "featured"];
  for (var r = 1; r < data.length; r++) {
    var link = normalizeLink_(data[r][linkIdx]);
    if (!link) continue;
    var keep = {};
    fields.forEach(function (f) {
      var i = headers.indexOf(f);
      if (i >= 0 && data[r][i] != null && String(data[r][i]).trim() !== "") keep[f] = data[r][i];
    });
    if (Object.keys(keep).length) map[link] = keep;
  }
  return map;
}

function collectAllSourceRows_(ss) {
  var out = [];
  Object.keys(SIMPLE_ITEM_LINK_TABS).forEach(function (tab) {
    if (ss.getSheetByName(tab)) out = out.concat(readSimpleItemLinkTab_(ss.getSheetByName(tab), tab, SIMPLE_ITEM_LINK_TABS[tab]));
  });
  Object.keys(ARTICLE_AUTHOR_LINK_TABS).forEach(function (tab) {
    if (ss.getSheetByName(tab)) out = out.concat(readArticleAuthorLinkTab_(ss.getSheetByName(tab), tab, ARTICLE_AUTHOR_LINK_TABS[tab]));
  });
  Object.keys(ARTICLE_AUTHOR_TYPE_LINK_TABS).forEach(function (tab) {
    if (ss.getSheetByName(tab)) out = out.concat(readArticleAuthorTypeLinkTab_(ss.getSheetByName(tab), tab, ARTICLE_AUTHOR_TYPE_LINK_TABS[tab]));
  });
  if (ss.getSheetByName("Books")) out = out.concat(readBooksTab_(ss.getSheetByName("Books")));
  if (ss.getSheetByName("Articles")) out = out.concat(readArticlesUrlOnlyTab_(ss.getSheetByName("Articles")));
  if (ss.getSheetByName("Various")) out = out.concat(readVariousTab_(ss.getSheetByName("Various")));
  if (ss.getSheetByName("To be sorted")) out = out.concat(readToBeSortedTab_(ss.getSheetByName("To be sorted")));
  return out;
}

function readSimpleItemLinkTab_(sh, sourceTab, typeLabel) {
  var rows = [];
  var data = sh.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    var title = String(data[r][0] || "").trim();
    var rawLink = String(data[r][1] || "").trim();
    var link = extractUrl_(rawLink) || rawLink;
    if (!title && rawLink) {
      var split = splitTitleFromMixedLinkCell_(rawLink);
      title = split.title;
      link = split.link;
    }
    rows.push(buildRow_(title, typeLabel, "", link, sourceTab));
  }
  return rows;
}

function readArticleAuthorLinkTab_(sh, sourceTab, typeLabel) {
  var rows = [];
  var data = sh.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    var title = String(data[r][0] || "").trim();
    var author = String(data[r][1] || "").trim();
    var link = extractUrl_(String(data[r][2] || "")) || String(data[r][2] || "").trim();
    if (!title && author) { title = author; author = ""; }
    rows.push(buildRow_(title, typeLabel, author, link, sourceTab));
  }
  return rows;
}

function readArticleAuthorTypeLinkTab_(sh, sourceTab, defaultType) {
  var rows = [];
  var data = sh.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    rows.push(buildRow_(
      String(data[r][0] || "").trim(),
      normalizeType_(String(data[r][2] || "").trim() || defaultType),
      String(data[r][1] || "").trim(),
      extractUrl_(String(data[r][3] || "")) || String(data[r][3] || "").trim(),
      sourceTab
    ));
  }
  return rows;
}

function readBooksTab_(sh) {
  var rows = [];
  var data = sh.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    rows.push(buildRow_(
      String(data[r][0] || "").trim(),
      normalizeType_(String(data[r][2] || "").trim() || "Book"),
      String(data[r][1] || "").trim(),
      extractUrl_(String(data[r][3] || "")) || String(data[r][3] || "").trim(),
      "Books"
    ));
  }
  return rows;
}

function readArticlesUrlOnlyTab_(sh) {
  var rows = [];
  var data = sh.getDataRange().getValues();
  for (var r = 0; r < data.length; r++) {
    for (var c = 0; c < data[r].length; c++) {
      var link = extractUrl_(String(data[r][c] || ""));
      if (link) rows.push(buildRow_("Article", "Article", "", link, "Articles"));
    }
  }
  return rows;
}

function readVariousTab_(sh) {
  var rows = [];
  var data = sh.getDataRange().getValues();
  for (var r = 0; r < data.length; r++) {
    var cell = String(data[r][0] || "").trim();
    var link = extractUrl_(cell);
    if (link) rows.push(buildRow_(cell.replace(link, "").trim() || "Resource", "Other", "", link, "Various"));
  }
  return rows;
}

function readToBeSortedTab_(sh) {
  var rows = [];
  var data = sh.getDataRange().getValues();
  for (var r = 2; r < data.length; r++) {
    if (String(data[r][0] || "").trim() || String(data[r][3] || "").trim()) {
      rows.push(buildRow_(
        String(data[r][0] || "").trim(),
        normalizeType_(String(data[r][2] || "").trim() || "Other"),
        String(data[r][1] || "").trim(),
        extractUrl_(String(data[r][3] || "")) || "",
        "To be sorted"
      ));
    }
    if (String(data[r][4] || "").trim()) {
      rows.push(buildRow_(String(data[r][4] || "").trim(), "Book", String(data[r][5] || "").trim(), "", "To be sorted"));
    }
    var gLink = extractUrl_(String(data[r][7] || "")) || String(data[r][7] || "").trim();
    if (String(data[r][6] || "").trim() || gLink) {
      rows.push(buildRow_(String(data[r][6] || "").trim() || "Resource", "Other", "", gLink, "To be sorted"));
    }
  }
  return rows;
}

function buildRow_(title, type, author, link, sourceTab) {
  link = extractUrl_(link) || String(link || "").trim();
  if (isInternalPath_(link)) link = "";
  return {
    title: String(title || "").trim(),
    type: type || "Other",
    topic: inferTopic_(title),
    author: String(author || "").trim(),
    description: "",
    link: link,
    tags: "",
    duration: "",
    featured: "N",
    show_on_site: (String(title || "").trim() && isPublicHttpLink_(link)) ? "Y" : "N",
    source_tab: sourceTab
  };
}

function writeWebsiteTab_(ss, rows, preserved) {
  var sh = ss.getSheetByName(WEBSITE_TAB);
  if (!sh) sh = ss.insertSheet(WEBSITE_TAB);
  sh.clearContents();
  sh.getRange(1, 1, 1, WEBSITE_HEADERS.length).setValues([WEBSITE_HEADERS]);
  if (!rows.length) return;
  var matrix = rows.map(function (row) {
    var link = normalizeLink_(row.link);
    var keep = preserved[link] || {};
    return [
      row.title, row.type, keep.topic != null ? keep.topic : row.topic,
      row.author, keep.description != null ? keep.description : row.description,
      row.link, keep.tags != null ? keep.tags : row.tags,
      keep.duration != null ? keep.duration : row.duration,
      keep.featured != null ? keep.featured : row.featured,
      row.show_on_site, row.source_tab
    ];
  });
  sh.getRange(2, 1, matrix.length, WEBSITE_HEADERS.length).setValues(matrix);
}

function dedupeRowsByLink_(rows) {
  var seen = {};
  var out = [];
  rows.forEach(function (row) {
    var key = normalizeLink_(row.link);
    if (key) {
      if (seen[key]) return;
      seen[key] = true;
    }
    if (!row.title && !row.link) return;
    out.push(row);
  });
  return out;
}

function extractUrl_(text) {
  var m = String(text || "").match(/https?:\/\/[^\s"']+/i);
  if (!m) return "";
  return m[0].replace(/[.,;)\]]+$/, "");
}

function splitTitleFromMixedLinkCell_(raw) {
  var link = extractUrl_(raw);
  var title = String(raw || "").replace(link, "").trim();
  return { title: title || "Podcast", link: link };
}

function isInternalPath_(s) {
  return /^[a-z]:\\/i.test(String(s || "")) || String(s || "").indexOf("Dropbox (") >= 0;
}

function isPublicHttpLink_(s) {
  return /^https?:\/\//i.test(String(s || "").trim());
}

function normalizeLink_(s) {
  return String(s || "").trim().toLowerCase().replace(/\/+$/, "");
}

function normalizeType_(t) {
  var map = { "Youtube": "YouTube", "TedTalk": "Ted Talk", "Audio Book": "Audiobook" };
  return map[t] || t || "Other";
}

function inferTopic_(title) {
  var t = String(title || "").toLowerCase();
  if (/rugby|springbok|olymp|sport|athlete|coach/.test(t)) return "Sport";
  if (/leader|ceo|management|business|startup|entrepreneur/.test(t)) return "Business";
  if (/leadership/.test(t)) return "Leadership";
  if (/happy|motivat|mindset|habit|growth/.test(t)) return "Personal development";
  if (/charity|community|impact|social|volunteer/.test(t)) return "Social impact";
  return "";
}
