import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { getRecentUploadsFiles } from "../../util/axiosHandler"
import { useInfiniteScroll } from "../../lib/lib";
import UploadItemsCards from "../../components/Cards"
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
            <div className="w-full h-auto flex justify-between items-center py-2 px-5 small-screen:px-3 sticky top-[70px] z-20 bg-white border-b border-b-slate-100">
                <div className=" text-gray-900 text-xl small-screen:text-base font-bold">Recent files</div>
                <UploadOption reValidatePath={reValidatePage} />
            </div>

            <UploadItemsCards 
            loading={loading}
            uploadItems={uploadItems} 
            reValidatePage={reValidatePage} />

            <div ref={bottomObserverElement}></div>
        </>
    )
}

export default RecentUploadsFiles;




