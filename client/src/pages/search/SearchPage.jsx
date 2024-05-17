import documentNotFoundImage from "../../assets/images/documents-notfound.png"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import UploadItemsCard from "../../components/Cards";
import { environmentVariables } from "../../helper/helper";
import { useInfiniteScroll } from "../../lib/lib";


function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isAllDataLoad, setIsAllDataLoad] = useState(false);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);

    if (!initialSearchQuery?.trim() !=="") {
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

        const response = await api.post('/search', {
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
    <div className="w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] small-screen:grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-5 px-3 my-2.5">
      {loading && searchData.length === 0 && (
        <div className="ml-auto mr-auto block my-24">
          <CircularProgress />
        </div>
      )}

      {!loading && searchData.length > 0 && (
        <UploadItemsCard uploadItems={searchData} />
      )}

      {loading && searchData.length > 0 && (
        <div className="w-full h-full flex justify-center items-center my-5">
          <CircularProgress />
        </div>
      )}

      <div ref={observerElement}></div>
    </div>

    {!loading && searchQuery!=="" && searchData.length === 0 &&(
        <div className="w-full my-20">
            <img className="w-52 h-52 small-screen:w-40 small-screen:h-40 block ml-auto mr-auto" src={documentNotFoundImage} alt="No document found" />
            <h2 className="text-gray-600 text-2xl small-screen:text-xl font-semibold text-center">No upload items found for this search</h2>
        </div>
      )}
    </>
  );
}

export default SearchPage;
