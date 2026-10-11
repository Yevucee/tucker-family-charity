import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./RootLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { OliversVillage } from "./pages/OliversVillage";
import { Events } from "./pages/Events";
import { Shop } from "./pages/Shop";
import { PersonalisedCharityHat } from "./pages/PersonalisedCharityHat";
import { CharityWine } from "./pages/CharityWine";
import { Partners } from "./pages/Partners";
import { Donate } from "./pages/Donate";
import {
  DonateCancelled,
  DonateFailed,
  DonateThankYou,
  ShopPaymentCancelled,
  ShopPaymentFailed,
  ShopPaymentSuccess,
} from "./pages/PaymentResult";
import { KeepItInTheFamily } from "./pages/KeepItInTheFamily";
import { KitfResourceLibrary } from "./pages/KitfResourceLibrary";
import { GolfLearnershipProgramme } from "./pages/GolfLearnershipProgramme";
import { PropertyPartnerships } from "./pages/PropertyPartnerships";
import { LookingForWork } from "./pages/work-opportunities/LookingForWork";
import { WorkAvailable } from "./pages/work-opportunities/WorkAvailable";
import { WorkOpportunitiesLayout } from "./pages/work-opportunities/WorkOpportunitiesLayout";

/** React Router basename: empty string at site root; no trailing slash for subpaths. */
const routerBasename = (() => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base === "" ? "" : base;
})();

export const router = createBrowserRouter(
  [
    {
      Component: RootLayout,
      children: [
        { index: true, Component: Home },
        { path: "about", Component: About },
        { path: "olivers-village", Component: OliversVillage },
        { path: "events", Component: Events },
        { path: "shop", Component: Shop },
        { path: "shop/personalised-hat", Component: PersonalisedCharityHat },
        { path: "shop/wine", Component: CharityWine },
        // Yoco redirect landing pages (UX only — payment is confirmed by the Railway webhook)
        { path: "shop/payment/success", Component: ShopPaymentSuccess },
        { path: "shop/payment/cancelled", Component: ShopPaymentCancelled },
        { path: "shop/payment/failed", Component: ShopPaymentFailed },
        { path: "partners", Component: Partners },
        { path: "donate", Component: Donate },
        { path: "donate/thank-you", Component: DonateThankYou },
        { path: "donate/cancelled", Component: DonateCancelled },
        { path: "donate/failed", Component: DonateFailed },
        { path: "keep-it-in-the-family", Component: KeepItInTheFamily },
        { path: "keep-it-in-the-family/library", Component: KitfResourceLibrary },
        { path: "golf-learnership-programme", Component: GolfLearnershipProgramme },
        { path: "property-partnerships", Component: PropertyPartnerships },
        {
          path: "work-opportunities",
          Component: WorkOpportunitiesLayout,
          children: [
            { index: true, loader: () => redirect("/work-opportunities/looking-for-work/") },
            { path: "looking-for-work", Component: LookingForWork },
            { path: "work-available", Component: WorkAvailable },
          ],
        },
        {
          path: "opportunities",
          loader: () => redirect("/work-opportunities/looking-for-work/"),
        },
        {
          path: "merch",
          loader: () => redirect("/shop"),
        },
        {
          path: "*",
          loader: () => redirect("/"),
        },
      ],
    },
  ],
  { basename: routerBasename }
);
