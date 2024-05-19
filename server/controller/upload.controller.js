import { isValidObjectId } from "mongoose";
import UploadItem from "../models/uploadItems.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";
import fs from "fs/promises"

//Folder upload controller
export async function folderUpload(req, res) {

    try {

        const user = req.user;

        const { _id } = user || {};

        const { folderId } = req.body

        const { folderName } = req.body

        const documentObject = {
            user: _id,
            name: folderName,
            type: "folder",
        };

        if (folderId) {

            if (!isValidObjectId(folderId)) {
                return res.status(400).json({ message: "Invalid folder" });
            }
            documentObject.folder = folderId;
        };

        const findFolder = await UploadItem.findOne({ name: folderName })

        if (findFolder) {

            return res.status(400).json({ message: "Folder already exist" });
        }

        const newUpload = new UploadItem(documentObject);

        const saveDocument = await newUpload.save();

        if (!saveDocument) {
            return res.status(500).json({ message: "Internal server error" });
        }

        res.json({
            message: "Folder create succesfully",
            saveDocument
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};



//File upload controller
export async function fileUpload(req, res) {

    try {

        const user = req.user;

        const { _id } = user || {};

        const { folderId } = req.body;

        const filePath = req.file.path;
        const fileOriginalName = req.file.originalname;

        //get file extension name
        const lastDotIndex = fileOriginalName.lastIndexOf('.');
        const fileExtension = lastDotIndex !== -1 ? fileOriginalName.slice(lastDotIndex + 1) : '';

        const documentObject = {
            user: _id,
            name: fileOriginalName,
            type: fileExtension,
        };

        if (folderId) {

            if (!isValidObjectId(folderId)) {
                return res.status(400).json({ message: "Invalid folder" });
            }
            documentObject.folder = folderId;
        };

        // Create a new MongoDB document
        const newUpload = new UploadItem(documentObject);

        // Save the document in MongoDB
        const saveDocumentPromise = newUpload.save();

        // Upload file to Cloudinary
        const uploadCloudinary = await uploadOnCloudinary({
            file: filePath,
            publicId: newUpload._id, // Use 'newUpload._id' directly
            folderPath: "media_cloud/user_upload"
        });
        if (!uploadCloudinary.secure_url) {
            return res.status(500).json({ message: "Error while uploading to Cloudinary" });
        };

        // Delete the file from the local directory after uploading to Cloudinary
        const deleteFilePromise = fs.unlink(filePath);

        // Perform save documemt and delete file at same time
        await Promise.all([saveDocumentPromise, deleteFilePromise]);

        // Update the upload link in the document
        newUpload.uploadLink = uploadCloudinary.secure_url;

        // Save the updated document
        await newUpload.save();

        res.json({ message: "File uploaded successfully", saveDocument: newUpload })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
