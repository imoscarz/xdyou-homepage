import assert from "node:assert/strict";
import test from "node:test";

import { createSnapshot, parseDevelopers } from "./contributors-parser.mjs";

const entry =
  'Developer("Person", "https://example.org/avatar.png", "setting.about_page.person", "https://example.org"),';
const dart = `const List<Developer> getDevelopers = [ // ignored\n ${entry} ];`;
const zh = "setting:\n  about_page:\n    person: 开发：课程表\n";
const en = "setting:\n  about_page:\n    person: 'Development: schedule'\n";
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
