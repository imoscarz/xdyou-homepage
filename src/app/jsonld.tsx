import type {
  BlogPosting,
  BreadcrumbList,
  Country,
  EducationalOrganization,
  Occupation,
  Organization,
  Person,
  PostalAddress,
  WebSite,
  WithContext,
} from "schema-dts";

import { DATA, getEmail } from "@/data";

/*
 * Generate BreadcrumbList JSON-LD
 */

export function generateBreadcrumbListJsonLd(
  locale: "en" | "zh" = "en",
): string {
  const breadcrumbList: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: DATA.navbar.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item:
        locale === "zh"
          ? `${DATA.url}/zh${item.href}`
          : `${DATA.url}${item.href}`,
    })),
  };

  return JSON.stringify(breadcrumbList);
}

/*
 * Generate Website JSON-LD
 */

export function generateWebsiteJsonLd(locale: "en" | "zh" = "en"): string {
  const author: Person = {
    "@type": "Person",
    name: locale === "zh" ? DATA.chinese.name : DATA.name,
    url: locale === "zh" ? `${DATA.url}/zh` : DATA.url,
  };

  const websiteJsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name:
      locale === "zh"
        ? `${DATA.chinese.name} - 主页`
        : `${DATA.name} - Portfolio`,
    description: locale === "zh" ? DATA.chinese.description : DATA.description,
    url: locale === "zh" ? `${DATA.url}/zh` : DATA.url,
    author,
  };

  return JSON.stringify(websiteJsonLd);
}

/*
 * Generate Person JSON-LD
 */

function getSocialMediaUrls(): string[] {
  return Object.values(DATA.contact.social)
    .filter((social) => social.url && social.name !== "Email")
    .map((social) => social.url);
}

function getAddress(): PostalAddress {
  const addressCountry: Country = { "@type": "Country", name: "Singapore" };
  const address: PostalAddress = {
    "@type": "PostalAddress",
    addressLocality: DATA.location,
    addressCountry,
  };
  return address;
}

function getOrganization(): Organization {
  const organization: Organization = {
    "@type": "Organization",
    name: "HPC-AI Tech",
    url: "https://www.hpcaitech.com/",
  };
  return organization;
}

function getOccupation(): Occupation {
  return {
    "@type": "Occupation",
    name: "Tech Lead",
    description: "Full Stack Developer & AI Researcher",
  };
}

function getEducation(): EducationalOrganization[] {
  return DATA.education.map((edu) => ({
    "@type": "EducationalOrganization",
    name: edu.school,
    url: edu.href,
  }));
}

export function generatePersonJsonLd(locale: "en" | "zh" = "en"): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: locale === "zh" ? DATA.chinese.name : DATA.name,
    givenName: DATA.firstName,
    familyName: DATA.surname,
    alternateName: locale === "zh" ? DATA.chinese.name : DATA.name,
    description: locale === "zh" ? DATA.chinese.description : DATA.description,
    url: locale === "zh" ? `${DATA.url}/zh` : DATA.url,
    image: `${DATA.url}${DATA.avatarUrl}`,
    /* Contact Info */
    email: getEmail(),
    sameAs: getSocialMediaUrls(),
    address: getAddress(),
    /* Work Info */
    jobTitle: "Tech Lead",
    worksFor: getOrganization(),
    hasOccupation: getOccupation(),
    knowsAbout: DATA.skills,
    /* Education Info */
    alumniOf: getEducation(),
  });
}

/*
 * Generate Blog JSON-LD
 */
export function generateBlogJsonLd(
  posts: {
    metadata: Record<string, unknown> & {
      title: string;
      date: string;
      summary: string;
    };
    slug: string;
    locale?: string;
  }[],
): string {
  const itemListElements = posts
    .filter((post) => post.locale !== "zh")
    .map((post, index) => {
      const postUrl = `${DATA.url}/blog/${post.slug}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        url: postUrl,
      };
    });

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: itemListElements,
  });
}

/*
 * Generate BlogPosting JSON-LD
 */

export function generateBlogPostingJsonLd(post: {
  metadata: Record<string, unknown> & {
    title: string;
    date: string;
    summary: string;
    image?: string;
  };
  slug: string;
  locale?: string;
}): string {
  const socialMediaUrls = getSocialMediaUrls();

  const author: Person = {
    "@type": "Person",
    name: DATA.name,
    url: DATA.url,
    sameAs: socialMediaUrls,
  };

  const publisher: Person = {
    "@type": "Person",
    name: DATA.name,
    url: DATA.url,
  };

  const baseUrl = `${DATA.url}/blog`;
  const postUrl = post.locale === "en" 
    ? `${baseUrl}/${post.slug}?lang=en` 
    : `${baseUrl}/${post.slug}`;

  const blogPosting: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    datePublished: post.metadata.date,
    dateModified: post.metadata.date,
    description: post.metadata.summary,
    image: post.metadata.image
      ? `${DATA.url}${post.metadata.image}`
      : `${postUrl}/opengraph-image`,
    url: postUrl,
    author,
    publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return JSON.stringify(blogPosting);
}
