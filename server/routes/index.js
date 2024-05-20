import { Router } from "express"
import { fileUpload, folderUpload } from "../controller/upload.controller.js";
import { multerUpload } from "../util/multer.js";
import { deleteUploadFiles, getRecentUploadItems, getUploadItems, uploadSearchHandler } from "../controller/user.controller.js";

const router = Router();

//File upload route
router.post("/upload/file", multerUpload.array('files', 10), fileUpload);

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

router.post('/logout', (_, res) => {
        res.clearCookie('auth-token'); // Clear the session cookie
        res.status(200).send('Logged out successfully');
});


export default router;