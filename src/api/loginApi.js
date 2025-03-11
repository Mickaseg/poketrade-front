export const loginApi = async (credentials) => {
    const response = await fetch(
        "http://localhost:3000/api/auth/login",
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
