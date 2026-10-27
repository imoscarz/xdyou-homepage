import assert from "node:assert/strict";
import test from "node:test";

import { createSnapshot, parseDevelopers } from "./contributors-parser.mjs";

const entry =
  'Developer("Person", "https://example.org/avatar.png", "setting.about_page.person", "https://example.org"),';
const dart = `const List<Developer> getDevelopers = [ // ignored\n ${entry} ];`;
const zh = "about_page:\n  person: 开发：课程表\n";
const en = "about_page:\n  person: 'Development: schedule'\n";
const sha = "a".repeat(40);
test("joins source literals with localized descriptions", () => {
  const result = createSnapshot(dart, zh, en, sha);
  assert.equal(result.contributors[0].description.en, "Development: schedule");
  assert.equal(result.source.revision, sha);
});
test("fails closed on duplicate, empty or unsupported data", () => {
  assert.throws(
    () => parseDevelopers(dart.replace(entry, entry + entry)),
    /Duplicate/,
  );
  assert.throws(() => parseDevelopers(dart.replace(entry, "")), /Empty/);
  assert.throws(
    () => parseDevelopers(dart.replace('"Person"', "getName()")),
    /literal/,
  );
  assert.throws(
    () =>
      parseDevelopers(
        dart.replace('https://example.org"', 'javascript:alert(1)"'),
      ),
    /Invalid/,
  );
});
test("missing Chinese is an error; missing English falls back explicitly", () => {
  assert.throws(() => createSnapshot(dart, "{}", en, sha), /Missing Chinese/);
  assert.equal(
    createSnapshot(dart, zh, "{}", sha).contributors[0].description.en,
    "开发：课程表",
  );
});
test("names can change without changing identity; list order follows upstream", () => {
  assert.equal(
    parseDevelopers(dart.replace('"Person"', '"Renamed"'))[0].id,
    "setting.about_page.person",
  );
  assert.equal(
    parseDevelopers(
      dart.replace(entry, entry + entry.replaceAll("person", "second")),
    )[1].id,
    "setting.about_page.second",
  );
});

const slangEntry = entry.replace(
  '"setting.about_page.person"',
  "(t) => t.setting.aboutPage.person",
);
const slangDart = `final List<Developer> getDevelopers = [ ${slangEntry} ];`;

test("joins current Slang callbacks with namespaced YAML at one revision", () => {
  const result = createSnapshot(slangDart, zh, en, sha);
  assert.deepEqual(
    result.contributors,
    createSnapshot(dart, zh, en, sha).contributors,
  );
  assert.deepEqual(result.source.files, [
    "lib/model/about_page.dart",
    "assets/i18n/zh/setting.yaml",
    "assets/i18n/en/setting.yaml",
  ]);
  assert.equal(result.source.revision, sha);
  assert.equal(
    createSnapshot(slangDart, zh, "{}", sha).contributors[0].description.en,
    "开发：课程表",
  );
});

test("Slang camel-case accessors preserve original contributor identities", () => {
  for (const [sourceKey, member] of [
    ["hazuki-keatsu", "hazukiKeatsu"],
    ["imaginary_17", "imaginary17"],
    ["ka-mate-ka-ora", "kaMateKaOra"],
    ["lagrange-x", "lagrangeX"],
    ["lhx-666-cool", "lhx666Cool"],
    ["lqsy-h", "lqsyH"],
    ["zyar-er", "zyarEr"],
  ]) {
    const result = createSnapshot(
      slangDart.replace("aboutPage.person", `aboutPage.${member}`),
      `about_page:\n  ${sourceKey}: 开发：课程表\n`,
      "{}",
      sha,
    );
    assert.equal(result.contributors[0].id, `setting.about_page.${sourceKey}`);
  }
});

test("Slang references fail closed on missing, ambiguous or executable data", () => {
  assert.throws(
    () => createSnapshot(slangDart, "{}", en, sha),
    /Missing Chinese/,
  );
  assert.throws(
    () =>
      createSnapshot(slangDart, zh.replace("开发：课程表", "null"), en, sha),
    /Missing Chinese/,
  );
  assert.throws(
    () =>
      createSnapshot(
        slangDart.replace("aboutPage.person", "aboutPage.firstPerson"),
        "about_page:\n  first-person: 一\n  first_person: 二\n",
        "{}",
        sha,
      ),
    /Ambiguous/,
  );
  for (const expression of [
    "(t) => other.setting.aboutPage.person",
    "(t) => t.setting.otherPage.person",
    "(t) => t.setting.aboutPage.person()",
    "(t) => t.setting.aboutPage.person + getName()",
    "(t) { return t.setting.aboutPage.person; }",
  ]) {
    assert.throws(() =>
      createSnapshot(
        slangDart.replace("(t) => t.setting.aboutPage.person", expression),
        zh,
        en,
        sha,
      ),
    );
  }
  assert.throws(
    () =>
      createSnapshot(
        slangDart.replace(slangEntry, slangEntry + entry),
        zh,
        en,
        sha,
      ),
    /Duplicate/,
  );
});
