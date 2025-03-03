import React from "react";

const PlaceholderAvatar = ({ name }) => {
    return (
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:ring-2 hover:ring-primary-300 transition-all">
            <span class="text-primary-600 font-semibold">{name.charAt(0)}</span>
        </div>
    );
};

export default PlaceholderAvatar;
