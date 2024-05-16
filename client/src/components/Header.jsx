import { useRef } from "react"
import { useSearchParams } from "react-router-dom";
import { toggleSidebar } from "../util/utils";

function Header() {

  return (
    <header className="sticky top-0 bg-white border-b border-b-slate-200 px-5 py-4">

      <div className="flex gap-3 items-center justify-between">

        <SearchBar />

        <button onClick={toggleSidebar} className="text-gray-900 text-2xl font-bold small-screen:block hidden">
        <i className="bi bi-list"></i>
        <span className="sr-only">Toggle sidebar</span>
        </button>

      </div>
    </header>
  )
}

export default Header;


function SearchBar() {

  const inputRef = useRef(null);

  const [_, setSearchParams] = useSearchParams();

  const search = () => {

    const trimQuery = inputRef.current.value?.trim();

    if (trimQuery !== "") {

       setSearchParams({ search: trimQuery }, { replace: true });
    }
 };

  return (
    <div className="small-screen:w-full w-auto h-auto flex justify-center px-3">
      
      <div className="sticky top-0 w-full">
        <div className="relative">
          <label htmlFor="Search" className="sr-only"> Search </label>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search folders photos files"
            className="small-screen:w-full w-96 rounded-md border border-gray-200 py-2.5 px-4 shadow-sm sm:text-xs outline-none focus:border-blue-500"
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center border-l">
            <button
              onClick={search}
              type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
