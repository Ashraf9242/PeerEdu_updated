"use client";

import useSWR from "swr";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: NotificationItem[];
  currentPage: number;
  totalPages: number;
  unreadCount: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useNotifications(page = 1, limit = 5, read?: boolean) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (typeof read === "boolean") {
    params.set("read", String(read));
  }

  const endpoint = `/api/notifications?${params.toString()}`;

  const { data, error, mutate } = useSWR<NotificationsResponse>(endpoint, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });

      if (response.ok) {
        mutate();
      } else {
        toast.error("Failed to mark as read");
      }
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PUT",
      });

      if (response.ok) {
        mutate();
        toast.success("All marked as read");
      } else {
        toast.error("Failed to mark all as read");
      }
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
        toast.success("Notification deleted");
      } else {
        toast.error("Failed to delete notification");
      }
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    totalPages: data?.totalPages ?? 1,
    currentPage: data?.currentPage ?? page,
    isLoading: !error && !data,
    isError: error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    mutate,
  };
}
