import { isValidObjectId } from "mongoose";
import UploadItem from "../models/uploadItems.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";
import { bufferToDataUri, formatFileSize } from "../util/utils.js";

//Folder upload controller
export async function folderUpload(req, res) {

    try {

        const user = req.user;

        const { _id } = user || {};

        const { folderId } = req.body

        const { folderName } = req.body

        // setup initially mongodb new document object
        const documentObject = {
            user: _id,
            name: folderName,
            type: "folder",
        };

        // setup inital check folder already exists query conditions object
        const isFolderExistCheckQuery = {
            user: _id,
            name: folderName,
            type: "folder",
        }

        // check is folder provided or its in indxfolders page creat or not
        if (folderId && folderId !== 'indexfolders') {

            if (!isValidObjectId(folderId)) {
                return res.status(400).json({ message: "Invalid folder" });
            };

            // set a folderId in check exist folder query for check in this provided fodder already exist under this folderId/folder
            isFolderExistCheckQuery.folder = folderId;

            // set parent folder if is not creat under indexfolders
            documentObject.folder = folderId;
        };

        // check folder already exists or not
        const findFolder = await UploadItem.findOne(isFolderExistCheckQuery)

        if (findFolder) {

            return res.status(400).json({ message: "Folder already exist" });
        };

        // creat fiinal mongodb new document object
        const newUpload = new UploadItem(documentObject);

        // save the documet on mongodb
        const saveDocument = await newUpload.save();

        // check if document not save send error to client
        if (!saveDocument) {
            return res.status(500).json({ message: "Internal server error" });
        }

        res.json({ message: "Folder create succesfully" })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Handle file upload controller with cloudinary
export async function fileUpload(req, res) {
    try {
        const user = req.user;
        const { _id } = user || {};
        const { folderId } = req.body;
        const files = req.files;

        // If files not provided, do not proceed
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files provided" });
        }

        for (const file of files) {
            // Check if file size is greater than 15 MB (15 * 1024 * 1024 bytes)
            if (file.size > 15 * 1024 * 1024) {
                return res.status(400).json({ message: "File size exceeds 15 MB limit" });
            }

            // Get file original name
            const fileOriginalName = file.originalname;

            // Format file size to KB, MB, or more
            const fileSize = formatFileSize(file.size);

            // Get file extension name
            const lastDotIndex = fileOriginalName.lastIndexOf('.');
            const fileExtension = lastDotIndex !== -1 ? fileOriginalName.slice(lastDotIndex + 1) : 'file';

            // Create document object for MongoDB
            const documentObject = {
                user: _id,
                name: fileOriginalName,
                type: file.mimetype || fileExtension,
                size: fileSize,
                extension: fileExtension
            };

            if (folderId) {
                if (!isValidObjectId(folderId)) {
                    return res.status(400).json({ message: "Invalid folder" });
                }
                documentObject.folder = folderId;
            }

            // Create a new MongoDB document
            const newUpload = new UploadItem(documentObject);

            // Convert file buffer to file URI
            const fileUri = bufferToDataUri(file);

            // Upload file to Cloudinary using the buffer directly
            const uploadCloudinary = await uploadOnCloudinary({
                file: fileUri,
                publicId: newUpload._id.toString(),
                folderPath: "media_cloud/user_upload"
            });

            if (!uploadCloudinary.secure_url) {
                return res.status(500).json({ message: "Error while uploading to Cloudinary" });
            }

            // Update the upload link in the document
            newUpload.uploadLink = uploadCloudinary.secure_url;

            // Save the updated document
            await newUpload.save();
        }

        res.json({ message: "Files uploaded successfully" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
