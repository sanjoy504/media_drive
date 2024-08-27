import { Fragment, useCallback, memo, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, CircularProgress, Dialog, Switch } from "@mui/material";
import { backdropProgress, validateUploadFilesTypes } from "../util/utils";
import { deleteFileFromServer } from "../util/axiosHandler";
import FileViewerModel from "./models/FileViewerModel";
import usePreventContextMenu from "../hooks/contextMenuEvent";
import LazyLoadingImage from "../lib/LazyLoadingImage";
import UploadDropdownOption from "./UploadDropdownOption";
import NotfoundMessage from "./NotFoundMessage";

export default function UploadItemsGridSection({
    title = "My Uploads",
    pageLoading,
    loading,
    uploadItems = [],
    reValidatePage,
    uploadOption = true,
    creatFile = true,
    creatFolder = true,
}) {

    const [fileView, setFileView] = useState({
        fileId: null,
        title: null,
        src: null,
        type: null
    });

    const [selectedFileIds, setSelectedFileIds] = useState([]);
    const [deleteConfirmModal , setDeleteConfirmModal] = useState(false);

    const deleteOptionContainerRef = useRef();

    const setBackdrop = backdropProgress();

    // Switch option handler
    const handleSwitch = (e) => {

        const element = document.querySelectorAll("#select-file-checkbox");
        element.forEach((checkbox) => checkbox.style.display = e.target.checked ? "block" : "none");
        deleteOptionContainerRef.current.style.display = e.target.checked ? "block" : "none"
        if (e.target.checked) {
            if (selectedFileIds.length > 0) {
                setSelectedFileIds([]);
                const element = document.querySelectorAll("#select-file-checkbox");
                element.forEach((checkbox) => checkbox.checked = false);
            }
        };
    };

    // check is selectAll is true or not 
    const isSelectAll = (uploadItems.length > 0 ? (selectedFileIds.length === uploadItems.filter(data => data.type !== 'folder').length ? true : false) : false);

    const updateCheckedAssetsIds = () => {
        const element = document.querySelectorAll("#select-file-checkbox");
        const checkedElementIds = [];
        element.forEach((checkbox) => {
            if (checkbox.checked) {
                checkedElementIds.push(checkbox.getAttribute("data-assetid"));
            }
        });
        setSelectedFileIds(checkedElementIds);
    }

    // Select and unselect file handler
    const handleSelectFile = useCallback((id) => {
        if (id === "all") {
            const element = document.querySelectorAll("#select-file-checkbox");
           
                element.forEach((checkbox) =>{
                if (checkbox && !checkbox.style.display && checkbox.style.display !== "block") {
                    checkbox.style.display = "block";
                }
            });

            if (!isSelectAll) {
                element.forEach((checkbox) => checkbox.checked = true);
                updateCheckedAssetsIds()
            } else {
                setSelectedFileIds([]);
                element.forEach((checkbox) => checkbox.checked = false);
            }
        } else {
            updateCheckedAssetsIds()
        }
    }, [selectedFileIds, uploadItems]);

    const functions = useMemo(() => ({
        setFileView,
        handleSelectFile
    }), [setFileView, handleSelectFile]);

    // Delete files handler
    const handleDeleteFile = async () => {
        setDeleteConfirmModal(false);
        try {
            if (selectedFileIds.length > 0) {
                setBackdrop(true);
                const { status } = await deleteFileFromServer(selectedFileIds);
                if (status === 200) {
                    reValidatePage({
                        type: 'deleteFile',
                        files: selectedFileIds
                    });
                    setSelectedFileIds([]);
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setBackdrop(false);
        }
    };

    const updatePage = (arg) => {
        reValidatePage(arg)
        updateCheckedAssetsIds();
    };

    if (loading && uploadItems.length === 0) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    };

    const isAllFolders = uploadItems?.every(item => item.type === 'folder');

    return (
        <>
            <div className={`w-full h-auto ${pageLoading ? 'hidden' : 'block'} py-1 px-3.5 small-screen:px-2.5 sticky top-[70px] z-20 bg-white border-b border-b-slate-100 shadow-sm`}>

                <div className="w-full h-auto flex justify-between items-center">
                    <div>
                        <h3 className="text-gray-900 text-baze small-screen:text-xs font-bold line-clamp-2">{title}</h3>
                        {uploadItems.length > 0 && creatFile && !isAllFolders && (
                            <>
                                <label htmlFor="edit-file-mode-switch" className="text-xs">Option mode</label>
                                <Switch id="edit-file-mode-switch" onChange={handleSwitch} size="small" />
                            </>
                        )}
                    </div>

                    {uploadOption && (
                        <UploadDropdownOption folderUpload={creatFolder} fileUpload={creatFile} reValidatePath={reValidatePage} />
                    )}
                </div>

                {uploadItems.length > 0 && !isAllFolders && (
                    <div ref={deleteOptionContainerRef} className="hidden my-2">
                        <div className="flex gap-2 items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <small className="text-gray-600 font-medium">
                                    <span className="text-blue-700 mr-1 font-semibold">{selectedFileIds.length}</span>
                                    {selectedFileIds.length > 1 ? "files" : "file "} select
                                </small>

                                {selectedFileIds.length > 0 && (
                                    <button
                                        onClick={()=> setDeleteConfirmModal(true)}
                                        type="button"
                                        className="text-red-600 mr-1 p-0.5"
                                    >
                                        <i className="bi bi-trash"></i>
                                        <span className="sr-only">Delete</span>
                                    </button>
                                )}
                            </div>
                            <div className="small-screen:mx-2 mx-5">
                                <label htmlFor="select-all-file" className="text-sm text-gray-900 font-medium mr-1.5">Select all</label>
                                <Checkbox onChange={() => handleSelectFile("all")} className="w-3 h-3" aria-label="select file" id="select-all-file" checked={isSelectAll} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {uploadItems.length > 0 ? (
                <div className="w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] small-screen:grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2 items-center my-2.5 px-2.5">
                    {uploadItems.map((data) => (
                        <Fragment key={data._id}>
                            {validateUploadFilesTypes(data.type) === "folder" && (
                                <div className="relative">
                                    <FolderCard id={data._id} name={data.name} />
                                </div>
                            )}
                            {validateUploadFilesTypes(data.type) === "image" && (
                                <div className="relative">
                                    <ImageCard
                                        data={data}
                                        functions={functions}
                                    />
                                    <div className="absolute right-0 top-0 z-10">
                                        <input type="checkbox" id="select-file-checkbox" data-assetid={data._id} onChange={() => handleSelectFile(data._id)} className="w-4 h-5 hidden cursor-pointer" aria-label="select file" />
                                    </div>
                                </div>
                            )}
                            {validateUploadFilesTypes(data.type) === "pdf" && (
                                <div className="relative">
                                    <PdfCard
                                        data={data}
                                        functions={functions}
                                    />
                                    <div className="absolute right-0 top-0 z-10">
                                        <input type="checkbox" id="select-file-checkbox" data-assetid={data._id} onChange={() => handleSelectFile(data._id)} className="w-4 h-5 hidden cursor-pointer" aria-label="select file" />
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    ))}
                </div>
            ) : (
                <NotfoundMessage message="You not upload anything" />
            )}
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
                reValidatePage={updatePage}
            />
            {/** Delete Confirm Model */}
            <Dialog
            open={deleteConfirmModal}
            onClose={() => setDeleteConfirmModal(false)}
        >
                    <div className="p-4">
                        <p className="text-gray-900 text-lg font-medium mb-4">
                            Are you sure you want to delete the selected file?
                        </p>
                        <div className="flex gap-2 space-x-4">
                            <button onClick={handleDeleteFile} className="text-red-600 mr-1 bg-red-100 px-2.5 py-2 rounded-md font-medium">
                                Delete
                            </button>
                            <button onClick={() => setDeleteConfirmModal(false)} className="text-gray-700 mr-1 bg-gray-300 px-2.5 py-2 rounded-md font-medium">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Dialog>
        </>
    );
}


const FolderCard = memo(({ id, name }) => {

    const navigate = useNavigate();

    const openFolder = () => {
        navigate(`/drive/folders/${id}`);
    };

    const folderCardRef = usePreventContextMenu(openFolder);

    return (
        <div ref={folderCardRef} onClick={openFolder} className="w-full max-w-42 h-28 p-1.5 rounded-md flex flex-col justify-center items-center cursor-pointer relative shadow-sm border border-slate-50">
            <i className="bi bi-folder-fill text-indigo-400 text-5xl"></i>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full">
                {name}
            </p>
            {/**<div className="w-auto h-auto px-1 bg-red-500 text-[10px] text-white text-center absolute right-1 top-1 rounded-sm">New</div>*/}
        </div>
    );
});

const ImageCard = memo(({ data, functions }) => {

    const { _id, name, extension, size, uploadLink } = data || {};
    const { setFileView } = functions;

    const fileViewSetup = () => {
        setFileView({ fileId: _id, title: name, src: uploadLink, type: "image" });
    };

    const imageCardRef = usePreventContextMenu(fileViewSetup);

    return (
        <div className="w-full h-fit min-h-32 bg-slate-50 border border-slate-200 rounded-sm flex flex-col justify-center items-center overflow-hidden px-1.5 py-2 relative">
            <div className="w-full h-fit aspect-[4/3] px-1 py-2 flex items-center" ref={imageCardRef} onClick={fileViewSetup}>
                <LazyLoadingImage
                    className="w-full h-auto max-h-60 max-w-40 mx-auto rounded-sm cursor-pointer"
                    actualSrc={uploadLink}
                    alt={name}
                />
            </div>
            <div className="text-[10px] text-gray-400 text-center my-1 flex items-center">
                <div>{size}</div>
                <i className="bi bi-dot"></i>
                <div>{extension}</div>
            </div>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full px-1.5">
                {name}
            </p>

        </div>
    );
});

const PdfCard = memo(({ data, functions }) => {

    const { _id, name, uploadLink, size, extension } = data || {};

    const { setFileView } = functions;

    const fileViewSetup = () => {
        setFileView({ fileId: _id, title: name, src: uploadLink, type: "pdf" });
    };

    const pdfCardRef = usePreventContextMenu(fileViewSetup);

    return (
        <div className="bg-slate-50 p-1.5 w-full max-w-42 h-auto rounded-md shadow-sm flex flex-col justify-center items-center relative px-1 py-1.5">
            <div className="text-red-600 text-5xl cursor-pointer">
                <i ref={pdfCardRef} onClick={fileViewSetup} className="bi bi-file-earmark-pdf-fill"></i>
            </div>
            <div className="text-[10px] text-gray-400 text-center my-1 flex items-center">
                <div>{size}</div>
                <i className="bi bi-dot"></i>
                <div>{extension}</div>
            </div>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full">
                {name}
            </p>
        </div>
    );
});
