
"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { getFilterData } from "../_actions/get-filter-data";
import { SearchParams } from "../_lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "./multi-select";

interface FiltersSidebarProps {
  searchParams: SearchParams;
  className?: string;
}

export function FiltersSidebar({ searchParams, className }: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [filterData, setFilterData] = useState<{ universities: string[]; subjects: string[] }>({
    universities: [],
    subjects: [],
  });

  useEffect(() => {
    getFilterData().then(setFilterData);
  }, []);

  const createQueryString = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset page on filter change
    params.delete("page");
    return params.toString();
  };

  const handleUpdate = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(updates)}`);
    });
  };

  const handleDebouncedUpdate = useDebouncedCallback(handleUpdate, 500);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Refine Tutors</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Start with your college or university, then narrow in by subject code.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* University */}
        <div className="space-y-2">
          <Label htmlFor="university">College / University</Label>
          <Select
            value={searchParams.university}
            onValueChange={(value) => handleUpdate({ university: value === "all" ? null : value })}
          >
            <SelectTrigger id="university">
              <SelectValue placeholder="All institutions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All institutions</SelectItem>
              {filterData.universities.map((uni) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            We verify every tutor with their university before they go live.
          </p>
        </div>

        {/* Subjects */}
        <div className="space-y-2">
          <Label>Subject code</Label>
          <MultiSelect
            options={filterData.subjects.map((s) => ({ value: s, label: s }))}
            selected={searchParams.subjects?.split(",") || []}
            onChange={(selected) => handleUpdate({ subjects: selected.join(",") || null })}
            placeholder="e.g., MATH210, BUSN101…"
          />
          <p className="text-xs text-muted-foreground">
            Add one or more codes to see tutors who teach them.
          </p>
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search tutors</Label>
          <Input
            id="search"
            placeholder="Try a tutor name or keyword"
            defaultValue={searchParams.q}
            onChange={(e) => handleDebouncedUpdate({ q: e.target.value })}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort results</Label>
          <Select
            value={searchParams.sort || "rating"}
            onValueChange={(value) => handleUpdate({ sort: value })}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Best match</SelectItem>
              <SelectItem value="price">Lowest hourly rate</SelectItem>
              <SelectItem value="experience">Most experienced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push(pathname)}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
