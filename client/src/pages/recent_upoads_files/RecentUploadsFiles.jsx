import { useEffect, useState } from "react";
import { getRecentUploadsFiles } from "../../util/axiosHandler"
import { useInfiniteScroll } from "../../lib/lib";
import UploadItemsGridSection from "../../components/UploadItemsGridSection"
import UploadOption from "../../components/UploadOption";

function RecentUploadsFiles() {

    const [uploadItems, setUploadItems] = useState([]);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isAllDataLoad, setIsAllDataLoad] = useState(false);

    const loadMore = () => setPage((prevPage) => prevPage + 1);

    const bottomObserverElement = useInfiniteScroll(loadMore, loading, isAllDataLoad);;

    const reValidatePage = () => {
        setPage(1);
        setIsAllDataLoad(false);
        setLoading(false);
        setUploadItems([]);
    }

    useEffect(() => {
        (async () => {

            try {

                setLoading(true);

                const { status, data, isDataEnd } = await getRecentUploadsFiles({
                    limit: 30,
                    skip: uploadItems.length
                });

                if (status === 200) {
                    if (page === 1) {
                        setUploadItems(data)
                    } else {
                        setUploadItems((prev) => [...prev, ...data]);
                    }
                };

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

    return (
        <>
            <div className="mx-2.5">
                <UploadItemsGridSection
                    title="Recent files"
                    pageLoading={page === 1 && loading ? true : false}
                    loading={loading}
                    uploadItems={uploadItems}
                    reValidatePage={reValidatePage} />
            </div>

            <div ref={bottomObserverElement}></div>
        </>
    )
}

export default RecentUploadsFiles;




