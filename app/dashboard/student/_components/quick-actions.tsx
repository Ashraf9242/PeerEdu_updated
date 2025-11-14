
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Search, LayoutGrid } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/tutors">
                <Search className="mr-2 h-4 w-4" />
                Find a Tutor
            </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/dashboard/student/bookings">
                <LayoutGrid className="mr-2 h-4 w-4" />
                View All Sessions
            </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
