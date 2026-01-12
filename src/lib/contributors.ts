/**
 * GitHub Contributors Types and API
 */

export type GitHubContributor = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
  email?: string;
  name?: string;
  user_view_type?: string;
};

/**
 * Fetch contributors from GitHub API
 * API Documentation: https://docs.github.com/en/rest/repos/repos#list-repository-contributors
 */
export async function fetchGitHubContributors(
  owner: string,
  repo: string,
  limit?: number
): Promise<GitHubContributor[]> {
  const perPage = limit && limit <= 100 ? limit : 100;
  const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${perPage}`;

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

    const contributors: GitHubContributor[] = await response.json();

    // Apply limit if specified
    if (limit && limit < contributors.length) {
      return contributors.slice(0, limit);
    }

    return contributors;
  } catch (error) {
    console.error("Error fetching GitHub contributors:", error);
    return [];
  }
}
