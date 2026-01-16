"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSearchWithTags } from "@/lib/hooks/useSearch";
import { NewsPost } from "@/lib/news";

// DateRangePicker 组件
function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (startDate) return new Date(startDate);
    if (endDate) return new Date(endDate);
    return new Date();
  });

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateForInput = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const getDateRange = () => {
    if (!startDate || !endDate) return { min: 0, max: 0 };
    return {
      min: Math.min(new Date(startDate).getTime(), new Date(endDate).getTime()),
      max: Math.max(new Date(startDate).getTime(), new Date(endDate).getTime()),
    };
  };

  const dateRange = getDateRange();
  const isInRange = (day: number) => {
    if (!dateRange.min) return false;
    const dateTime = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    ).getTime();
    return dateTime >= dateRange.min && dateTime <= dateRange.max;
  };

  const isStartDate = (day: number) => {
    const dateStr = formatDateForInput(day);
    return dateStr === startDate || dateStr === endDate;
  };

  const handleDayClick = (day: number) => {
    const dateStr = formatDateForInput(day);
    if (!startDate) {
      onStartDateChange(dateStr);
    } else if (!endDate) {
      if (dateStr === startDate) {
        onStartDateChange("");
      } else if (new Date(dateStr) < new Date(startDate)) {
        onStartDateChange(dateStr);
        onEndDateChange(startDate);
      } else {
        onEndDateChange(dateStr);
      }
    } else {
      if (dateStr === startDate) {
        onStartDateChange("");
      } else if (dateStr === endDate) {
        onEndDateChange("");
      } else if (new Date(dateStr) < new Date(startDate)) {
        onStartDateChange(dateStr);
      } else if (new Date(dateStr) > new Date(endDate)) {
        onEndDateChange(dateStr);
      } else {
        onStartDateChange(dateStr);
        onEndDateChange("");
      }
    }
  };

  const monthDays: (number | null)[] = [];
  const firstDay = firstDayOfMonth(currentMonth);
  const days = daysInMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    monthDays.push(null);
  }
  for (let i = 1; i <= days; i++) {
    monthDays.push(i);
  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="hover:bg-muted rounded-lg p-2 transition-colors sm:p-1"
          type="button"
          aria-label="Previous month"
        >
          <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-base font-semibold sm:text-sm">{monthName}</div>
        <button
          onClick={nextMonth}
          className="hover:bg-muted rounded-lg p-2 transition-colors sm:p-1"
          type="button"
          aria-label="Next month"
        >
          <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground sm:gap-0.5 sm:text-xs">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-0.5">
        {monthDays.map((day, idx) =>
          day === null ? (
            <div key={`empty-${idx}`} />
          ) : (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded text-sm font-medium transition-colors sm:text-xs ${
                isStartDate(day)
                  ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                  : isInRange(day)
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "hover:bg-muted active:bg-muted/50"
              }`}
              type="button"
            >
              {day}
            </button>
          ),
        )}
      </div>

      {/* Date Input Fields */}
      <div className="space-y-3 sm:space-y-2">
        <div className="flex gap-2 text-xs sm:text-xs">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-muted-foreground sm:mb-1 sm:text-xs">
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2 sm:py-1.5 sm:text-xs"
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-muted-foreground sm:mb-1 sm:text-xs">
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2 sm:py-1.5 sm:text-xs"
            />
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {(startDate || endDate) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 w-full text-sm font-medium sm:h-8 sm:text-xs"
        >
          Clear
        </Button>
      )}
    </div>
  );
}

type NewsListClientProps = {
  posts: NewsPost[];
  locale: string;
  dict: {
    search: string;
    searchTags: string;
    filterByTags: string;
    filterByDate: string;
    readMore: string;
    noNews: string;
    by: string;
    publishedOn: string;
  };
  delay?: number;
};

export default function NewsListClient({
  posts,
  locale,
  dict,
  delay = 0,
}: NewsListClientProps) {
  const { searchTerm, setSearchTerm, selectedTags, toggleTag, allTags, filteredItems: postsAfterTagFilter } = useSearchWithTags(
    posts,
    ["title", "excerpt"],
  );

  // 日期范围筛选
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [tagSearchTerm, setTagSearchTerm] = useState<string>("");

  // 过滤标签搜索
  const filteredTags = useMemo(() => {
    if (!tagSearchTerm.trim()) return allTags;
    return allTags.filter((tag) =>
      tag.toLowerCase().includes(tagSearchTerm.toLowerCase()),
    );
  }, [allTags, tagSearchTerm]);

  // 应用日期范围过滤
  const filteredPosts = useMemo(() => {
    let result = postsAfterTagFilter;

    // 按日期范围过滤
    if (startDate || endDate) {
      result = result.filter((post) => {
        const postDate = new Date(post.date).getTime();
        const start = startDate ? new Date(startDate).getTime() : 0;
        const end = endDate
          ? new Date(endDate).getTime() + 86400000 // 加1天以包含整个结束日期
          : Number.MAX_SAFE_INTEGER;
        return postDate >= start && postDate <= end;
      });
    }

    return result;
  }, [postsAfterTagFilter, startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Buttons */}
      <BlurFade delay={delay}>
        <div className="flex h-10 gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={dict.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-full w-full rounded-lg border px-4 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </div>

          {/* Tag Filter Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10"
                title={dict.filterByTags}
              >
                <Icons.tag className="h-4 w-4" />
                {selectedTags.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {selectedTags.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 p-0"
              align="end"
            >
              <div className="p-2">
                <input
                  type="text"
                  placeholder={dict.searchTags}
                  value={tagSearchTerm}
                  onChange={(e) => setTagSearchTerm(e.target.value)}
                  className="border-input bg-background placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredTags.length === 0 ? (
                  <div className="text-muted-foreground p-4 text-center text-sm">
                    No tags found
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredTags.map((tag) => (
                      <div
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        <div
                          className={`mr-2 flex h-4 w-4 items-center justify-center rounded border-2 transition-all ${
                            selectedTags.includes(tag)
                              ? "border-primary bg-primary"
                              : "border-border bg-background"
                          }`}
                        >
                          {selectedTags.includes(tag) && (
                            <svg
                              className="h-3 w-3 text-primary-foreground"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className={selectedTags.includes(tag) ? "font-medium" : ""}>
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Range Filter Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10"
                title={dict.filterByDate}
              >
                <Icons.calendar className="h-4 w-4" />
                {(startDate || endDate) && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    1
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="end"
            >
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onClear={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </BlurFade>

      {/* News Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, idx) => (
            <BlurFade key={post.slug} delay={delay + 0.1 + idx * 0.05}>
              <Link href={`/news/${post.slug}?lang=${locale}`}>
                <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <div className="text-muted-foreground text-xs">
                      {dict.by} {post.author} • {dict.publishedOn} {post.date}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="line-clamp-3 flex-grow">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            </BlurFade>
          ))}
        </div>
      ) : (
        <BlurFade delay={delay + 0.1}>
          <Card>
            <CardContent className="flex min-h-[200px] items-center justify-center p-8">
              <p className="text-muted-foreground">{dict.noNews}</p>
            </CardContent>
          </Card>
        </BlurFade>
      )}
    </div>
  );
}
