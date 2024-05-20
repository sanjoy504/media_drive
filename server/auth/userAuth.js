import { Router } from "express";
import User from "../models/user.model.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { getTotalSizesByTypes } from "../lib/dbOperations.js";

const router = Router();

//validate user 
router.get('/validate', authenticateUser, async (req, res) => {

    const user = req.user;

    //get this user data from user authentication middleware
    const { _id, storage_limit } = user || {};

    const [userDetails, storageDetails] = await Promise.all([
        
        // get user details
        User.findById(_id).select('name avatar email storage_limit'),
         
        //get ser storage details like
        getTotalSizesByTypes({
            user: _id,
            userTotalStorage: storage_limit || "3 GB"
        })
    ]);

    res.json({ message: 'success', userDetails, storageDetails });

});

export default router;
