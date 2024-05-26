import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClientFolderItems } from "../util/axiosHandler"
import { useInfiniteScroll } from "../lib/lib";
import NotfoundMessages from "./messages/NotfoundMessages";
import UploadItemsGridSection from "./UploadItemsGridSection";

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

    const reValidatePage = (arg) => {
        
        // check if validate page for delete so dont call backend just update upload items state
        if (arg && arg.type === 'deleteFile') {
             // Filter out the deleted items
             const updatedUploadItems = uploadItems.filter(item => !arg.files?.includes(item._id));
             // Update the state with the new list of items
             setUploadItems(updatedUploadItems);
        }else{
            setPage(1);
            setIsAllDataLoad(false);
            setUploadItems([]);
        }
    };

    useEffect(() => {
        (async () => {

            try {

                setLoading(true);

                const { status, data, isDataEnd, folderInfo, message } = await getClientFolderItems({
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
                <UploadItemsGridSection
                    title={currentFolder}
                    pageLoading={page === 1 && loading ? true : false}
                    loading={loading}
                    uploadItems={uploadItems}
                    reValidatePage={reValidatePage}
                    creatFolder={true}
                />

            <div ref={bottomObserverElement}></div>
        </>
    )
}

export default FolderItems;






