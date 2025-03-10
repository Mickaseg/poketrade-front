export const loginApi = async (credentials) => {
    const response = await fetch(
        "https://poketrade-back-production.up.railway.app/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        }
    );

    if (!response.ok) {
        throw new Error("Identifiants invalides");
    }

    return response.json();
};
