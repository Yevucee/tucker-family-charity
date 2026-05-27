import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

/**
 * Scroll restoration: anchors like `/shop#tucker-products` must scroll after the target
 * route mounts; otherwise we'd stay at top and hide sections below the fold.
 */
export function RootLayout() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const id = hash.replace(/^#/, "");

    const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (!id) {
      scrollTop();
      return;
    }

    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 0);

    return () => window.clearTimeout(t);
  }, [pathname, search, hash]);

  return <Outlet />;
}
