import assert from "node:assert/strict";
import test from "node:test";

import {
  detectPlatform,
  resolvePlatformDownload,
} from "../src/lib/platform-detection.ts";

test("platform precedence handles Harmony, Android, iPad desktop mode and ChromeOS", () => {
  for (const [info, expected] of [
    [{ userAgent: "Linux Android HarmonyOS" }, "ohos"],
    [{ userAgent: "Linux Android 10" }, "android"],
    [
      { userAgent: "Macintosh", platform: "MacIntel", maxTouchPoints: 5 },
      "ios",
    ],
    [{ userAgent: "iPhone" }, "ios"],
    [{ userAgent: "Macintosh", maxTouchPoints: 0 }, "unknown"],
    [{ userAgent: "X11 CrOS Linux x86_64" }, "unknown"],
    [{ userAgent: "Linux", hintPlatform: "Windows" }, "windows"],
    [{ userAgent: "Darwin" }, "unknown"],
  ])
    assert.equal(detectPlatform(info), expected);
});

test("direct downloads require a matching architecture and existing asset", () => {
  const assets = [
    {
      name: "app-arm64-v8a-release.apk",
      browser_download_url: "https://example.org/android",
    },
    {
      name: "watermeter-windows-release-amd64.zip",
      browser_download_url: "https://example.org/windows",
    },
  ];
  const resolve = (info) =>
    resolvePlatformDownload(info, assets, "https://apps.apple.com/app");
  assert.equal(resolve({ userAgent: "Android" }), "#download-android");
  assert.equal(
    resolve({ userAgent: "Android", architecture: "arm", bitness: "64" }),
    "https://example.org/android",
  );
  assert.equal(
    resolve({ userAgent: "Windows NT Win64 x64" }),
    "https://example.org/windows",
  );
  assert.equal(
    resolve({
      userAgent: "Windows NT Win64 x64",
      architecture: "arm",
      bitness: "64",
    }),
    "#download-windows",
  );
  assert.equal(resolve({ userAgent: "Linux aarch64" }), "#download-linux");
  assert.equal(resolve({ userAgent: "HarmonyOS Android" }), "#download-ohos");
  assert.equal(resolve({ userAgent: "iPad" }), "https://apps.apple.com/app");
  assert.equal(resolve({ userAgent: "Unknown" }), "#downloads");
  assert.equal(
    resolvePlatformDownload({ userAgent: "Windows Win64" }, [], ""),
    "#download-windows",
  );
});
