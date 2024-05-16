//Toggle side bar work only small screen

export const toggleSidebar = ()=>{
    const sideBar = document.querySelector("#sidebar");

    if (sideBar) {
        sideBar.classList.toggle("small-screen:-translate-x-full");
    };
}

// Validate if the provided type is an image based on the extension
export const validateUploadFilesTypes = (type) => {

    if (!type) {
        return "file";
    }

    const currentType = type?.toLowerCase();

    // Supported image file extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];

    // Check if the normalized type is in the list of image extensions
    const isImage = imageExtensions.includes(currentType);

    let filterType;

    if (isImage) {
        filterType = "image";
    } else if (currentType === "folder") {
        filterType = "folder";
    } else if (currentType === "pdf") {
        filterType = "pdf";
    } else if (currentType === "json") {
        filterType = "json";
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
}
