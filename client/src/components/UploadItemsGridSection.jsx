import { Fragment, useCallback, memo, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, CircularProgress } from "@mui/material";
import { validateUploadFilesTypes } from "../util/utils";
import FileViewerModel from "./models/FileViewerModel";
import usePreventContextMenu from "../hooks/contextMenuEvent";
import LazyLoadingImage from "../lib/LazyLoadingImage";
import UploadOption from "./UploadOption";
import { deleteFileFromServer } from "../util/axiosHandler";

export default function UploadItemsGridSection({ title = "My Uploads", pageLoading, loading, uploadItems, reValidatePage, creatFolder = false }) {

    const [fileView, setFileView] = useState({
        fileId: null,
        title: null,
        src: null,
        type: null
    });

    const [selectedFileIds, setSelectedFileIds] = useState([]);

    // Select and unselect file handler
    const handleSelectFile = useCallback((id) => {
        setSelectedFileIds((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((fileId) => fileId !== id) : [...prevSelected, id]
        );
    }, []);

    const functions = useMemo(() => ({
        setFileView,
        handleSelectFile
    }), [setFileView, handleSelectFile]);

    //Delete files handler
    const handleDeleteFile = async () => {
        if (selectedFileIds.length > 0) {

            const { status } = await deleteFileFromServer(selectedFileIds);
            if (status === 200) {
                reValidatePage();
                setSelectedFileIds([]);
            }
        }
    };

    if (loading && uploadItems?.length === 0) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (!uploadItems) {
        return null;
    }

    return (
        <>
            <div className={`w-full h-auto ${pageLoading ? 'hidden' : 'block'} py-2 px-3.5 small-screen:px-2 sticky top-[70px] z-20 bg-white border-b border-b-slate-100 shadow-sm`}>
                <div className="w-full h-auto flex justify-between">
                    <div className=" text-gray-900 text-baze small-screen:text-sm font-bold line-clamp-2">{title}</div>
                    <UploadOption folder={creatFolder} reValidatePath={reValidatePage} />
                </div>
                {selectedFileIds.length > 0 && (
                    <div className="flex gap-2">
                        <small className="text-gray-600 font-medium">{selectedFileIds.length} file select</small>
                        <button
                            onClick={handleDeleteFile}
                            type="button"
                            className="text-red-600 text-sm"
                        >
                            <i className="bi bi-trash-fill"></i>
                            <span className="sr-only">Delete</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] small-screen:grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2 my-2.5">
                {uploadItems.map((data) => (
                    <Fragment key={data._id}>
                        {validateUploadFilesTypes(data.type) === "folder" && (
                            <FolderCard id={data._id} name={data.name} />
                        )}
                        {validateUploadFilesTypes(data.type) === "image" && (
                            <ImageCard
                                id={data._id}
                                src={data.uploadLink}
                                alt={data.name}
                                functions={functions}
                            />
                        )}
                        {validateUploadFilesTypes(data.type) === "pdf" && (
                            <PdfCard
                                id={data._id}
                                name={data.name}
                                pdfLink={data.uploadLink}
                                functions={functions}
                            />
                        )}
                    </Fragment>
                ))}
            </div>
            {loading && uploadItems?.length > 0 && (
                <div className="w-full h-auto flex justify-center items-center my-6">
                    <CircularProgress />
                </div>
            )}
            <FileViewerModel
                fileId={fileView.fileId}
                title={fileView.title}
                src={fileView.src}
                type={fileView.type}
                handleSetFileView={setFileView}
                reValidatePage={reValidatePage}
            />
        </>
    );
}

const FolderCard = memo(({ id, name }) => {

    const navigate = useNavigate();

    const openFolder = () => {
        navigate(`/uploads/${id}`);
    };

    const folderCardRef = usePreventContextMenu(openFolder);

    return (
        <div ref={folderCardRef} onClick={openFolder} className="bg-slate-50 w-full max-w-42 h-auto p-1.5 rounded-md shadow-sm flex flex-col justify-center items-center cursor-pointer relative">
            <i className="bi bi-folder-fill text-indigo-400 text-5xl"></i>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full">
                {name}
            </p>
        </div>
    );
});

const ImageCard = memo(({ id, src, alt, functions }) => {
    const { setFileView, handleSelectFile } = functions;

    const fileViewSetup = () => {
        setFileView({ fileId: id, title: alt, src, type: "image" });
    };

    const imageCardRef = usePreventContextMenu(fileViewSetup);


    return (
        <div className="w-full max-w-42 h-32 bg-slate-50 border border-slate-200 rounded-sm flex flex-col justify-center items-center cursor-pointer overflow-hidden relative">
            <div ref={imageCardRef} onClick={fileViewSetup}>
                <LazyLoadingImage
                    className="w-full max-w-16 h-auto max-h-12 rounded-sm"
                    actualSrc={src}
                    alt={alt}
                />
            </div>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full mt-1.5 px-1.5">
                {alt}
            </p>
            <div className="absolute right-0 top-0 z-10">
                <Checkbox onChange={() => handleSelectFile(id)} className="w-3 h-3" aria-label="select file" />
            </div>
        </div>
    );
});

const PdfCard = memo(({ id, name, pdfLink, functions }) => {

    const { setFileView, handleSelectFile } = functions;

    const fileViewSetup = () => {
        setFileView({ fileId: id, title: name, src: pdfLink, type: "pdf" });
    };

    const pdfCardRef = usePreventContextMenu(fileViewSetup);

    return (
        <div className="bg-slate-50 p-1.5 w-full max-w-42 h-32 rounded-md shadow-sm flex flex-col justify-center items-center cursor-pointer relative">
            <i ref={pdfCardRef} onClick={fileViewSetup} className="bi bi-file-earmark-pdf-fill text-red-600 text-5xl"></i>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full mt-1.5">
                {name}
            </p>
            <div className="absolute right-0 top-0 z-10">
                <Checkbox onChange={() => handleSelectFile(id)} className="w-3 h-3" aria-label="select file" />
            </div>
        </div>
    );
});
