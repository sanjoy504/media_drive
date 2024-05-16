import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { validateUploadFilesTypes } from "../util/utils"
import FileViewerModel from "./models/FileViewerModel"

export default function UploadItemsCard({ uploadItems }) {

    const [fileView, setFileView] = useState({
        title: null,
        src: null,
        type: null
    });

    if (!uploadItems) {
        return null
    };

    return (
        <>
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

            <FileViewerModel
                title={fileView.title}
                src={fileView.src}
                type={fileView.type}
                handleSetFileView={setFileView} />
        </>
    )
}

function FolderCard({ id, name }) {

    return (
        <Link to={`/uploads/${id}`} className="bg-slate-50 p-1.5 w-full h-28 rounded-md shadow-sm flex flex-col justify-center items-center">
            <i className="bi bi-folder-fill text-indigo-400 text-5xl"></i>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full">
                {name}
            </p>
        </Link>

    )
};

function ImageCard({ id, src, alt, handleSetFileView }) {

    return (
        <div onClick={() => handleSetFileView({ title: alt, src, type: "image" })} className="w-full h-full min-h-20 bg-slate-50 border border-slate-200 rounded-sm flex flex-col justify-center items-center cursor-pointer p-2 overflow-hidden">
            <img className="w-full max-w-16 h-auto max-h-12 rounded-sm" src={src} alt={alt} />
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full">
                {alt}
            </p>
        </div>
    )
};

function PdfCard({ id, name, pdfLink, handleSetFileView }) {

    return (

        <div onClick={() => handleSetFileView({ title: name, src: pdfLink, type: "pdf" })} className="bg-slate-50 p-1.5 w-full h-28 rounded-md shadow-sm flex flex-col justify-center items-center cursor-pointer">
            <i className="bi bi-file-earmark-pdf-fill text-red-600 text-5xl"></i>
            <p className="text-[10px] text-gray-800 font-medium text-center line-clamp-2 break-all w-full">
                {name}
            </p>
        </div>

    )
};


