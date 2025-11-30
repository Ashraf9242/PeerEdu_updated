
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { FiltersSidebar } from "./filters-sidebar";
import { SearchParams } from "../_lib/types";

interface MobileFiltersProps {
  searchParams: SearchParams;
}

export function MobileFilters({ searchParams }: MobileFiltersProps) {
    const activeFilterCount = Object.values(searchParams).filter(Boolean).length;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden relative">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 rounded-full p-0 h-5 w-5 flex items-center justify-center">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter Tutors</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                    <FiltersSidebar searchParams={searchParams} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
