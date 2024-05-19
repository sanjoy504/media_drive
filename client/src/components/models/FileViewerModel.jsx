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
            <div className={`${type === "image" ? "bg-transparent": "bg-white"} w-fit h-fit max-w-96 max-h-[500px] small-screen:max-h-[450px] flex flex-col space-y-4 items-center justify-center rounded-sm mx-2 p-3`}>
                {type === "image" ? (
                    <img className="w-full h-full rounded-sm overflow-hidden select-none pointer-events-none" src={src} alt={title} />
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
