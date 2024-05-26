import { useDispatch } from "react-redux";
import { updateWebState } from "../context/web_state/webStateSlice";

//Toggle side bar work only small screen
export const toggleSidebar = (type) => {
    const sideBar = document.querySelector("#sidebar");

    if (sideBar) {

        if (type === "hide") {
            sideBar.classList.add("small-screen:-translate-x-full");
        } else if (type === "show") {
            sideBar.classList.add("small-screen:-translate-x-full");
        } else {
            sideBar.classList.toggle("small-screen:-translate-x-full");
        }

    }
};

// backdrops open close handler
export const backdropProgress = () => {
    const dispathch = useDispatch();
    const setBackdrop = (type) => {
        dispathch(updateWebState({ isBackdropOpen: type || false }));
    }
    return setBackdrop
};

// Validate if the provided type is an image based on the extension
export const validateUploadFilesTypes = (type) => {

    if (!type) {
        return "file";
    }
    // transform to lowercase for best match results
    const currentType = type?.toLowerCase();

    // check image type
    const isImage = currentType.startsWith('image/');

    // check pdf file
    const isPdf = (currentType === 'application/pdf');

    let filterType;

    if (currentType === 'folder') {
        return currentType
    } else if (isImage) {
        filterType = "image";
    } else if (isPdf) {
        filterType = "pdf";
    } else {
        filterType = "file";
    }

    return filterType;
};

export function downloadImageAndPdf(src, title) {
    fetch(src)
        .then(response => response.blob())
        .then(blob => {
            // Create an object URL for the blob object
            const url = window.URL.createObjectURL(blob);

            // Create a new anchor element
            const a = document.createElement('a');
            a.href = url;
            a.download = title || 'download';

            // Append the anchor to the body, trigger click, and remove it after triggering
            document.body.appendChild(a);
            a.click();
            a.remove();

            // Clean up the object URL
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Download failed:', error);
        });
};
