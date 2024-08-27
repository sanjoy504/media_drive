import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import UploadItem from "../models/uploadItems.model.js";
import { deleteFromCloudinary } from "../util/cloudinary.js";
import { getDataBetweenDate } from "../lib/dbOperations.js";
import { getTotalSizesByTypes } from "../lib/dbOperations.js";

// upload items select fields
const uploadItemsSelectFields = "name type folder uploadLink size extension";

//validate user controller if user authenticated send user details to client 
export async function validateUser(req, res) {

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

};

// Get user upload items
export async function getFolderItems(req, res) {
    try {

        const user = req.user;

        const { _id } = user || {};

        const { folder, limit, skip } = req.body;

        const query = { user: _id };

        if (folder) {

            if (!isValidObjectId(folder)) {
                return res.status(400).json({ message: 'Invalid folder' });
            }
            query.folder = folder;
        } else {
            query.folder = { $exists: false };
            query.type = 'folder';
        }

        const [uploadItems, folderDetails] = await Promise.all([
            UploadItem.find(query)
                .sort({ creatAt: -1 })
                .skip(skip)
                .limit(limit || 20)
                .select(uploadItemsSelectFields),
            folder && UploadItem.findById(folder).select('name')
        ]);

        if (folder && !folderDetails) {
            return res.status(400).json({ message: 'No folder found' });
        }

        const endOfData = (uploadItems.length < limit - 1);

        return res.status(200).json({ uploadItems, endOfData, folderDetails });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Get user upload items
export async function getUploadItems(req, res) {
    try {

        const user = req.user;

        const { _id } = user || {};

        const { limit, skip } = req.body;

        const query = { user: _id, type: { $nin: 'folder' } };

        const [uploadItems, folderDetails] = await Promise.all([
            UploadItem.find(query)
                .sort({ creatAt: -1 })
                .skip(skip)
                .limit(limit || 20)
                .select(uploadItemsSelectFields),
            folder && UploadItem.findById(folder).select('name')
        ]);

        if (folder && !folderDetails) {
            return res.status(400).json({ message: 'No folder found' });
        }

        const endOfData = (uploadItems.length < limit - 1);

        return res.status(200).json({ uploadItems, endOfData, folderDetails });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Get user recent upload files
export async function getFiles(req, res) {
    try {

        const user = req.user;

        const { _id } = user || {};

        const { limit, skip, type } = req.body;
        const regexType = new RegExp(type, 'i')

        const query = {
            user: _id,
            type: { $regex: regexType },
        };

        const uploadItems = await UploadItem.find(query)
            .sort({ creatAt: -1 })
            .limit(limit || 20)
            .skip(skip)
            .select(uploadItemsSelectFields);

        const endOfData = (uploadItems.length < limit - 1);

        return res.status(200).json({ uploadItems, endOfData });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Get user all photos from
export async function getRecentUploadItems(req, res) {
    try {

        const user = req.user;

        const { _id } = user || {};

        const { limit, skip } = req.body;

        const query = {
            user: _id,
            type: { $nin: 'folder' },
            creatAt: getDataBetweenDate({ type: 'days', value: 7 })
        };

        const uploadItems = await UploadItem.find(query)
            .sort({ creatAt: -1 })
            .limit(limit || 20)
            .skip(skip)
            .select(uploadItemsSelectFields);

        const endOfData = (uploadItems.length < limit - 1);

        return res.status(200).json({ uploadItems, endOfData });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Search user upload items handler
export async function uploadSearchHandler(req, res) {
    try {

        const user = req.user;

        const { _id } = user || {};

        const { query, limit, skip } = req.body;

        //Create a regular expression for the search query
        const searchRegExp = new RegExp(query, "i");

        const uploadItems = await UploadItem.find(
            {
                user: _id,
                $or: [
                    { name: { $regex: searchRegExp } },
                    { type: { $regex: searchRegExp } },
                    { extension: { $regex: searchRegExp } }
                ]
            }
        )
            .sort({ creatAt: -1 })
            .limit(limit)
            .skip(skip)
            .select(uploadItemsSelectFields);

        const endOfData = (uploadItems.length < limit);

        return res.status(200).json({ uploadItems, endOfData });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete user upload assets
export async function deleteUploadFiles(req, res) {
    try {
        const { fileIds } = req.body;

        if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).send({ message: "Invalid request. Missing or invalid fileIds." });
        }

        // Delete files from database
        const deleteFileFromDatabase = await UploadItem.deleteMany({ _id: { $in: fileIds }, });

        if (deleteFileFromDatabase.deletedCount > 0) {

            const publicIds = fileIds.map(fileId => `media_cloud/user_upload/${fileId}`);

            //Delete files from Cloudinary
            await deleteFromCloudinary(publicIds);

            return res.status(200).send({
                message: `${deleteFileFromDatabase.deletedCount} file(s) deleted successfully`,
            });
        } else {
            return res.status(400).send({ message: "Failed to delete files or files not found" });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal server error while deleting files" });
    }
}
