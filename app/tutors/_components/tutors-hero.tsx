"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function TutorsHero() {
  const { t } = useLanguage();

  return (
    <section className="space-y-4">
      <nav className="flex items-center justify-between rounded-2xl border bg-card/80 px-4 py-3 shadow-sm">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("tutors.nav.back")}</span>
        </Link>
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {t("tutors.nav.tagline")}
        </span>
      </nav>

      <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-background p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              <Compass className="h-3 w-3" />
              <span>{t("tutors.hero.badge")}</span>
            </div>
            <h1 className="font-serif text-3xl text-foreground md:text-4xl">{t("tutors.title")}</h1>
            <p className="text-base text-muted-foreground md:text-lg">
              {t("tutors.subtitle")}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-background/70 px-6 py-4 text-sm text-muted-foreground shadow-inner">
            <p className="font-medium text-foreground">{t("tutors.hero.hint")}</p>
            <p>{t("tutors.hero.hintDetail")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
