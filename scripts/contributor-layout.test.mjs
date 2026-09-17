import assert from "node:assert/strict";
import test from "node:test";

import { scatterContributors } from "../src/lib/contributor-layout.ts";

for (const [width, height] of [
  [280, 440],
  [342, 440],
  [528, 480],
  [912, 480],
  [1072, 480],
]) {
  test(`contributor scatter fits ${width}x${height} with room for motion`, () => {
    const positions = scatterContributors(42, width, height);
    assert.deepEqual(positions, scatterContributors(42, width, height));
    assert.equal(positions.length, 42);
    positions.forEach((a, index) => {
      assert.ok(a.x - a.size / 2 >= 12 && a.x + a.size / 2 <= width - 12);
      assert.ok(a.y - a.size / 2 >= 12 && a.y + a.size / 2 <= height - 12);
      for (const b of positions.slice(index + 1)) {
        assert.ok(Math.hypot(a.x - b.x, a.y - b.y) - (a.size + b.size) / 2 > 8);
      }
    });
    assert.equal(new Set(positions.map((p) => Math.round(p.x * 100))).size, 42);
    assert.equal(new Set(positions.map((p) => Math.round(p.y * 100))).size, 42);
  });
}
