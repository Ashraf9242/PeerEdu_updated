import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserRole } from "@prisma/client"

type RecentUser = {
  id: string
  name: string | null
  email: string
  role: UserRole
  createdAt: Date
}

interface RecentUsersProps {
  users: RecentUser[]
}

export function RecentUsers({ users }: RecentUsersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>The last 10 users who signed up.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
              <AvatarFallback>{user.name?.[0].toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{user.name || "Unnamed User"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="ml-auto font-medium">
              <Badge variant={user.role === UserRole.ADMIN ? "destructive" : "outline"}>
                {user.role}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
