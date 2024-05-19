import { isValidObjectId } from "mongoose";
import { v4 as uuidv4 } from "uuid"
import fs from "fs/promises"
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import UploadItem from "../models/uploadItems.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";
import { formatFileSize } from "../util/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the temporary directory exists
const tempDir = path.join(__dirname, './temp');

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

        const file = req.file

        //if file not provided the not proseed next 
        if (!file) {

            return res.status(400).json({ message: "No file provided" });
        };

        //get file griginal name
        const fileOriginalName = file.originalname;

        //format file size to kb mb or more
        const fileSize = formatFileSize(file.size);

        //Create a temporary file path
        const tempFilePath = path.join(tempDir, `${uuidv4()}${path.extname(fileOriginalName)}`);

        //Write the buffer to a temporary file
        await fs.writeFile(tempFilePath, file.buffer);

        //get file extension name
        const lastDotIndex = fileOriginalName.lastIndexOf('.');
        const fileExtension = lastDotIndex !== -1 ? fileOriginalName.slice(lastDotIndex + 1) : '';

        //Creat document object for mongodb
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
        };

        // Create a new MongoDB document
        const newUpload = new UploadItem(documentObject);

        // Save the document in MongoDB
        const saveDocumentPromise = newUpload.save();

        // Upload file to Cloudinary
        const uploadCloudinary = await uploadOnCloudinary({
            file: tempFilePath,
            publicId: newUpload._id,
            folderPath: "media_cloud/user_upload"
        });
        if (!uploadCloudinary.secure_url) {
            return res.status(500).json({ message: "Error while uploading to Cloudinary" });
        };

        // Delete the file from the local directory after uploading to Cloudinary
        const deleteFilePromise = fs.unlink(tempFilePath);

        // Perform save documemt and delete file at same time
        await Promise.all([saveDocumentPromise, deleteFilePromise]);

        // Update the upload link in the document
        newUpload.uploadLink = uploadCloudinary.secure_url;

        // Save the updated document
        await newUpload.save();

        res.json({ message: "File uploaded successfully", saveDocument: newUpload });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
