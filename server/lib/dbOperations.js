import UploadItem from "../models/uploadItems.model.js";
import { formatFileSize } from "../util/utils.js";

// This function converts a size string back to bytes
function convertSizeToBytes(size) {
    const units = {
        Byte: 1,
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
        TB: 1024 ** 4
    };

    const [value, unit] = size.split(' ');
    return parseFloat(value) * (units[unit] || 1);
}

function formatPercentage(value) {
    if (value === 0) {
        return '0%';  // Shows "0%" for zero values
    } else if (value < 0.01) {
        return '0%';  // Shows "1%" for very small but non-zero values
    } else {
        // Rounds to the nearest tenth if not an integer
        return value % 1 === 0 ? `${value.toFixed(0)}%` : `${value.toFixed(1)}%`;
    }
}


// This function aggregates and calculates the total size for a specific type
export async function getTotalSizesByTypes({ user, types, userTotalStorage }) {
    try {
        if (!user) {
            return;
        }

        // Define a list of image types
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];

        // Define a list of video file types
        const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv'];

        const totalSizesInTypes = {
            image: 0,
            pdf: 0,
            video: 0
        };

        // Find all documents with the specified types
        const items = await UploadItem.find({ user, type: { $in: types } });

        // Accumulate the sizes for each type
        items.forEach(item => {
            const bytes = convertSizeToBytes(item.fileSize || '0 Byte');
            if (imageTypes.includes(item.type)) {
                totalSizesInTypes.image += bytes;
            } else if (videoTypes.includes(item.type)) {
                totalSizesInTypes.video += bytes
            } else {
                totalSizesInTypes[item.type] += bytes;
            }

        });

        // Convert userTotalStorage to bytes
        const userTotalStorageBytes = convertSizeToBytes(userTotalStorage);

        // Format storage details and calculate percentage use
        const storageUseInTypes = {};
        for (const type in totalSizesInTypes) {
            const sizeFormatted = formatFileSize(totalSizesInTypes[type]);
            const percentageUse = totalSizesInTypes[type] / userTotalStorageBytes * 100;
            const formattedPercentage = formatPercentage(percentageUse);
            storageUseInTypes[type] = {
                size: sizeFormatted,
                percentageUse: formattedPercentage
            };
        }

        // Calculate total used storage
        const totalUsedStorageBytes = Object.values(totalSizesInTypes).reduce((acc, bytes) => acc + bytes, 0);
        const totalUsedStorageFormatted = formatFileSize(totalUsedStorageBytes);
        const totalPercentageUsed = (totalUsedStorageBytes / userTotalStorageBytes * 100).toFixed(2) + '%';

        return { storageUseInTypes, totalUsedStorage: totalUsedStorageFormatted, totalPercentageUsed };
    } catch (error) {
        console.error("Error calculating total sizes by types:", error);
        throw new Error("Internal Server Error");
    }
}
