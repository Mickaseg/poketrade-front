import React from "react";
import { X } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { getTimeDisplay } from '../utils/timeUtils';
import { useEffect } from "react";

const NotificationsPage = () => {
    const { notifications, markAsRead, removeNotification } = useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Notifications - TradeHelper";
    }, []);


    const handleNotificationClick = async (notification) => {
        await markAsRead(notification._id);

        switch (notification.type) {
            case "trade_proposal":
                navigate("/mytrades");
                break;
            case "trade_accepted":
                navigate("/mytrades");
                break;
            case "offer_accepted":
                navigate("/mytrades?tab=accepted&offerId=" + notification.trade_id);
                break;
            case "trade_completed":
                navigate("/mytrades?tab=completed&tradeId=" + notification.trade_id);
                break;
            default:
                break;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            
            <div className="bg-white rounded-lg shadow">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Aucune notification
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 flex flex-col gap-4 p-4">
                        {notifications.map((notification) => {
                            const timeDisplay = getTimeDisplay(notification.createdAt);

                            return (
                                <div
                                    key={notification._id}
                                    className={`p-4 hover:bg-gray-50 ${
                                        !notification.read ? "bg-blue-50" : ""
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div 
                                            className="flex-1 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <p className="text-sm font-medium text-gray-900">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {timeDisplay}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeNotification(notification._id)}
                                            className="ml-4 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage; 