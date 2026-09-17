export type DeviceInfo = {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
  hintPlatform?: string;
  architecture?: string;
  bitness?: string;
};
export type DownloadAsset = { name: string; browser_download_url: string };

export function detectPlatform(info: DeviceInfo) {
  const ua = info.userAgent.toLowerCase();
  const hint = info.hintPlatform?.toLowerCase();
  if (/harmonyos|openharmony|ohos/.test(`${ua} ${hint}`)) return "ohos";
  if (hint === "android" || /android/.test(ua)) return "android";
  if (
    hint === "ios" ||
    /iphone|ipad|ipod/.test(ua) ||
    (/mac/i.test(info.platform || ua) && (info.maxTouchPoints || 0) > 1)
  )
    return "ios";
  // ChromeOS often also advertises Linux, but cannot use Linux desktop packages directly.
  if (hint === "chrome os" || /cros/.test(ua)) return "unknown";
  if (hint === "macos" || /macintosh|mac os/.test(ua)) return "unknown";
  if (hint === "windows" || /windows/.test(ua)) return "windows";
  if (hint === "linux" || /linux/.test(ua)) return "linux";
  return "unknown";
}

export function resolvePlatformDownload(
  info: DeviceInfo,
  assets: DownloadAsset[],
  iosUrl: string,
) {
  const platform = detectPlatform(info);
  if (platform === "unknown") return "#downloads";
  if (platform === "ohos") return "#download-ohos";
  if (platform === "ios") return iosUrl || "#download-ios";
  const ua = info.userAgent.toLowerCase();
  let arch = "";
  if (info.architecture === "arm" && info.bitness === "64") arch = "arm64";
  else if (info.architecture === "arm" && info.bitness === "32") arch = "armv7";
  else if (info.architecture === "x86" && info.bitness === "64") arch = "x64";
  else if (info.architecture === "x86" && info.bitness === "32") arch = "x86";
  else if (!info.architecture) {
    if (/aarch64|arm64/.test(ua)) arch = "arm64";
    else if (/armv7|armv8l/.test(ua)) arch = "armv7";
    // Reduced Android UAs can report a generic Linux platform; never assume ARM64.
    else if (/x86_64|amd64|win64|wow64|x64/.test(ua)) arch = "x64";
    else if (/i[3-6]86/.test(ua)) arch = "x86";
  }
  const patterns: Record<string, RegExp> =
    platform === "android"
      ? {
          arm64: /app-arm64-v8a-release\.apk$/i,
          armv7: /app-armeabi-v7a-release\.apk$/i,
          x64: /app-x86_64-release\.apk$/i,
        }
      : {
          x64: new RegExp(`${platform}.*(?:amd64|x86_64|x64)\\.zip$`, "i"),
          arm64: new RegExp(`${platform}.*(?:arm64|aarch64)\\.zip$`, "i"),
        };
  const pattern = patterns[arch];
  return (
    (pattern &&
      assets.find((asset) => pattern.test(asset.name))?.browser_download_url) ||
    `#download-${platform}`
  );
}
