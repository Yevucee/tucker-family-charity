import { useEffect } from "react";
import {
  CONTACT_EMAIL,
  OG_IMAGE_URL,
  ROBOTS_META,
  SITE_AREA_SERVED,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_PROFILES,
  THEME_COLOR,
} from "./site";
import { canonicalUrl, type PageMeta } from "./routes";

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"][data-seo-managed="true"]`,
  );
  if (!el) {
    el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    el.setAttribute("data-seo-managed", "true");
    document.head.appendChild(el);
  }
  el.setAttribute("data-seo-managed", "true");
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-seo-managed="true"]`);
  if (!el) {
    el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    el.setAttribute("data-seo-managed", "true");
    document.head.appendChild(el);
  }
  el.setAttribute("data-seo-managed", "true");
  el.href = href;
}

function buildJsonLd(meta: PageMeta): object {
  const url = canonicalUrl(meta.path);
  const organization = {
    "@type": "NonprofitOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: OG_IMAGE_URL,
    description: SITE_TAGLINE,
    email: CONTACT_EMAIL,
    areaServed: SITE_AREA_SERVED,
    sameAs: [...SOCIAL_PROFILES],
  };

  const graph: object[] = [
    organization,
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: meta.description,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-ZA",
    },
    {
      "@type": meta.schemaType ?? "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: meta.title,
      description: meta.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-ZA",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

type PageHeadProps = {
  meta: PageMeta;
};

export function PageHead({ meta }: PageHeadProps) {
  useEffect(() => {
    const url = canonicalUrl(meta.path);

    document.title = meta.title;

    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", ROBOTS_META);
    upsertMeta("name", "theme-color", THEME_COLOR);

    upsertLink("canonical", url);

    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:image", OG_IMAGE_URL);
    upsertMeta("property", "og:locale", "en_ZA");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", OG_IMAGE_URL);

    const scriptId = "seo-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.setAttribute("data-seo-managed", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildJsonLd(meta));
  }, [meta]);

  return null;
}
