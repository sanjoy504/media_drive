import { isValidObjectId } from "mongoose";
import UploadItem from "../models/uploadItems.model.js";
import { deleteImageFromCloudinary } from "../util/cloudinary.js";
import { getDataBetweenDate } from "../lib/dbOperations.js";

export async function getUploadItems(req, res) {
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
            query.folder = { $exists: false }
        }

        const [uploadItems, folderDetails] = await Promise.all([
            UploadItem.find(query)
                .sort({ creatAt: -1 })
                .skip(skip)
                .limit(limit || 20)
                .select('name type folder uploadLink fileSize'),
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

//Get recent upload files
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
            .select('name type folder uploadLink');

        const endOfData = (uploadItems.length < limit - 1);

        return res.status(200).json({ uploadItems, endOfData });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Search upload items handler
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
                    { type: { $regex: searchRegExp } }
                ]
            }
        )
            .sort({ creatAt: -1 })
            .limit(limit)
            .skip(skip)
            .select('name type folder uploadLink');

        const endOfData = (uploadItems.length < limit);

        return res.status(200).json({ uploadItems, endOfData });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete upload files
export async function deleteUploadFiles(req, res) {

    try {
        const { fileId } = req.params;

        if (!fileId) {
            return res.status(400).send({ message: "Invalid request Missing params." });
        }

        //Delete file from database
        const deleteFileFromDatabase = await UploadItem.deleteOne({ _id: fileId });
    
        if (deleteFileFromDatabase.deletedCount > 0) {

            await deleteImageFromCloudinary({ publicId: `media_cloud/user_upload/${fileId}` });

            return res.status(200).send({ message: "File deleted successfully" });
        } else {
            return res.status(400).send({ message: "Failed to delete file or file not found" });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal server error while deleting files" });
    }

}
