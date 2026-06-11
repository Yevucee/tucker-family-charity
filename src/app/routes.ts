import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./RootLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { OliversVillage } from "./pages/OliversVillage";
import { Events } from "./pages/Events";
import { Shop } from "./pages/Shop";
import { PersonalisedCharityHat } from "./pages/PersonalisedCharityHat";
import { Partners } from "./pages/Partners";
import { Donate } from "./pages/Donate";
import { KeepItInTheFamily } from "./pages/KeepItInTheFamily";
import { GolfLearnershipProgramme } from "./pages/GolfLearnershipProgramme";
import { PropertyPartnerships } from "./pages/PropertyPartnerships";
import { Opportunities } from "./pages/Opportunities";

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
        { path: "partners", Component: Partners },
        { path: "donate", Component: Donate },
        { path: "keep-it-in-the-family", Component: KeepItInTheFamily },
        { path: "golf-learnership-programme", Component: GolfLearnershipProgramme },
        { path: "property-partnerships", Component: PropertyPartnerships },
        { path: "opportunities", Component: Opportunities },
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
