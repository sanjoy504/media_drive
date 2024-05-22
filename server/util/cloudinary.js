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

const deleteFromCloudinary = async (publicIds) => {
    try {
        if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
            return { status: 404, message: "publicIds is missing or invalid" };
        }

        // Delete the images from Cloudinary
        const cloudinaryResponse = await cloudinary.api.delete_resources(publicIds, { type: 'upload', resource_type: 'image' });

        return cloudinaryResponse;

    } catch (error) {
        console.log(error);
        return { status: 500, message: "Error while deleting images from Cloudinary" };
    }
};


export { uploadOnCloudinary, deleteFromCloudinary };