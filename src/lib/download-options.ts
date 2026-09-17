export type DownloadOption = { url: string; label: string };
export function getDownloadOptions(
  platform: { id: string; available: boolean; downloadUrl?: string },
  assets: readonly { name: string; browser_download_url: string }[],
  patterns: readonly { pattern: RegExp; displayName: string }[],
  fallbackUrl: string,
  label: string,
): DownloadOption[] {
  if (!platform.available) return [];
  // Store-based, independently maintained ports never inherit upstream assets.
  if (platform.downloadUrl) return [{ url: platform.downloadUrl, label }];
  const matches = patterns.flatMap((pattern) => {
    const asset = assets.find((asset) => pattern.pattern.test(asset.name));
    return asset
      ? [{ url: asset.browser_download_url, label: pattern.displayName }]
      : [];
  });
  return matches.length ? matches : [{ url: fallbackUrl, label }];
}
