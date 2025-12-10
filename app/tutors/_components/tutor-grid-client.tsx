"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/language-context";
import { TutorsWithProfile } from "../_actions/get-tutors";
import { PaginationControls } from "./pagination-controls";
import { TutorCard } from "./tutor-card";
import { Terminal } from "lucide-react";

interface TutorGridClientProps {
  tutors: TutorsWithProfile;
  totalTutors: number;
  currentPage: number;
  totalPages: number;
  error?: string;
}

export function TutorGridClient({
  tutors,
  totalTutors,
  currentPage,
  totalPages,
  error,
}: TutorGridClientProps) {
  const { t } = useLanguage();

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>{t("tutors.results.error.title")}</AlertTitle>
        <AlertDescription>{t("tutors.results.error.description")}</AlertDescription>
      </Alert>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-muted bg-card/40 p-10 text-center">
        <h3 className="text-2xl font-semibold text-foreground">{t("tutors.results.empty.title")}</h3>
        <p className="mt-2 text-muted-foreground">{t("tutors.results.empty.description")}</p>
      </div>
    );
  }

  const from = (currentPage - 1) * 12 + 1;
  const to = Math.min(currentPage * 12, totalTutors);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          {t("tutors.results.showing")} {from}-{to} {t("tutors.results.of")} {totalTutors} {t("tutors.results.tutors")}
        </p>
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
