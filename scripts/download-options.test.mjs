import assert from "node:assert/strict";
import test from "node:test";

import { getDownloadOptions } from "../src/lib/download-options.ts";

const fallback = "https://github.com/BenderBlog/traintime_pda/releases/latest";
const patterns = [{ pattern: /arm64\.apk$/, displayName: "ARM64" }];
test("empty or nonmatching release assets still offer a working release link", () => {
  for (const assets of [
    [],
    [
      {
        name: "source.zip",
        browser_download_url: "https://example.org/source",
      },
    ],
  ]) {
    assert.deepEqual(
      getDownloadOptions(
        { id: "android", available: true },
        assets,
        patterns,
        fallback,
        "Download",
      ),
      [{ url: fallback, label: "Download" }],
    );
  }
});
test("matched assets carry their architecture label", () => {
  assert.deepEqual(
    getDownloadOptions(
      { id: "android", available: true },
      [{ name: "arm64.apk", browser_download_url: "https://example.org/app" }],
      patterns,
      fallback,
      "Download",
    ),
    [{ url: "https://example.org/app", label: "ARM64" }],
  );
});
test("OHOS always links to its independent store; unavailable platforms offer nothing", () => {
  const platform = {
    id: "ohos",
    available: true,
    downloadUrl: "https://appgallery.huawei.com/app/detail?id=com.xdyou.hmos",
  };
  assert.equal(
    getDownloadOptions(
      platform,
      [{ name: "arm64.apk", browser_download_url: "https://example.org/app" }],
      patterns,
      fallback,
      "AppGallery",
    )[0].url,
    platform.downloadUrl,
  );
  assert.deepEqual(
    getDownloadOptions(
      { ...platform, available: false },
      [],
      patterns,
      fallback,
      "AppGallery",
    ),
    [],
  );
});
