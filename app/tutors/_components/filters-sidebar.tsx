"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchParams } from "../_lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { UNIVERSITY_NAME_TO_VALUE, UNIVERSITY_OPTIONS } from "@/lib/universities";

interface FiltersSidebarProps {
  searchParams: SearchParams;
  className?: string;
}

export function FiltersSidebar({ searchParams, className }: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const { t } = useLanguage();

  const rawUniversity = searchParams.university?.trim();
  const normalizedUniversityValue = (() => {
    if (!rawUniversity) return "all";
    if (UNIVERSITY_OPTIONS.some((option) => option.value === rawUniversity)) {
      return rawUniversity;
    }
    return (
      UNIVERSITY_NAME_TO_VALUE[rawUniversity] ??
      UNIVERSITY_NAME_TO_VALUE[rawUniversity.toLowerCase()] ??
      "all"
    );
  })();

  const createQueryString = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");
    return params.toString();
  };

  const handleUpdate = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(updates)}`);
    });
  };

  const handleDebouncedUpdate = useDebouncedCallback(
    (updates: Record<string, string | null>) => {
      handleUpdate(
        Object.entries(updates).reduce<Record<string, string | null>>((acc, [key, value]) => {
          if (typeof value === "string") {
            const trimmed = value.trim();
            acc[key] = trimmed.length ? trimmed : null;
          } else {
            acc[key] = value;
          }
          return acc;
        }, {}),
      );
    },
    400,
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("tutors.filters.title")}</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutors.filters.description")}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="university">{t("tutors.filters.university")}</Label>
          <Select
            value={normalizedUniversityValue}
            onValueChange={(value) => handleUpdate({ university: value === "all" ? null : value })}
          >
            <SelectTrigger id="university">
              <SelectValue placeholder={t("tutors.filters.university.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("tutors.filters.university.placeholder")}</SelectItem>
              {UNIVERSITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subjectCode">{t("tutors.filters.subjectCode")}</Label>
          <Input
            id="subjectCode"
            placeholder={t("tutors.filters.subjectCode.placeholder")}
            defaultValue={searchParams.subjectCode || ""}
            onChange={(event) => handleDebouncedUpdate({ subjectCode: event.target.value.toUpperCase() })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="subjectName">{t("tutors.filters.subjectName")}</Label>
            <span className="text-xs text-muted-foreground">{t("tutors.filters.optional")}</span>
          </div>
          <Input
            id="subjectName"
            placeholder={t("tutors.filters.subjectName.placeholder")}
            defaultValue={searchParams.subjectName || ""}
            onChange={(event) => handleDebouncedUpdate({ subjectName: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="teacherName">{t("tutors.filters.teacherName")}</Label>
            <span className="text-xs text-muted-foreground">{t("tutors.filters.optional")}</span>
          </div>
          <Input
            id="teacherName"
            placeholder={t("tutors.filters.teacherName.placeholder")}
            defaultValue={searchParams.teacherName || ""}
            onChange={(event) => handleDebouncedUpdate({ teacherName: event.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
