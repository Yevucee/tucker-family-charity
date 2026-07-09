import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

export const DEFAULT_PHONE_COUNTRY: CountryCode = "ZA";

export type PhoneCountryOption = {
  code: CountryCode;
  name: string;
  callingCode: string;
};

let cachedCountryOptions: PhoneCountryOption[] | null = null;

/** All countries with dial codes; South Africa first, then alphabetical. */
export function getPhoneCountryOptions(): PhoneCountryOption[] {
  if (cachedCountryOptions) return cachedCountryOptions;

  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  const all = getCountries()
    .map((code) => ({
      code,
      name: displayNames.of(code) ?? code,
      callingCode: `+${getCountryCallingCode(code)}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  const za = all.find((c) => c.code === "ZA");
  const rest = all.filter((c) => c.code !== "ZA");
  cachedCountryOptions = za ? [za, ...rest] : all;
  return cachedCountryOptions;
}

export function phonePlaceholderForCountry(country: CountryCode): string {
  if (country === "ZA") return "e.g. 082 123 4567 or 011 123 4567";
  return "Enter your local number (with or without leading 0)";
}

type PhoneOk = { ok: true; display: string; e164: string };
type PhoneErr = { ok: false; error: string };

function tryParsePhone(input: string, country: CountryCode) {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  let parsed = parsePhoneNumberFromString(trimmed, country);
  if (parsed?.isValid()) return parsed;

  if (trimmed.startsWith("+")) {
    parsed = parsePhoneNumberFromString(trimmed);
    if (parsed?.isValid()) return parsed;
  }

  // Legacy SA sheet values: 9 digits without leading 0
  if (country === "ZA") {
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length === 9 && !digits.startsWith("0")) {
      parsed = parsePhoneNumberFromString(`0${digits}`, "ZA");
      if (parsed?.isValid()) return parsed;
    }
  }

  return undefined;
}

/** Validate and normalize for storage in the Google Sheet (international display format). */
export function normalizePhoneForStorage(
  nationalNumber: string,
  country: CountryCode = DEFAULT_PHONE_COUNTRY
): PhoneOk | PhoneErr {
  const trimmed = nationalNumber.trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter a phone number." };
  }

  const parsed = tryParsePhone(trimmed, country);
  if (!parsed) {
    return {
      ok: false,
      error: "Please enter a valid phone number for the selected country.",
    };
  }

  return {
    ok: true,
    display: parsed.formatInternational(),
    e164: parsed.format("E.164"),
  };
}

/** Format messy sheet values for display on listing cards. */
export function formatPhoneForDisplay(
  raw: string,
  hintCountry: CountryCode = DEFAULT_PHONE_COUNTRY
): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const parsed = tryParsePhone(trimmed, hintCountry);
  if (parsed) return parsed.formatInternational();

  return trimmed;
}

/** E.164 tel: link from a sheet or form value. */
export function phoneTelHref(
  raw: string,
  hintCountry: CountryCode = DEFAULT_PHONE_COUNTRY
): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const parsed = tryParsePhone(trimmed, hintCountry);
  if (parsed) return `tel:${parsed.format("E.164")}`;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("27") && digits.length >= 11) return `tel:+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `tel:+27${digits.slice(1)}`;
  if (digits.length === 9 && hintCountry === "ZA") return `tel:+27${digits}`;
  if (digits) return `tel:+${digits}`;
  return `tel:${trimmed.replace(/\s/g, "")}`;
}
