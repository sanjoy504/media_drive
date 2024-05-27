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
    cookieHeader?.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        const name = parts.shift().trim();
        const value = decodeURIComponent(parts.join('='));
        cookies[name] = value;
    });
    return cookies;
};

// formating file size in kb mb gb and more
export function formatFileSize(bytes) {
    const sizes = ['Byte', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

// Convert buffer to data URI
export function bufferToDataUri(file) {
    const base64 = file?.buffer.toString('base64');
    const mimeType = file.mimetype;
    return `data:${mimeType};base64,${base64}`;
};

// This function converts a size string back to bytes
export function convertSizeToBytes(size) {
    const units = {
        Byte: 1,
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
        TB: 1024 ** 4
    };

    const [value, unit] = size.split(' ');
    return parseFloat(value) * (units[unit] || 1);
}


