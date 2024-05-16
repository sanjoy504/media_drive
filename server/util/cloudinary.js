import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async ({ file, publicId, folderPath }) => {
    try {
        if (!file && !publicId && !folderPath) {
            return { status: 404, message: "Some fildes is missing" };
        }
        //upload the file on cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(file,
            {
                public_id: publicId,
                folder: folderPath,
            });

        return cloudinaryResponse;

    } catch (error) {
        console.log(error)
        return { status: 500, message: "Error while uploading on cloudinary" };
    }
};

const deleteImageFromCloudinary = async ({ publicId }) => {

    try {
        if (!publicId) {
            return { status: 404, message: "publicId is missing" };
        }

        //delete the image from cloudinary
        const cloudinaryResponse = await cloudinary.api.delete_resources([publicId], { type: 'upload', resource_type: 'image' });

        return cloudinaryResponse;

    } catch (error) {
        console.log(error)
        return { status: 500, message: "Error while delete image from cloudinary" };
    }

};

export { uploadOnCloudinary, deleteImageFromCloudinary };