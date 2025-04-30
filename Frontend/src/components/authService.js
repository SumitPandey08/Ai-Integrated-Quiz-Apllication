// ../components/authService.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok && result.accessToken) {
            return {
                success: true,
                token: result.accessToken, // Access token
                refreshToken: result.refreshToken, // Refresh token
                user: result.user, // User object
            };
        } else {
            return { success: false, message: result.errors?.[0]?.msg || result.message || "Login failed." };
        }
    } catch (error) {
        return { success: false, message: "Network error. Please try again." };
    }
};

// You might have a similar function for signup:
export const signupUser = async (name, email, username, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, username, password }),
        });

        const result = await response.json();

        if (response.ok && result.accessToken) {
            return {
                success: true,
                token: result.accessToken,
                refreshToken: result.refreshToken,
                user: result.user,
            };
        } else {
            return { success: false, message: result.errors?.[0]?.msg || result.message || "Signup failed." };
        }
    } catch (error) {
        return { success: false, message: "Network error. Please try again." };
    }
};

// Example function to fetch user profile (requires token)
export const getProfile = async (token) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, user: result };
        } else {
            return { success: false, message: result.message || "Failed to fetch profile." };
        }
    } catch (error) {
        return { success: false, message: "Network error. Please try again." };
    }
};

// Example function to refresh the access token
export const refreshToken = async (refreshToken) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/user/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        const result = await response.json();

        if (response.ok && result.accessToken) {
            return { success: true, token: result.accessToken, refreshToken: result.refreshToken };
        } else {
            return { success: false, message: result.message || "Failed to refresh token." };
        }
    } catch (error) {
        return { success: false, message: "Network error. Please try again." };
    }
};

// Example function for logout (if you implement it on the client)
export const logoutUser = async (token) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/user/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "Failed to logout." };
        }
    } catch (error) {
        return { success: false, message: "Network error. Please try again." };
    }
};