
import { requireAuth } from "@/auth-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfileForm } from "./_components/user-profile-form";
import { ChangePasswordForm } from "./_components/change-password-form";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const user = await requireAuth();

  // Fetch full user data from the database
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    // This case should ideally not happen if requireAuth works correctly
    redirect("/login");
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  const displayName =
    dbUser.name ||
    [dbUser.firstName, dbUser.familyName].filter(Boolean).join(" ") ||
    dbUser.email;

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={dbUser.image ?? undefined} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <CardTitle>{displayName}</CardTitle>
              <CardDescription>
                <Badge variant="outline">{dbUser.role}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="space-y-2">
                <p><span className="font-semibold">Email:</span> {dbUser.email}</p>
                <p><span className="font-semibold">University:</span> {dbUser.university || 'Not set'}</p>
                <p><span className="font-semibold">Year:</span> {dbUser.academicYear || 'Not set'}</p>
                {dbUser.role === 'TEACHER' && (
                  <Button asChild className="w-full mt-4">
                    <Link href="/profile/teacher">Manage Teacher Profile</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Edit Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserProfileForm user={dbUser} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Make sure to use a strong password.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
