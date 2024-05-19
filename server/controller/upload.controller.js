import { isValidObjectId } from "mongoose";
import UploadItem from "../models/uploadItems.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";
import { formatFileSize } from "../util/utils.js";


// Convert buffer to data URI
function bufferToDataUri(file) {
    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    return `data:${mimeType};base64,${base64}`;
}

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


//Handle file upload controller with cloudinary
export async function fileUpload(req, res) {
    try {

        const user = req.user;

        const { _id } = user || {};

        const { folderId } = req.body;

        const file = req.file;

        // If file not provided, do not proceed
        if (!file) {
            return res.status(400).json({ message: "No file provided" });
        }

        // Get file original name
        const fileOriginalName = file.originalname;

        // Format file size to KB, MB, or more
        const fileSize = formatFileSize(file.size);

        // Get file extension name
        const lastDotIndex = fileOriginalName.lastIndexOf('.');
        const fileExtension = lastDotIndex !== -1 ? fileOriginalName.slice(lastDotIndex + 1) : 'text';

        // Create document object for MongoDB
        const documentObject = {
            user: _id,
            name: fileOriginalName,
            type: fileExtension,
            fileSize
        };

        if (folderId) {
            if (!isValidObjectId(folderId)) {
                return res.status(400).json({ message: "Invalid folder" });
            }
            documentObject.folder = folderId;
        }

        // Create a new MongoDB document
        const newUpload = new UploadItem(documentObject);

        // Save the document in MongoDB
        const saveDocumentPromise = newUpload.save();

         // Convert file buffer to file URI
         const fileeUri = bufferToDataUri(file);

        // Upload file to Cloudinary using the buffer directly
        const uploadCloudinary = await uploadOnCloudinary({
            file: fileeUri,
            publicId: newUpload._id.toString(),
            folderPath: "media_cloud/user_upload"
        });

        if (!uploadCloudinary.secure_url) {
            return res.status(500).json({ message: "Error while uploading to Cloudinary" });
        }

        // Perform save document and delete file at the same time
        await saveDocumentPromise;

        // Update the upload link in the document
        newUpload.uploadLink = uploadCloudinary.secure_url;

        // Save the updated document
        await newUpload.save();

        res.json({ message: "File uploaded successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
