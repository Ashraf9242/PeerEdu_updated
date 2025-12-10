"use client";

import { useLanguage } from "@/contexts/language-context";
import { SearchParams } from "../_lib/types";
import { MobileFilters } from "./mobile-filters";

interface TutorsResultsHeaderProps {
  searchParams: SearchParams;
}

export function TutorsResultsHeader({ searchParams }: TutorsResultsHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card/70 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          {t("tutors.results.preheading")}
        </p>
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{t("tutors.results.heading")}</h2>
        <p className="text-sm text-muted-foreground">{t("tutors.results.caption")}</p>
      </div>
      <MobileFilters searchParams={searchParams} />
    </div>
  );
}
