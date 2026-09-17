// Content keys refer to home.pages in both locale dictionaries; scenes reuse real captures.
export const homeChapters = [
  {
    id: "study",
    layout: "wide",
    switchImages: true,
    images: [
      { scene: "schedule", type: "desktop" },
      { scene: "schedule", type: "mobile" },
    ],
  },
  {
    id: "spaces",
    layout: "wide",
    switchImages: true,
    images: [
      { scene: "classroom", type: "desktop" },
      { scene: "classroom", type: "mobile" },
    ],
  },
  {
    id: "daily",
    layout: "phone",
    switchImages: true,
    images: [
      { scene: "homepage-light", type: "mobile" },
      { scene: "homepage", type: "mobile" },
      { scene: "card", type: "mobile" },
      { scene: "library", type: "mobile" },
    ],
  },
  {
    id: "services",
    layout: "daily",
    images: [
      { scene: "network", type: "mobile" },
      { scene: "water", type: "mobile" },
    ],
  },
  {
    id: "explore",
    layout: "phone",
    images: [{ scene: "pig", type: "mobile" }],
  },
] as const;

export const homeSections = [
  "hero",
  ...homeChapters.map((chapter) => chapter.id),
  "downloads",
  "join",
  "contributors",
] as const;
export const homeLegacyAnchors = {
  functions: "study",
  screenshots: "study",
} as const;
