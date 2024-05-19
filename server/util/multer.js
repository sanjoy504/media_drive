import multer from "multer";

//Multer file upload middleware
const storage = multer.memoryStorage();

export const multerUpload = multer({ storage: storage })