
"use client";

import Link from "next/link";
import { MessageSquare, Search, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export function QuickActions() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isArabic ? "إجراءات سريعة" : "Quick Actions"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/tutors">
            <Search className="mr-2 h-4 w-4" />
            {isArabic ? "ابحث عن معلم" : "Find a Tutor"}
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/dashboard/student/bookings">
            <LayoutGrid className="mr-2 h-4 w-4" />
            {isArabic ? "عرض كل الجلسات" : "View All Sessions"}
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
          <Link href="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            {isArabic ? "الرسائل" : "Messages"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
