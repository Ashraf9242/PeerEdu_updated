
"use client";

import { useState } from "react";
import { useNotifications, type NotificationItem as NotificationRecord } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NotificationRowProps {
  notification: NotificationRecord;
  onMarkRead: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

function NotificationRow({ notification, onMarkRead, onDelete }: NotificationRowProps) {
  const router = useRouter();

  const handleItemClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-accent">
      <div
        className="flex-grow cursor-pointer"
        onClick={handleItemClick}
      >
        <div className="flex items-center">
          {notification.read ? (
            <MailOpen className="h-5 w-5 text-muted-foreground mr-4" />
          ) : (
            <Mail className="h-5 w-5 text-primary mr-4" />
          )}
          <div>
            <p
              className={cn(
                "font-semibold",
                !notification.read && "text-primary"
              )}
            >
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(notification.createdAt), "PPP p")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(notification.id)}
            title="Mark as read"
          >
            Mark Read
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600"
          onClick={() => onDelete(notification.id)}
          title="Delete notification"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [tab, setTab] = useState("all"); // 'all' or 'unread'
  const readFilter = tab === "unread" ? false : undefined;

  const {
    notifications,
    isLoading,
    isError,
    markAsRead,
    deleteNotification,
    mutate,
  } = useNotifications(1, 50, readFilter); // Fetch up to 50 notifications

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    mutate(); // Revalidate data
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    mutate(); // Revalidate data
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Failed to load notifications.</p>}
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-center py-12 text-muted-foreground">
              You have no notifications.
            </p>
          )}
        </TabsContent>
        <TabsContent value="unread">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Failed to load notifications.</p>}
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-center py-12 text-muted-foreground">
              You have no unread notifications.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
