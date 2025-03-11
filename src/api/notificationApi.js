const API_BASE_URL = "https://poketrade-back-production.up.railway.app";
// const API_BASE_URL = "http://localhost:3000";

export const markNotificationAsRead = async (notificationId) => {
    const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return response;
};

export const deleteNotification = async (notificationId) => {
    const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return response;
};

export const fetchNotifications = async () => {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.json();
};

export const createNotification = async (notification) => {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
    });
    return response.json();
};
