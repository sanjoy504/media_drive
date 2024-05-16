import jwt from "jsonwebtoken";

export const decodeAuthToken = async (token) => {
    try {
        // Verify the JWT token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        return decodedData;
    } catch (error) {
        console.error("Error decoding auth token:", error);
        return null;
    }
};

export const parseCookie = (cookieHeader) => {
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        const name = parts.shift().trim();
        const value = decodeURIComponent(parts.join('='));
        cookies[name] = value;
    });
    return cookies;
};
