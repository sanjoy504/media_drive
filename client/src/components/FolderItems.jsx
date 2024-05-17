import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import UploadItemsCard from "../components/Cards"
import { getClientUploadItems } from "../util/axiosHandler"
import UploadOption from "./UploadOption";
import { useInfiniteScroll } from "../lib/lib";


function FolderItems() {

    const { folderId } = useParams();

    const navigate = useNavigate();
    const [currentFolder, setCurrentFolder] = useState(null)
    const [uploadItems, setUploadItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isAllDataLoad, setIsAllDataLoad] = useState(false);

    const loadMore = () => setPage((prevPage) => prevPage + 1);

    const bottomObserverElement = useInfiniteScroll(loadMore, loading, isAllDataLoad);

    const reValidatePage = () => {
        setPage(1);
        setIsAllDataLoad(false);
        setUploadItems([]);
    }

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

                    if (page === 1) {
                        setUploadItems(data)
                    } else {
                        setUploadItems((prev) => [...prev, ...data]);
                    }
                    if (folderInfo) {
                        setCurrentFolder(folderInfo.name);
                    }
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
                <div className=" text-gray-900 text-xl small-screen:text-base font-bold">{currentFolder ? currentFolder : "My Uploads"}</div>
                <UploadOption reValidatePath={reValidatePage} />
            </div>

            <UploadItemsCard
                loading={loading}
                uploadItems={uploadItems}
                reValidatePage={reValidatePage} />

            <div ref={bottomObserverElement}></div>
        </>
    )
}

export default FolderItems;






