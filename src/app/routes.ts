import { createBrowserRouter, redirect } from "react-router";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Events } from "./pages/Events";
import { Shop } from "./pages/Shop";

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