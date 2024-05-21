import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UploadItemsCard from "../components/Cards"
import { getClientUploadItems } from "../util/axiosHandler"
import UploadOption from "./UploadOption";
import { useInfiniteScroll } from "../lib/lib";
import NotfoundMessages from "./messages/NotfoundMessages";


function FolderItems() {

    const { folderId } = useParams();

    //All states
    const [currentFolder, setCurrentFolder] = useState("My Uploads");
    const [uploadItems, setUploadItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isAllDataLoad, setIsAllDataLoad] = useState(false);
    const [error, setError] = useState(null);

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

                const { status, data, isDataEnd, folderInfo, message } = await getClientUploadItems({
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

                if (status === 400 && folderId && !folderInfo) {
                    setError(message)
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

    }, [page]);

    useEffect(() => {
        reValidatePage();
    }, [folderId]);

    if (error) {
        return (
            <NotfoundMessages message={error} />
        )
    }

    return (
        <>
            <div className={`w-full h-auto ${loading && page === 1 ? "hidden" : "block"} flex justify-between items-center py-2 px-3.5 small-screen:px-2 sticky top-[70px] z-20 border-b bg-white border-b-slate-100  shadow-sm`}>
                <h2 className="text-gray-900 text-base small-screen:text-sm font-bold mr-3">{currentFolder}</h2>
                <UploadOption reValidatePath={reValidatePage} />
            </div>

            <div className="mx-2.5">
                <UploadItemsCard
                    loading={loading}
                    uploadItems={uploadItems}
                    reValidatePage={reValidatePage} />
            </div>

            <div ref={bottomObserverElement}></div>
        </>
    )
}

export default FolderItems;






