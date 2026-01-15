/**
 * GitHub Release Types
 */

export type GitHubRelease = {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
  zipball_url: string;
  tarball_url: string;
};

export type GitHubAsset = {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  content_type: string;
  digest?: string;
  checksum?: string;
};

/**
 * Fetch releases from GitHub API
 * API Documentation: https://docs.github.com/en/rest/releases/releases
 */
export async function fetchGitHubReleases(
  owner: string,
  repo: string,
  perPage: number = 5,
): Promise<GitHubRelease[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${perPage}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return [];
    }

    const releases: GitHubRelease[] = await response.json();

    // Parse checksums from release assets and bodies
    return releases.map(release => ({
      ...release,
      assets: parseChecksumsFromAssetsAndBody(release.body, release.assets)
    }));
  } catch (error) {
    console.error("Error fetching GitHub releases:", error);
    return [];
  }
}

/**
 * Fetch latest release from GitHub API
 */
export async function fetchLatestRelease(
  owner: string,
  repo: string,
): Promise<GitHubRelease | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return null;
    }

    const release: GitHubRelease = await response.json();

    // Parse checksums from release assets and body
    return {
      ...release,
      assets: parseChecksumsFromAssetsAndBody(release.body, release.assets)
    };
  } catch (error) {
    console.error("Error fetching latest GitHub release:", error);
    return null;
  }
}

/**
 * Parse checksums from release assets (digest field) and body (as fallback)
 */
export function parseChecksumsFromAssetsAndBody(body: string, assets: GitHubAsset[]): GitHubAsset[] {
  return assets.map(asset => {
    let checksum = undefined;

    // First, try to extract from digest field (GitHub API provides this)
    if (asset.digest) {
      // Format: "sha256:actual_checksum"
      const digestMatch = asset.digest.match(/^sha256:([a-fA-F0-9]{64})$/i);
      if (digestMatch) {
        checksum = digestMatch[1];
      }
    }

    // If no digest checksum found, try to parse from body as fallback
    if (!checksum && body) {
      const checksums: Record<string, string> = {};

      // Parse various checksum formats from body
      const lines = body.split('\n');

      for (const line of lines) {
        // Format: filename: checksum
        const colonMatch = line.match(/^[\s]*([^\s:]+)[\s]*:[\s]*([a-fA-F0-9]{32,128})[\s]*$/);
        if (colonMatch) {
          const [, filename, fileChecksum] = colonMatch;
          checksums[filename] = fileChecksum;
          continue;
        }

        // Format: - SHA256: `checksum` for filename
        const sha256Match = line.match(/SHA256:[\s]*`([a-fA-F0-9]{64})`[\s]*for[\s]*([^\s]+)/i);
        if (sha256Match) {
          const [, fileChecksum, filename] = sha256Match;
          checksums[filename] = fileChecksum;
          continue;
        }

        // Format: - MD5: `checksum` for filename
        const md5Match = line.match(/MD5:[\s]*`([a-fA-F0-9]{32})`[\s]*for[\s]*([^\s]+)/i);
        if (md5Match) {
          const [, fileChecksum, filename] = md5Match;
          checksums[filename] = fileChecksum;
          continue;
        }

        // Format: filename checksum
        const spaceMatch = line.match(/^[\s]*([^\s]+)[\s]+([a-fA-F0-9]{32,128})[\s]*$/);
        if (spaceMatch) {
          const [, filename, fileChecksum] = spaceMatch;
          checksums[filename] = fileChecksum;
          continue;
        }
      }

      checksum = checksums[asset.name];
    }

    return {
      ...asset,
      checksum
    };
  });
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format date to readable format
 */
export function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * GitHub Commit Types
 */
export type GitHubCommit = {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  html_url: string;
};

/**
 * Fetch last commit info for a specific file
 * API Documentation: https://docs.github.com/en/rest/commits/commits
 */
export async function fetchFileLastCommit(
  owner: string,
  repo: string,
  filePath: string,
  branch: string = "master",
): Promise<GitHubCommit | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}&page=1&per_page=1&sha=${branch}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return null;
    }

    const commits: GitHubCommit[] = await response.json();
    
    if (commits.length === 0) {
      return null;
    }

    return commits[0];
  } catch (error) {
    console.error(`Error fetching last commit for ${filePath}:`, error);
    return null;
  }
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string, locale: string = "zh-CN"): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
  }
}
