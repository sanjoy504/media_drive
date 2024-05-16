import { Router } from "express";
import User from "../models/user.model.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = Router();

//validate user 
router.get('/validate', authenticateUser, async (req, res) => {

    const user = req.user;

    const { _id } = user || {};

    const userDetails = await User.findById(_id).select('name avatar email');

    res.json({ message: 'success', userDetails });

});

export default router;
