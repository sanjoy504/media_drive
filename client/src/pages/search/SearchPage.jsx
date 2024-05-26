import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { environmentVariables } from "../../helper/helper";
import { useInfiniteScroll } from "../../lib/lib";
import NotfoundMessages from "../../components/messages/NotfoundMessages";
import UploadItemsGridSection from "../../components/UploadItemsGridSection";
import { Helmet } from "react-helmet-async";

function SearchPage() {

  const [searchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get('q') || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isAllDataLoad, setIsAllDataLoad] = useState(false);

  const reValidatePage = () => {
    setPage(1);
    setIsAllDataLoad(false);
    setUploadItems([]);
}


  useEffect(() => {
    setSearchQuery(initialSearchQuery);

    if (!initialSearchQuery !== "") {
      setSearchData([]);
      setPage(1);
      setIsAllDataLoad(false);
    }
  }, [initialSearchQuery]);

  const loadMore = () => setPage((prevPage) => prevPage + 1);

  const observerElement = useInfiniteScroll(loadMore, loading, isAllDataLoad);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (!searchQuery) return;

      try {
        setLoading(true);
        const api = axios.create({
          baseURL: environmentVariables.backendUrl,
          withCredentials: true,
        });

        const response = await api.post('/user/search', {
          query: searchQuery,
          limit: 30,
          skip: searchData.length,
        });

        if (response.status === 200) {
          const { uploadItems, endOfData } = response.data;
          setSearchData((prev) => [...prev, ...uploadItems]);
          if (endOfData) setIsAllDataLoad(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchData();
  }, [page, searchQuery]);

  return (
    <>
<Helmet>
  <title>
    Media Drive | Search
  </title>
</Helmet>
      {loading && searchData.length === 0 && (
        <div className="w-full h-full flex justify-center items-center my-5">
          <CircularProgress />
        </div>
      )}

      {!loading && searchQuery !== "" && searchData.length > 0 && (
        <UploadItemsGridSection
        title={`Result for: ${searchQuery}`}
        pageLoading={page === 1 && loading ? true : false}
        loading={loading}
        uploadItems={searchData}
        reValidatePage={reValidatePage} 
        uploadOption={false}
        />
      )}

      {!loading && searchQuery !== "" && searchData.length === 0 && (
       <NotfoundMessages message="Not upload items found for this search" />
      )}

      <div ref={observerElement}></div>
    </>
  );
}

export default SearchPage;
