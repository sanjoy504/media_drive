import { useState } from "react";
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";
import { deleteFileFromServer } from "../../util/axiosHandler";
import { downloadImageAndPdf } from "../../util/utils";

function FileViewerModel({ fileId, title, src, type, handleSetFileView, reValidatePage }) {
    const [zoom, setZoom] = useState(100);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const handleBackgroundClick = () => {
        if (fileId) {
            handleSetFileView({ fileId: null, name: null, src: null, type: null });
        }
        if (zoom !== 100) {
            setZoom(100);
        }
    };

    const handleChildClick = (event) => {
        event.stopPropagation();
    };

    const handleZoomImage = () => {
        if (type === "image") {
            setZoom((prevZoom) => (prevZoom >= 150 ? 100 : prevZoom + 25));
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Media cloud ${type} share`,
                text: `See media cloud upload ${type} you can also download it.`,
                url: src,
            });
        }
    };

    const handleDeleteFile = async () => {
        setOpenBackdrop(true);
        const { status } = await deleteFileFromServer(fileId);
        if (status === 200) {
            reValidatePage();
            handleBackgroundClick();
        }
        setOpenBackdrop(false);
    };

    if (!src || !type || !fileId) {
        return null;
    }

    return (
        <>
            <div
                onClick={handleBackgroundClick}
                className="w-full h-full fixed top-0 left-0 z-50 bg-gray-950 bg-opacity-80 flex items-center justify-center"
            >
                <div
                    className={`${type === "image" ? "bg-transparent" : "bg-white"} w-fit h-fit max-h-full max-w-96 flex flex-col space-y-4 items-center justify-center rounded-sm mx-2`}
                >
                    {type === "image" ? (
                        <img
                            className="w-auto h-auto rounded-sm overflow-hidden select-none pointer-events-none transition-transform duration-300 ease-in-out"
                            src={src}
                            alt={title}
                            style={{ transform: `scale(${zoom / 100})` }}
                        />
                    ) : (
                        <iframe className="w-full max-w-[350] h-96 overflow-x-hidden" src={src} title="PDF Preview" />
                    )}
                </div>

                <div className="flex gap-8 absolute top-4 right-3 small-screen:mx-3 mx-5 text-xl">
                    {type === "image" && (
                        <Tooltip title={zoom === 150 ? "Zoom out" : "Zoom in"}>
                            <button
                                onClick={(event) => {
                                    handleChildClick(event);
                                    handleZoomImage();
                                }}
                                type="button"
                                className="bg-transparent text-white"
                            >
                                <i className={`bi bi-zoom-${zoom === 150 ? "out" : "in"}`}></i>
                                <span className="sr-only">Zoom in and out</span>
                            </button>
                        </Tooltip>
                    )}
                    <Tooltip title="Delete">
                        <button
                            onClick={(event) => {
                                handleChildClick(event);
                                handleDeleteFile();
                            }}
                            type="button"
                            className="bg-transparent text-white"
                        >
                            <i className="bi bi-trash"></i>
                            <span className="sr-only">Delete</span>
                        </button>
                    </Tooltip>
                    <Tooltip title="Share">
                        <button
                            onClick={(event) => {
                                handleChildClick(event);
                                handleShare();
                            }}
                            type="button"
                            className="bg-transparent text-white"
                        >
                            <i className="bi bi-share"></i>
                            <span className="sr-only">Share</span>
                        </button>
                    </Tooltip>
                    <Tooltip title="Download">
                        <button
                            onClick={(event) => {
                                handleChildClick(event);
                                downloadImageAndPdf(src, title);
                            }}
                            type="button"
                            className="bg-transparent text-white"
                        >
                            <i className="bi bi-download"></i>
                            <span className="sr-only">Download</span>
                        </button>
                    </Tooltip>
                </div>
            </div>

            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default FileViewerModel;