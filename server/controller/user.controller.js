import { isValidObjectId } from "mongoose";
import UploadItem from "../models/uploadItems.model.js";

export async function getUploadItems(req, res) {
    try {

        const user = req.user;

        const { _id } = user || {};

        const { folder, limit } = req.body;

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
            .limit(limit || 20)
            .select('name type folder uploadLink'),
           folder && UploadItem.findById(folder).select('name')
        ]);

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

        const { limit } = req.body;

        const uploadItems = await UploadItem.find({ user: _id, type: { $nin: 'folder' } })
            .sort({ creatAt: -1 })
            .limit(limit || 20)
            .select('name type folder uploadLink');

        const endOfData = (uploadItems.length < limit - 1);

        return res.status(200).json({ uploadItems, endOfData });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}