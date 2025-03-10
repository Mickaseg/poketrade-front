export const getTimeDisplay = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInHours = Math.abs(now - createdDate) / 36e5;

    let timeDisplay;
    if (diffInHours < 24) {
        const diffInMinutes = Math.floor((now - createdDate) / 60000);
        if (diffInMinutes < 1) {
            timeDisplay = "à l'instant";
        } else if (diffInMinutes < 60) {
            timeDisplay = `il y a ${diffInMinutes} minute${
                diffInMinutes > 1 ? "s" : ""
            }`;
        } else {
            const hours = Math.floor(diffInMinutes / 60);
            timeDisplay = `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
        }
    } else {
        timeDisplay = createdDate.toLocaleDateString();
    }

    return timeDisplay;
};
