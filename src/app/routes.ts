import { createBrowserRouter, redirect } from "react-router";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Events } from "./pages/Events";
import { Shop } from "./pages/Shop";
import { Partners } from "./pages/Partners";
import { Donate } from "./pages/Donate";
import { KeepItInTheFamily } from "./pages/KeepItInTheFamily";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/about",
      Component: About,
    },
    {
      path: "/events",
      Component: Events,
    },
    {
      path: "/shop",
      Component: Shop,
    },
    {
      path: "/partners",
      Component: Partners,
    },
    {
      path: "/donate",
      Component: Donate,
    },
    {
      path: "/keep-it-in-the-family",
      Component: KeepItInTheFamily,
    },
    {
      path: "/merch",
      loader: () => redirect("/shop"),
    },
    {
      path: "*",
      loader: () => redirect("/"),
    },
  ],
  { basename: import.meta.env.BASE_URL }
);