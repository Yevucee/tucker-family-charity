# Keep It In The Family – Spreadsheet Mapping

Two separate Google Sheets power the two tabs. Both are fetched at runtime—updates to the sheets appear on the next page refresh. Make sure each sheet is connected to the correct tab.

---

## Services tab → Services spreadsheet

**Purpose:** Trusted professionals (plumbers, electricians, accountants, builders, etc.)

**Sheet columns:** `name` | `profession` | `area` | `phone` | `trusted_by` | `notes` | `website`

**Config:** `VITE_DIRECTORY_SHEET_ID` or `VITE_SERVICES_SHEET_ID` (GitHub Secrets)

**Current default Sheet ID:** `1tC3IcX81_tdA2_UHTjT2JEIG-i9hr_ovgCQS5fJV7tw`

**Data flow:** Fetched at runtime from opensheet API (client-side)

---

## Networking tab → Business Networking spreadsheet

**Purpose:** Business owners and shareholders (networking directory)

**Sheet columns:** `name` | `company` | `sectors` | `business_interests` | `phone` | `email` | `area` | `website`

**Config:** `VITE_NETWORKING_SHEET_ID` (GitHub Secrets)

**Current default Sheet ID:** `1z37lsb3N9VAqIxgRMdPYrqVOm61bt6KltjJpsD_FIrw`

**Data flow:** Fetched at runtime from opensheet API (same as Services). Updates appear on refresh.

---

## Summary

| Tab        | Spreadsheet       | Env var                    |
|-----------|-------------------|-----------------------------|
| Services  | Services          | `VITE_DIRECTORY_SHEET_ID`   |
| Networking| Business Networking| `VITE_NETWORKING_SHEET_ID` |

To override the default sheet for a tab, add the corresponding secret in **Settings → Secrets and variables → Actions**.
