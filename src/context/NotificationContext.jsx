import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
    createNotification,
    markNotificationAsRead,
    deleteNotification,
    fetchNotifications,
} from "../api/notificationApi";

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    // Fonction pour ajouter une nouvelle notification
    const addNotification = async (notification) => {
        try {
            await createNotification(notification);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la notification:", error);
        }
    };

    // Fonction pour marquer une notification comme lue
    const markAsRead = async (notificationId) => {
        try {
            const response = await markNotificationAsRead(notificationId);
            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif._id === notificationId
                            ? { ...notif, read: true }
                            : notif
                    )
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la mise à jour de la notification:",
                error
            );
        }
    };

    // Fonction pour supprimer une notification
    const removeNotification = async (notificationId) => {
        try {
            const response = await deleteNotification(notificationId);
            if (response.ok) {
                setNotifications((prev) =>
                    prev.filter((notif) => notif._id !== notificationId)
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de la notification:",
                error
            );
        }
    };

    // Fonction pour récupérer les notifications non lues
    const getUnreadCount = () => {
        return Array.isArray(notifications) 
            ? notifications.filter((notif) => !notif.read).length 
            : 0;
    };

    // Effet pour vérifier les nouvelles notifications périodiquement
    useEffect(() => {
        if (!user) return;

        const checkNewNotifications = async () => {
            try {
                const newNotifications = await fetchNotifications();
                setNotifications(Array.isArray(newNotifications) ? newNotifications : []);
            } catch (error) {
                console.error(
                    "Erreur lors de la vérification des notifications:",
                    error
                );
                // Garantir que notifications reste toujours un tableau
                setNotifications([]);
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkNewNotifications();
            }
        };

        // Vérifier immédiatement au montage
        checkNewNotifications();
        // Vérifier toutes les 30 secondes si la page est visible
        const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
                checkNewNotifications();
            }
        }, 30000);

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [user]);

    const value = {
        notifications,
        addNotification,
        markAsRead,
        removeNotification,
        getUnreadCount,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
