import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

/**
 * Scrolls to top on every client-side navigation (SPA scroll restoration).
 */
export function RootLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // #region agent log
    fetch("http://127.0.0.1:7279/ingest/dee04ff0-16cf-498c-a83a-f49eff7bef7f", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "9328dc" },
      body: JSON.stringify({
        sessionId: "9328dc",
        hypothesisId: "H1",
        location: "RootLayout.tsx:scroll",
        message: "Route change scroll",
        data: {
          pathname,
          search,
          bodyPointerEvents: typeof document !== "undefined" ? document.body.style.pointerEvents : "",
          scrollLockAttr:
            typeof document !== "undefined" ? document.body.getAttribute("data-scroll-locked") : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [pathname, search]);

  return <Outlet />;
}
