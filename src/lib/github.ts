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
    return releases;
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
    return release;
  } catch (error) {
    console.error("Error fetching latest GitHub release:", error);
    return null;
  }
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
