export function AddIcon() {
    return <span className="icon-[line-md--plus]"style={{color: "#fff"}}></span>
}

import { useQuery, useMutation, useQueryClient } from "react-query";
import { getNotifications, markNotifsAsRead } from "../../../utils/api/api";
import { useAppStore } from "../../../app/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export function NotificationsTable() {
    const queryClient = useQueryClient();
    const pushToast = useAppStore.use.pushToast();
    const navigate = useNavigate()

    // Fetch notifications
    const { data: notifications = [], isLoading } = useQuery(
        'notifications',
        getNotifications,
        {
            refetchInterval: 30000, // Refetch every 30 seconds
        }
    );

    // Mark as read mutation
    const { mutate: markAsRead } = useMutation(
        (notifId) => markNotifsAsRead(notifId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('notifications');
            },
            onError: (error) => {
                pushToast({
                    message: error?.response?.data?.message || "Erreur lors du marquage de la notification",
                    type: "error"
                });
            }
        }
    );

    function handleNavigate( plantId) {
        navigate(`/details/${plantId}`)
    }

    function handleReadClick(event, notifId) {
        markAsRead(notifId)
    }

    if (isLoading) {
        return <div className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-72 p-4 shadow">
            <span className="loading loading-spinner loading-sm"></span>
        </div>;
    }

    if (notifications.length === 0) {
        return <div className="menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-72 p-4 shadow">
            <p className="text-sm text-gray-500">Aucune notification</p>
        </div>;
    }

    return <ul
            tabIndex={0}
            className="menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-72 p-2 shadow max-h-96 overflow-y-auto cursor-pointer"
        >
        {notifications.map((notif) => (
            <li key={notif.id}>
                <div
                    className="flex flex-col py-2 px-1"
                    onClick={() => handleNavigate(notif.plantId)}
                >
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-sm flex-1">{notif.message}</p>
                        <button 
                            onClick={(event) => handleReadClick(event, notif.id)}
                            className="badge badge-primary badge-sm cursor-pointer hover:badge-secondary"
                        >
                            marquer lu
                        </button>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                        {format(new Date(notif.createdAt), "dd MMM yyyy HH:mm", { locale: fr })}
                    </span>
                </div>
            </li>
        ))}
    </ul>
}