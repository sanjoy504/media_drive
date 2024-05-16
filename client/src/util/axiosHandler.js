import axios from "axios";
import { environmentVariables } from "../helper/helper";

export const getClientUploadItems = async ({ folder = false, limit, skip, filter }) => {
    let status = 500;
    let data = [];
    let isDataEnd = false;
    let folderInfo= null;

    try {

        const payload = {
            limit,
            skip
        };

        if (folder) {
            payload.folder = folder;
        }
        if (filter) {
            payload.filter = filter;
        }

        const api = axios.create({
            baseURL: environmentVariables.backendUrl,
            withCredentials: true
        })
        const response = await api.post('/get_uploads', payload);

        const { uploadItems, endOfData, folderDetails } = response.data || {};

        status = response.status;
        data = uploadItems;
        isDataEnd = endOfData;
        folderInfo = folderDetails

    } catch (error) {
        console.error(error);
        isDataEnd = true;
        if (error.response) {
            status = error.response.status
        }
    };

    return { status, data, isDataEnd, folderInfo };
};


export const getRecentUploadsFiles = async ({ limit, skip, filter }) => {
    let status = 500;
    let data = [];
    let isDataEnd = false;

    try {
        const payload = {
            limit,
            skip
        };

        if (filter) {
            payload.filter = filter;
        }

        const api = axios.create({
            baseURL: environmentVariables.backendUrl,
            withCredentials: true
        })

        const response = await api.post('/recent_uploads_files', payload);

        const { uploadItems, endOfData } = response.data || {};

        status = response.status;
        data = uploadItems;
        isDataEnd = endOfData;

    } catch (error) {
        console.error(error);
        isDataEnd = true;
        if (error.response) {
            status = error.response.status
        }
    };

    return { status, data, isDataEnd };
};
