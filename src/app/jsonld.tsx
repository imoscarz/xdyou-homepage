import type {
  Organization,
  SoftwareApplication,
  WebSite,
  WithContext,
} from "schema-dts";

import { projectConfig } from "@/config/project";
import { DATA } from "@/data";

/*
 * Generate BreadcrumbList JSON-LD
 */

export function generateBreadcrumbListJsonLd(
  locale: "en" | "zh" = "en",
): string {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: DATA.navbar.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item:
        locale === "zh"
          ? `${DATA.url}${item.href}?lang=zh`
          : `${DATA.url}${item.href}`,
    })),
  };

  return JSON.stringify(breadcrumbList);
}

/*
 * Generate Website JSON-LD
 */

export function generateWebsiteJsonLd(locale: "en" | "zh" = "en"): string {
  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: projectConfig.name,
    alternateName: projectConfig.fullName,
    description:
      locale === "zh"
        ? projectConfig.description.zh
        : projectConfig.description.en,
    url: locale === "zh" ? `${DATA.url}?lang=zh` : DATA.url,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
  };

  return JSON.stringify(website);
}

/*
 * Generate SoftwareApplication JSON-LD for XDYou
 */

export function generateSoftwareApplicationJsonLd(
  locale: "en" | "zh" = "en",
): string {
  const application: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectConfig.name,
    alternateName: projectConfig.fullName,
    description:
      locale === "zh"
        ? projectConfig.description.zh
        : projectConfig.description.en,
    url: projectConfig.repo.url,
    applicationCategory: "EducationalApplication",
    operatingSystem: projectConfig.platforms
      .filter((p) => p.available)
      .map((p) => p.name)
      .join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "XDYou Team",
      url: projectConfig.repo.url,
    },
  };

  return JSON.stringify(application);
}

/*
 * Generate Organization JSON-LD
 */

export function generateOrganizationJsonLd(): string {
  const organization: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "XDYou Team",
    url: projectConfig.repo.url,
    logo: `${DATA.url}${projectConfig.logo}`,
    sameAs: [projectConfig.repo.url],
  };

  return JSON.stringify(organization);
}
