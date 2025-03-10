import React from "react";

const PlaceholderAvatar = ({ name }) => {
    return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center transition-all">
            <span className="text-primary-600 font-semibold capitalize">
                {name.charAt(0)}
            </span>
        </div>
    );
};

export default PlaceholderAvatar;
