
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, User, LayoutGrid } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/profile/teacher">
                <User className="mr-2 h-4 w-4" />
                Manage Profile
            </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/profile/teacher/availability">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Availability
            </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/dashboard/teacher/sessions">
                <LayoutGrid className="mr-2 h-4 w-4" />
                View All Sessions
            </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/dashboard/teacher/analytics">
                <BarChart2 className="mr-2 h-4 w-4" />
                Detailed Analytics
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
