"use client";

import useSWR from "swr";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useNotifications() {
  const { data, error, mutate } = useSWR(
    "/api/notifications?limit=5",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        { method: "PUT" }
      );

      if (response.ok) {
        mutate(); // Refresh data
      } else {
        toast.error("Failed to mark as read");
      }
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading: !error && !data,
    isError: error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: mutate,
  };
}