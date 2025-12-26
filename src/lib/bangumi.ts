// Bangumi API types and utilities

export interface BangumiImage {
  large: string;
  common: string;
  medium: string;
  small: string;
  grid: string;
}

export interface BangumiCollection {
  subject_id: number;
  subject_type: number;
  rate: number;
  type: number; // 1=wish, 2=watched, 3=watching, 4=on-hold, 5=dropped
  comment: string;
  tags: string[];
  ep_status: number;
  vol_status: number;
  updated_at: string;
  private: boolean;
  subject: {
    id: number;
    type: number;
    name: string;
    name_cn: string;
    summary: string;
    date: string;
    images: BangumiImage;
    infobox: Array<{
      key: string;
      value: string | { v: string }[];
    }>;
    rating: {
      total: number;
      count: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        10: number;
      };
      score: number;
    };
    total_episodes: number;
    tags: Array<{
      name: string;
      count: number;
    }>;
  };
}

export interface BangumiCollectionResponse {
  total: number;
  limit: number;
  offset: number;
  data: BangumiCollection[];
}

const BANGUMI_API_BASE = "https://api.bgm.tv";

export async function getBangumiCollections(
  username: string,
  type: number = 3 // 3 = watching
): Promise<BangumiCollection[]> {
  try {
    const response = await fetch(
      `${BANGUMI_API_BASE}/v0/users/${username}/collections?subject_type=2&type=${type}&limit=100`,
      {
        headers: {
          "User-Agent": "zhengzangw/nextjs-portfolio (https://github.com/zhengzangw/nextjs-portfolio)",
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Bangumi API error: ${response.status}`);
    }

    const data: BangumiCollectionResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Bangumi collections:", error);
    return [];
  }
}

export type CollectionType = 'all' | 'watching' | 'watched' | 'wish' | 'onHold' | 'dropped';

export const COLLECTION_TYPE_MAP: Record<number, CollectionType> = {
  1: 'wish',
  2: 'watched',
  3: 'watching',
  4: 'onHold',
  5: 'dropped',
};

export function getCollectionTypeLabel(type: number, locale: "en" | "zh") {
  const labels = {
    1: { en: "Want to Watch", zh: "想看" },
    2: { en: "Watched", zh: "看过" },
    3: { en: "Watching", zh: "在看" },
    4: { en: "On Hold", zh: "搁置" },
    5: { en: "Dropped", zh: "抛弃" },
  };
  return labels[type as keyof typeof labels]?.[locale] || "Unknown";
}
