import { Router } from "express"
import { fileUpload, folderUpload } from "../controller/upload.controller.js";
import { multerUpload } from "../util/multer.js";
import { deleteUploadFiles, getRecentUploadItems, getUploadItems, uploadSearchHandler } from "../controller/user.controller.js";

const router = Router();

//File upload route
router.post("/upload/file", multerUpload.single('file'), fileUpload);

// Folder upload route
router.post("/upload/folder", folderUpload);

//get upload items
router.post("/get_uploads", getUploadItems);

//Recent upload files route
router.post("/recent_uploads_files", getRecentUploadItems);

//Seacrh upload items route
router.post("/search", uploadSearchHandler);

//Delete upload fies
router.delete("/delete/:fileId", deleteUploadFiles);

export default router;