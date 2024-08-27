import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { getUploadFiles } from "../../util/axiosHandler"
import { useInfiniteScroll } from "../../lib/lib";
import UploadItemsGridSection from "../../components/UploadItemsGridSection"

export default function MyPhotos() {

    const { type } = useParams();
    const navigate = useNavigate();

    const [uploadItems, setUploadItems] = useState([]);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isAllDataLoad, setIsAllDataLoad] = useState(false);

    const loadMore = () => setPage((prevPage) => prevPage + 1);

    const bottomObserverElement = useInfiniteScroll(loadMore, loading, isAllDataLoad);;

    const reValidatePage = (arg) => {

        // check if validate page for delete so dont call backend just update upload items state
        if (arg && arg.type === 'deleteFile') {
            // Filter out the deleted items
            const updatedUploadItems = uploadItems.filter(item => !arg.files?.includes(item._id));
            // Update the state with the new list of items
            setUploadItems(updatedUploadItems);
        } else {
            setPage(1);
            setIsAllDataLoad(false);
            setUploadItems([]);
        }
    };

    const fetchUploadItems = useCallback(async (skip) => {
        const filterOutTypes = type === 'photos' ? "Image" : type === 'files' ? "application" : null;
        if (filterOutTypes !=="Image" && filterOutTypes !=="application") {
            navigate('/', {
                replace: true,
            })
        }
        try {

            setLoading(true);

            const { status, data, isDataEnd } = await getUploadFiles({
                limit: 30,
                skip,
                type: filterOutTypes

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

    }, [type, page]);

    useEffect(() => {
        if (page > 1 && uploadItems.length > 0) {
            fetchUploadItems(uploadItems.length);
        }

    }, [page]);

    useEffect(() => {
        if (uploadItems.length !== 0) {
            setUploadItems([]);
        }

        if (page !== 1) {
            setPage(1)
        }
        if (isAllDataLoad) {
            setIsAllDataLoad(false);
        };
        fetchUploadItems(0);

    }, [type]);

    return (
        <>
            <Helmet>
                <title>Media Drive | My {type}</title>
            </Helmet>
            <UploadItemsGridSection
                title={`My ${type}`}
                pageLoading={page === 1 && loading ? true : false}
                loading={loading}
                uploadItems={uploadItems}
                creatFolder={false}
                reValidatePage={reValidatePage}
            />

            <div ref={bottomObserverElement}></div>
        </>
    )
}




