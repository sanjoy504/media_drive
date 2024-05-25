
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// google auth login and sign up 
export async function googleAuth(req, res) {

    try {
        const userData = req.body;

        //Extract user email from request body user data
        const { avatar, email } = userData;

        //Find user by email
        let user = await User.findOne({ email }).select('name email avatar');

        //If user does not exist, create a new user
        if (!user) {
            //Create a new user with the provided user data
            user = new User(userData);
            await user.save();
        }

        //Generate JWT token
        const tokenData = { id: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET);

        //check user google current avatar is match to user database avatar if not then update
        if (!user.avatar.match(avatar)) {
            user.avatar = avatar;
        };

        //Save the token to the user document
        user.authToken = token;
        
        //save final updated user
        await user.save();

        // Calculate token expiration date (30 days from now)
        const tokenExpiration = new Date();
        tokenExpiration.setDate(tokenExpiration.getDate() + 30);

        // Check if the environment is production
        const isProduction = process.env.NODE_ENV === 'production';

        // Set the secure flag based on the environment
        const secureFlag = isProduction;

        // Set the SameSite attribute based on the environment
        const sameSiteSetting = isProduction ? 'none' : 'lax';

        // Set the token in a cookie with expiration date
        res.cookie('auth-token', token, {
            httpOnly: true, // Use httpOnly for security
            sameSite: sameSiteSetting,
            secure: secureFlag,
            expires: tokenExpiration,
        });

        // Send success response
        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error in Google authentication:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

};