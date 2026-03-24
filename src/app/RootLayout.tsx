import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

/**
 * Scrolls to top on every client-side navigation (SPA scroll restoration).
 */
export function RootLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return <Outlet />;
}
