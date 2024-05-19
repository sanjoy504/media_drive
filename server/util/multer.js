import multer from "multer";

//multer middleware
const storage = multer.memoryStorage()
// multer configuration
export const multerUpload = multer({ storage: storage })