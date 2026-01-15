"use client";

import { useMemo, useState } from "react";

/**
 * 通用的搜索过滤 Hook
 * 
 * @template T 数据项类型
 * @param items 要搜索的数据列表
 * @param searchableFields 可搜索的字段名数组
 * @returns 搜索词状态、更新函数、过滤后的结果
 * 
 * @example
 * ```tsx
 * const { searchTerm, setSearchTerm, filteredItems } = useSearch(
 *   posts,
 *   ['title', 'excerpt', 'tags']
 * );
 * ```
 */
export function useSearch<T extends Record<string, unknown>>(
  items: T[],
  searchableFields: (keyof T)[],
) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const searchLower = searchTerm.toLowerCase();

    return items.filter((item) => {
      return searchableFields.some((field) => {
        const value = item[field];

        // 处理字符串
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchLower);
        }

        // 处理数组（如 tags）
        if (Array.isArray(value)) {
          return value.some((v) =>
            String(v).toLowerCase().includes(searchLower),
          );
        }

        // 其他类型转为字符串搜索
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [items, searchTerm, searchableFields]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}

/**
 * 带标签过滤的搜索 Hook
 * 
 * @template T 数据项类型（必须包含 tags 字段）
 * @param items 要搜索的数据列表
 * @param searchableFields 可搜索的字段名数组
 * @returns 搜索词状态、选中标签、更新函数、过滤后的结果
 */
export function useSearchWithTags<T extends Record<string, unknown> & { tags: string[] }>(
  items: T[],
  searchableFields: (keyof T)[],
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 提取所有唯一标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;

    // 标签过滤
    if (selectedTags.length > 0) {
      result = result.filter((item) =>
        selectedTags.every((tag) => item.tags.includes(tag)),
      );
    }

    // 文本搜索
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return searchableFields.some((field) => {
          const value = item[field];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchLower);
          }
          if (Array.isArray(value)) {
            return value.some((v) =>
              String(v).toLowerCase().includes(searchLower),
            );
          }
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    return result;
  }, [items, searchTerm, selectedTags, searchableFields]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedTags,
    toggleTag,
    allTags,
    filteredItems,
  };
}
