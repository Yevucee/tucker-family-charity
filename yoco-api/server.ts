/**
 * Railway entry point — `npm run start:yoco` (prod) / `npm run dev:yoco` (local, port 8787).
 * See docs/YOCO_RAILWAY_SETUP.md.
 */

import { configFromEnv, createApp } from "./app.ts";

const config = configFromEnv();
const { app, keyMode } = createApp(config);
const port = Number(process.env.PORT) || 8787;

app.listen(port, () => {
  console.log(`[tucker-yoco-checkout] listening on :${port}`);
  console.log(`[tucker-yoco-checkout] Yoco key mode: ${keyMode}${keyMode === "live" ? " (REAL payments)" : ""}`);
  console.log(`[tucker-yoco-checkout] site: ${config.publicSiteUrl}`);
  console.log(
    `[tucker-yoco-checkout] catalog: ${config.sheetId ? `Sheet ${config.sheetId} (${config.sheetTab} / ${config.settingsTab})` : "fallback JSON (PAYMENT_CATALOG_SHEET_ID not set)"}`,
  );
  if (!config.yocoWebhookSecret) console.log("[tucker-yoco-checkout] WARNING: YOCO_WEBHOOK_SECRET not set — webhooks will be rejected");
  if (!config.wineNotifyUrl) console.log("[tucker-yoco-checkout] note: WINE_ORDER_NOTIFY_URL not set — paid wine orders only appear in logs + Yoco");
});
