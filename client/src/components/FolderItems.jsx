import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import UploadItemsCard from "../components/Cards"
import { getClientUploadItems } from "../util/axiosHandler"
import UploadOption from "./UploadOption";
import FileViewerModel from "./models/FileViewerModel";


function FolderItems() {

    const { folderId } = useParams();

    const navigate = useNavigate();

    const [uploadItems, setUploadItems] = useState([]);
   
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isAllDataLoad, setIsAllDataLoad] = useState(false);

    const bottomObserverElement = useRef(null);

    const reValidatePage = () => {
        setPage(1);
        setIsAllDataLoad(false);
        setLoading(false);
        setUploadItems([]);
    }

    const handleObservers = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !isAllDataLoad) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, isAllDataLoad]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObservers, {
            root: null,
            rootMargin: "10px",
            threshold: 1.0,
        });

        if (bottomObserverElement.current) {
            observer.observe(bottomObserverElement.current);
        }

        return () => {
            if (bottomObserverElement.current) {
                observer.unobserve(bottomObserverElement.current);
            }
        };
    }, [handleObservers]);

    useEffect(() => {
        (async () => {

            try {

                   setLoading(true);

                    const { status, data, isDataEnd, folderInfo } = await getClientUploadItems({
                        folder: folderId,
                        limit: 30,
                        skip: uploadItems.length
                    });

                    if (status === 200) {
                        setUploadItems(data);
                    };

                    if (status === 400 || folderId && !folderInfo) {
                        navigate(-1);
                    }
                    if (isDataEnd) {
                        setIsAllDataLoad(true);
                    };

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })()

    }, [folderId, page]);

    return (
        <>
            <div className="w-full h-auto flex justify-between items-center py-2 px-5 small-screen:px-3 sticky top-[70px] z-20 bg-white border-b border-b-slate-100">
                <div className=" text-gray-900 text-xl small-screen:text-base font-bold">My Uploads</div>
                <UploadOption reValidatePath={reValidatePage} />
            </div>

            <div className="w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] small-screen:grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-5 px-3 my-2.5">

                {loading && (
                    <div className="ml-auto mr-auto block my-24">
                        <CircularProgress />
                    </div>
                )}

                {!loading && uploadItems.length > 0 &&(
                    <UploadItemsCard uploadItems={uploadItems} />
                )}

                {loading && uploadItems.length > 0 && (
                    <div className="w-full h-full flex justify-center items-center my-5">
                        <CircularProgress />
                    </div>
                )}
                <div ref={bottomObserverElement}></div>
            </div>

        </>
    )
}

export default FolderItems;






