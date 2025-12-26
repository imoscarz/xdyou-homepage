"use client";

import { Check, Filter,X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AnimeTagSelectProps = {
  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder: string;
  emptyText: string;
  searchPlaceholder: string;
  compact?: boolean;
};

export function AnimeTagSelect({
  tags,
  selectedTags,
  onTagsChange,
  placeholder,
  emptyText,
  searchPlaceholder,
  compact = false,
}: AnimeTagSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleToggle = (tag: string) => {
    const newSelected = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newSelected);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTagsChange([]);
    setOpen(false);
  };

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buttonClassName = compact
    ? "w-10 h-10 p-0 sm:w-auto sm:px-3 !bg-background"
    : "w-full sm:w-[300px] !bg-background";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={buttonClassName}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="h-4 w-4 shrink-0" />
            {selectedTags.length > 0 ? (
              <>
                <span className="hidden sm:inline text-xs text-muted-foreground shrink-0">
                  {selectedTags.length}
                </span>
                <div className="hidden sm:flex flex-wrap gap-1 flex-1 min-w-0">
                  {selectedTags.slice(0, 1).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {selectedTags.length > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedTags.length - 1}
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <span className="hidden sm:inline truncate">{placeholder}</span>
            )}
          </div>
          {selectedTags.length > 0 && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              className="hidden sm:flex ml-2 shrink-0 items-center rounded-sm opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex flex-col">
          <div className="flex items-center border-b px-3">
            <Filter className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredTags.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <div
                    key={tag}
                    onClick={() => handleToggle(tag)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                    <span className="flex-1">{tag}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

