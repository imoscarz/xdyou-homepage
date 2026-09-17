import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  homeChapters,
  homeLegacyAnchors,
  homeSections,
} from "../src/config/home-chapters.ts";

test("homepage sections are unique, ordered and legacy anchors target the first chapter", () => {
  assert.deepEqual(homeSections, [
    "hero",
    "study",
    "spaces",
    "daily",
    "services",
    "explore",
    "downloads",
    "join",
    "contributors",
  ]);
  assert.equal(new Set(homeSections).size, homeSections.length);
  assert.deepEqual(homeLegacyAnchors, {
    functions: "study",
    screenshots: "study",
  });
});
test("every chapter has bilingual copy and real screenshot references", () => {
  for (const locale of ["zh", "en"]) {
    const dict = JSON.parse(
      readFileSync(
        new URL(`../src/lib/i18n/locales/${locale}.json`, import.meta.url),
        "utf8",
      ),
    );
    for (const chapter of homeChapters) {
      const copy = dict.home.pages.chapters[chapter.id];
      assert.ok(copy.label && copy.title && copy.description);
      assert.ok(copy.points.length > 0 && copy.points.length <= 3);
      for (const image of chapter.images) {
        assert.ok(
          readFileSync(
            new URL(
              `../public/img/screenshots/${image.scene}-${image.type}.png`,
              import.meta.url,
            ),
          ).length,
        );
      }
    }
  }
});
