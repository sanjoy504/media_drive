import { Router } from "express"
import { fileUpload, folderUpload } from "../controller/upload.controller.js";
import { multerUpload } from "../util/multer.js";
import { getRecentUploadItems, getUploadItems } from "../controller/user.controller.js";

const router = Router();

//File upload route
router.post("/upload/file", multerUpload.single('file'), fileUpload);

// Folder upload route
router.post("/upload/folder", folderUpload);

//get upload items
router.post("/get_uploads", getUploadItems);

//Recent upload files route
router.post("/recent_uploads_files", getRecentUploadItems);

export default router;