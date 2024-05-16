import { isValidObjectId } from "mongoose";
import { decodeAuthToken } from "../util/utils.js";
import User from "../models/user.model.js";

// Middleware to authenticate users
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.['auth-token'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedData = await decodeAuthToken(token);

        if (!decodedData) {
            return res.status(401).json({ message: 'Unauthorized with wrong details' });
        }

        const { id } = decodedData;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'user token details not valid' });
        }

        // Find the user in the database using the decoded token
        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user object to the request object for further use
        req.user = userData;
        next();

    } catch (error) {
        console.error("Error in user authentication:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default authenticateUser;
