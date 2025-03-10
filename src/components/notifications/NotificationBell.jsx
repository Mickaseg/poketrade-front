import React from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
    const { getUnreadCount } = useNotifications();
    const navigate = useNavigate();

    return (
        <div className="relative">
            <button
                className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none cursor-pointer"
                onClick={() => navigate("/notifications")}
            >
                <Bell size={18} />
                {getUnreadCount() > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {getUnreadCount()}
                    </span>
                )}
            </button>
        </div>
    );
};

export default NotificationBell;
