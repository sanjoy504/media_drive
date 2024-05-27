import { audioTypes, imageTypes, videoTypes } from "../constant/constant.js";
import UploadItem from "../models/uploadItems.model.js";
import { convertSizeToBytes, formatFileSize } from "../util/utils.js";

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
export async function getTotalSizesByTypes({ user, userTotalStorage }) {
    try {
        if (!user) {
            return;
        }
         
        //concat all ext types array
        const types = imageTypes.concat(videoTypes, audioTypes, 'pdf');
       
        const totalSizesInTypes = {
            image: 0,
            pdf: 0,
            video: 0,
            audio: 0,
            other: 0,
        };

        // Find all documents with the specified extensions
        const items = await UploadItem.find({ user, extension: { $in: types } });

        // Accumulate the sizes for each type
        items.forEach(item => {
            const bytes = convertSizeToBytes(item.size || '0 Byte');
            if (imageTypes.includes(item.extension)) {
                totalSizesInTypes.image += bytes;
            } else if (videoTypes.includes(item.extension)) {
                totalSizesInTypes.video += bytes
            } else if (audioTypes.includes(item.extension)) {
                totalSizesInTypes.audio += bytes
            } else if (item.extension === 'pdf') {
                totalSizesInTypes.pdf += bytes
            } else {
                totalSizesInTypes.other += bytes;
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
        const totalPercentageUsed = formatPercentage((totalUsedStorageBytes / userTotalStorageBytes * 100));

        return { storageUseInTypes, totalUsedStorage: totalUsedStorageFormatted, totalPercentageUsed };
    } catch (error) {
        console.error("Error calculating total sizes by types:", error);
        throw new Error("Internal Server Error");
    }
};

//get data from mongodb between provided months or days
export function getDataBetweenDate({ type = 'months', value }) {
    const currentDate = new Date();
    const fromDate = new Date();

    if (type === 'months') {
        fromDate.setMonth(currentDate.getMonth() - value);
    } else if (type === 'days') {
        fromDate.setDate(currentDate.getDate() - value);
    } else {
        throw new Error('Please specify "months" or "days".');
    }

    return {
        $gte: fromDate,
        $lte: currentDate
    };
};
