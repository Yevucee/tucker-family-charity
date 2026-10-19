/**
 * Remembers what the customer was paying for across the redirect to Yoco and back, so the
 * return page can show a helpful message. UX only — never proof of payment (the Yoco
 * webhook is). Storage can be missing or empty (private mode, in-app browsers that open the
 * return link in a different browser), so every read/write is best-effort.
 */

export type CheckoutFlow = "shop" | "donate";

export interface RememberedCheckout {
  flow: CheckoutFlow;
  kind: "wine" | "product" | "donation";
  /** Wine orders only: where the customer confirmation email is sent. */
  email?: string;
  savedAt: number;
}

const STORAGE_KEY = "tfc:yoco:last-checkout";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function storages(): Storage[] {
  const found: Storage[] = [];
  for (const get of [() => window.localStorage, () => window.sessionStorage]) {
    try {
      found.push(get());
    } catch {
      /* storage blocked */
    }
  }
  return found;
}

export function rememberCheckout(info: Omit<RememberedCheckout, "savedAt">): void {
  const value = JSON.stringify({ ...info, savedAt: Date.now() } satisfies RememberedCheckout);
  for (const store of storages()) {
    try {
      store.setItem(STORAGE_KEY, value);
    } catch {
      /* quota / blocked */
    }
  }
}

export function readRememberedCheckout(flow: CheckoutFlow): RememberedCheckout | null {
  for (const store of storages()) {
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Partial<RememberedCheckout>;
      if (
        parsed.flow === flow &&
        (parsed.kind === "wine" || parsed.kind === "product" || parsed.kind === "donation") &&
        typeof parsed.savedAt === "number" &&
        Date.now() - parsed.savedAt < MAX_AGE_MS
      ) {
        return {
          flow,
          kind: parsed.kind,
          email: typeof parsed.email === "string" ? parsed.email : undefined,
          savedAt: parsed.savedAt,
        };
      }
    } catch {
      /* corrupt entry */
    }
  }
  return null;
}

export function clearRememberedCheckout(): void {
  for (const store of storages()) {
    try {
      store.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
