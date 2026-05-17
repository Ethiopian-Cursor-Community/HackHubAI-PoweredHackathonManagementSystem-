import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listNotifications, markNotificationRead } from "../services/notificationsApi";
import { useNotificationStore } from "../store/notificationStore";
import { useEffect } from "react";

export function useNotifications() {
  const { setNotifications, notifications, unreadCount, markRead, markAllRead } =
    useNotificationStore();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    onSuccess: (data) => {
      if (data?.length) setNotifications(data);
    },
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_, id) => {
      markRead(id);
    },
  });

  return {
    notifications,
    unreadCount,
    markRead: markReadMutation.mutate,
    markAllRead,
    isLoading: query.isLoading,
  };
}