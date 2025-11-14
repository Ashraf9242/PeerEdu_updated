
"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { getFilterData } from "../_actions/get-filter-data";
import { SearchParams } from "../_lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "./multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";

interface FiltersSidebarProps {
  searchParams: SearchParams;
  className?: string;
}

export function FiltersSidebar({ searchParams, className }: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

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

  const price = [
      searchParams.minPrice ? parseInt(searchParams.minPrice) : 5,
      searchParams.maxPrice ? parseInt(searchParams.maxPrice) : 50
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search by Name or Subject</Label>
          <Input
            id="search"
            placeholder="e.g., 'Physics' or 'Ahmed'"
            defaultValue={searchParams.q}
            onChange={(e) => handleDebouncedUpdate({ q: e.target.value })}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            value={searchParams.sort || 'rating'}
            onValueChange={(value) => handleUpdate({ sort: value })}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price">Lowest Price</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* University */}
        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Select
            value={searchParams.university}
            onValueChange={(value) => handleUpdate({ university: value === 'all' ? null : value })}
          >
            <SelectTrigger id="university">
              <SelectValue placeholder="All Universities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {filterData.universities.map((uni) => (
                <SelectItem key={uni} value={uni}>{uni}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subjects */}
        <div className="space-y-2">
          <Label>Subjects</Label>
          <MultiSelect
            options={filterData.subjects.map(s => ({ value: s, label: s }))}
            selected={searchParams.subjects?.split(',') || []}
            onChange={(selected) => handleUpdate({ subjects: selected.join(',') || null })}
            placeholder="Select subjects..."
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range ($/hr)</Label>
          <Slider
            min={5}
            max={50}
            step={1}
            defaultValue={price}
            onValueCommit={(value) => handleUpdate({ minPrice: String(value[0]), maxPrice: String(value[1]) })}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${price[0]}</span>
            <span>${price[1]}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <RadioGroup 
                defaultValue={searchParams.rating || 'all'}
                onValueChange={(value) => handleUpdate({ rating: value === 'all' ? null : value })}
                className="flex items-center gap-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="r1" />
                    <Label htmlFor="r1" className="flex items-center">4 <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400"/>+</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="r2" />
                    <Label htmlFor="r2" className="flex items-center">3 <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400"/>+</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="r3" />
                    <Label htmlFor="r3">All</Label>
                </div>
            </RadioGroup>
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
