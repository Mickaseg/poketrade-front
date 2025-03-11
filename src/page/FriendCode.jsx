import { useEffect } from "react";

const FriendCode = () => {
    useEffect(() => {
        document.title = "Friend Code - CardTrade";
    }, []);
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Friend Code</h1>
        </div>
    );
};

export default FriendCode;
