
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { FiltersSidebar } from "./filters-sidebar";
import { SearchParams } from "../_lib/types";
import { useLanguage } from "@/contexts/language-context";

interface MobileFiltersProps {
  searchParams: SearchParams;
}

export function MobileFilters({ searchParams }: MobileFiltersProps) {
    const activeFilterCount = Object.entries(searchParams).filter(
        ([key, value]) => key !== "page" && Boolean(value)
    ).length;
    const { t } = useLanguage();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden relative">
                    <Filter className="mr-2 h-4 w-4" />
                    {t("tutors.mobile.button")}
                    {activeFilterCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 rounded-full p-0 h-5 w-5 flex items-center justify-center">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{t("tutors.mobile.title")}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                    <FiltersSidebar searchParams={searchParams} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
