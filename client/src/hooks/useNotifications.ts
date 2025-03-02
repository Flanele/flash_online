import { useState, useEffect, useCallback } from "react";
import { useFetchNotificationsQuery, useMarkAsSeenMutation } from "../store/services/notificationApi";
import { ApiNotification } from "../store/services/notificationApi";

 const useNotifications = () => {
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);
    const { data: notifications, isLoading: isNotifLoading, error } = useFetchNotificationsQuery();
    const [markAsSeen] = useMarkAsSeenMutation();

    useEffect(() => {
        if (notifications) {
            const unread = notifications.filter((notif) => !notif.seen).length;
            setUnreadNotifCount(unread);
        }
    }, [notifications]);

    const markAllAsSeen = useCallback(async () => {
        if (notifications) {
            const unseenNotifications = notifications.filter((notif) => !notif.seen);
            await Promise.all(
                unseenNotifications.map((notif) => markAsSeen({ id: notif.id }).unwrap())
            );
            setUnreadNotifCount(0);
        }
    }, [notifications, markAsSeen]);

    return {
        notifications: notifications as ApiNotification[],
        unreadNotifCount,
        isNotifLoading,
        error,
        markAllAsSeen,
    };
};

export default useNotifications;
