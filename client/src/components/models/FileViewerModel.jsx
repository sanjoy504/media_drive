import { deleteFileFromServer } from "../../util/axiosHandler";
import { downloadImageAndPdf } from "../../util/utils";

function FileViewerModel({ fileId, title, src, type, handleSetFileView, reValidatePage }) {

    if (!src || !type || !fileId) {
        return null;
    }

    const handleBackgroundClick = () => {
        handleSetFileView({ fileId: null, name: null, src: null, type: null });
    };

    const handleChildClick = (event) => {
        event.stopPropagation();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Media cloud ${type} share`,
                text: `See media cloud upload ${type} you can also download it.`,
                url: src,
            })
        }
    };

    //Delete file
    const handleDeleteFile = async () => {
        try {
            const delteStatus = await deleteFileFromServer(fileId);

            if (delteStatus === 200) {
                reValidatePage()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div onClick={handleBackgroundClick} className="w-full h-full fixed top-0 left-0 z-50 bg-gray-950 bg-opacity-75 flex items-center justify-center">
            <div onClick={handleChildClick} className="w-fit h-fit max-w-96 max-h-[600px] flex flex-col space-y-4 items-center bg-white p-4 rounded-sm mx-2">
                {type === "image" ? (
                    <img className="w-full h-full rounded-sm max-w-96 max-h-[600px]" src={src} alt={title} />
                ) : (
                    <iframe className="w-full max-w-[350] h-96 overflow-x-hidden" src={src} title="PDF Preview" />
                )}

            </div>
            <div className="flex gap-4 absolute top-4 right-3">
                <button onClick={handleDeleteFile} type="button" className="bg-transparent text-white">
                    <i className="bi bi-trash text-base"></i> Delete
                </button>

                <button onClick={(event) => { handleChildClick(event); handleShare() }} type="button" className="bg-transparent text-white">
                    <i className="bi bi-share text-base"></i> Share
                </button>

                <button onClick={(event) => { handleChildClick(event); downloadImageAndPdf(src, title); }} type="button" className="bg-transparent text-white">
                    <i className="bi bi-download text-base"></i> Download
                </button>
            </div>
        </div>
    );
}

export default FileViewerModel;
