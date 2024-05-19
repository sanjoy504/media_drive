import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { CircularProgress } from "@mui/material";
import { validateUploadFilesTypes } from "../util/utils"
import FileViewerModel from "./models/FileViewerModel"
import usePreventContextMenu from "../hooks/contextMenuEvent";
import LazyLoadingImage from "../lib/LazyLoadingImage";


export default function UploadItemsCards({ loading, uploadItems, reValidatePage }) {

    const [fileView, setFileView] = useState({
        fileId: null,
        title: null,
        src: null,
        type: null
    });

    if (!uploadItems) {
        return null
    };

    if (loading && uploadItems?.length === 0) {
        return (
            <div className="w-full min-h-[70vh] flex justify-center items-center">
                <CircularProgress />
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] small-screen:grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2 my-2.5">

                {uploadItems.map((data) => (
                    <Fragment key={data._id}>
                        {validateUploadFilesTypes(data.type) === "folder" && (
                            <FolderCard id={data._id} name={data.name} />
                        )}
                        {validateUploadFilesTypes(data.type) === "image" && (<ImageCard
                            id={data._id}
                            src={data.uploadLink}
                            alt={data.name}
                            handleSetFileView={setFileView}
                        />)}
                        {validateUploadFilesTypes(data.type) === "pdf" && (<PdfCard
                            id={data._id}
                            name={data.name}
                            pdfLink={data.uploadLink}
                            handleSetFileView={setFileView}
                        />)}
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
    )
}

function FolderCard({ id, name }) {

    return (
        <Link to={`/uploads/${id}`} className="bg-slate-50 p-1 w-full max-w-40 h-28 rounded-md shadow-sm flex flex-col justify-center items-center">
            <i className="bi bi-folder-fill text-indigo-400 text-5xl"></i>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full">
                {name}
            </p>
        </Link>

    )
};

function ImageCard({ id, src, alt, handleSetFileView }) {

    const fileViewSetup = () => {
        handleSetFileView({ fileId: id, title: alt, src, type: "image" })
    }

    const imageCardRef = usePreventContextMenu(fileViewSetup);

    return (
        <div ref={imageCardRef} onClick={fileViewSetup} className="w-full h-full max-w-40 min-h-20 bg-slate-50 border border-slate-200 rounded-sm flex flex-col justify-center items-center cursor-pointer p-1 overflow-hidden">

            <LazyLoadingImage
                className="w-full max-w-16 h-auto max-h-12 rounded-sm"
                actualSrc={src}
                alt={alt}
            />

            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full mt-1.5">
                {alt}
            </p>
        </div>
    )
};

function PdfCard({ id, name, pdfLink, handleSetFileView }) {

    const fileViewSetup = () => {
        handleSetFileView({ fileId: id, title: name, src: pdfLink, type: "pdf" });
    };

    const pdfCardRef = usePreventContextMenu(fileViewSetup);

    return (

        <div ref={pdfCardRef} onClick={fileViewSetup} className="bg-slate-50 p-1 w-full max-w-40 h-28 rounded-md shadow-sm flex flex-col justify-center items-center cursor-pointer">
            <i className="bi bi-file-earmark-pdf-fill text-red-600 text-5xl"></i>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full mt-1.5">
                {name}
            </p>
        </div>

    )
};


