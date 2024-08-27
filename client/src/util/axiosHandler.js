import axios from "axios";
import { environmentVariables } from "../helper/helper";

export const getClientFolderItems = async ({ folder = false, limit, skip, filter }) => {
    let status = 500;
    let data = [];
    let isDataEnd = false;
    let folderInfo = null;
    let message = null;

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
            baseURL: environmentVariables.backendUrls.render,
            withCredentials: true
        })
        const response = await api.post('/user/get_uploads', payload);

        const { uploadItems, endOfData, folderDetails } = response.data || {};

        status = response.status;
        data = uploadItems;
        isDataEnd = endOfData;
        folderInfo = folderDetails;
        message = response.data.message;

    } catch (error) {
        console.error(error);
        isDataEnd = true;
        if (error.response) {
            status = error.response.status;
            message = error.response.data.message
        }
    };

    return { status, data, isDataEnd, folderInfo, message };
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
            baseURL: environmentVariables.backendUrls.render,
            withCredentials: true
        })

        const response = await api.post('/user/recent_uploads_files', payload);

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

export const getUploadFiles = async ({ limit, skip, filter, type }) => {
    let status = 500;
    let data = [];
    let isDataEnd = false;

    try {
        const payload = {
            limit,
            skip, 
            type
        };

        if (filter) {
            payload.filter = filter;
        }

        const api = axios.create({
            baseURL: environmentVariables.backendUrls.render,
            withCredentials: true
        })

        const response = await api.post('/user/get_files', payload);

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

export const deleteFileFromServer = async (fileIds) => {

    let status = 500;
    let message = null;

    try {
        const api = axios.create({
            baseURL: environmentVariables.backendUrls.render,
            withCredentials: true
        })

        const response = await api.post(`/user/assets/delete`, {
            fileIds
        });

        status = response.status;
        message = response.data.message;

    } catch (error) {
        console.error(error);
        if (error.response) {
            status = error.response.status
            message = error.response.data.message
        }
    };

    return { status, message };
}
