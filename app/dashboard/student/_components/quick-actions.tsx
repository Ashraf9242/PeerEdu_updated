"use client";

import Link from "next/link";
import { MessageSquare, Search, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export function QuickActions() {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.student.actions.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/tutors">
            <Search className="mr-2 h-4 w-4" />
            {t("dashboard.student.actions.findTutor")}
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/dashboard/student/bookings">
            <LayoutGrid className="mr-2 h-4 w-4" />
            {t("dashboard.student.actions.viewSessions")}
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("dashboard.student.actions.messages")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
