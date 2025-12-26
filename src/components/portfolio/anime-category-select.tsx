"use client";

import { ListFilter } from "lucide-react";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { CollectionType } from "@/lib/bangumi";

type CategoryOption = {
  key: CollectionType;
  label: string;
  count: number;
};

type AnimeCategorySelectProps = {
  categories: CategoryOption[];
  selectedCategory: CollectionType;
  onCategoryChange: (category: CollectionType) => void;
  compact?: boolean;
};

export function AnimeCategorySelect({
  categories,
  selectedCategory,
  onCategoryChange,
  compact = false,
}: AnimeCategorySelectProps) {
  const selectedCategoryData = categories.find(cat => cat.key === selectedCategory);
  
  if (compact) {
    return (
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-10 h-10 p-0 justify-center sm:w-auto sm:px-3 sm:justify-between [&>svg:last-child]:hidden sm:[&>svg:last-child]:block">
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {selectedCategoryData && (
                <span className="flex items-center gap-2">
                  <span>{selectedCategoryData.label}</span>
                  <span className="text-xs text-muted-foreground">
                    ({selectedCategoryData.count})
                  </span>
                </span>
              )}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.key} value={category.key}>
              <span className="flex items-center gap-2">
                <span>{category.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({category.count})
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-[200px] sm:w-[240px]">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4" />
          {selectedCategoryData && (
            <div className="flex items-center gap-2">
              <span>{selectedCategoryData.label}</span>
              <span className="text-xs text-muted-foreground">
                ({selectedCategoryData.count})
              </span>
            </div>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.key} value={category.key}>
            <span className="flex items-center gap-2">
              <span>{category.label}</span>
              <span className="text-xs text-muted-foreground">
                ({category.count})
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
