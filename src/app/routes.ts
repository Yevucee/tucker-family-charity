import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./RootLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { OliversVillage } from "./pages/OliversVillage";
import { Events } from "./pages/Events";
import { Shop } from "./pages/Shop";
import { Partners } from "./pages/Partners";
import { Donate } from "./pages/Donate";
import { KeepItInTheFamily } from "./pages/KeepItInTheFamily";
import { GolfLearnershipProgramme } from "./pages/GolfLearnershipProgramme";

/** React Router expects basename without a trailing slash; Vite BASE_URL includes one. */
const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

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
        { path: "partners", Component: Partners },
        { path: "donate", Component: Donate },
        { path: "keep-it-in-the-family", Component: KeepItInTheFamily },
        { path: "golf-learnership-programme", Component: GolfLearnershipProgramme },
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
