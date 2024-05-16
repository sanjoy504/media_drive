import { downloadImageAndPdf } from "../../util/utils";

function FileViewerModel({ title, src, type, handleSetFileView }) {

    if (!src || !type) {
        return null;
    }

    const handleBackgroundClick = () => {
        handleSetFileView({ name: null, src: null, type: null });
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

    return (
        <div onClick={handleBackgroundClick} className="w-full h-full fixed top-0 left-0 z-50 bg-gray-950 bg-opacity-75 flex items-center justify-center">
            <div onClick={handleChildClick} className="w-fit h-fit max-w-96 flex flex-col space-y-4 items-center bg-white p-4 rounded-sm mx-2">
                {type === "image" ? (
                    <img className="w-full h-full rounded-sm" src={src} alt={title} />
                ) : (
                    <iframe className="w-full h-96 overflow-x-hidden" src={src} title="PDF Preview" />
                )}
                
            </div>
            <div className="flex gap-4 absolute top-4 right-3">
            <button onClick={(event) => { handleChildClick(event); handleShare()}} type="button" className="bg-transparent text-white">
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
