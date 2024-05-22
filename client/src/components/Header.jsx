import { toggleSidebar } from "../util/utils";
import SearchBar from "./SearchBar";


function Header() {

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-b-slate-200 px-5 py-4">

      <div className="flex gap-3 items-center justify-between">

        <button onClick={toggleSidebar} className="text-gray-900 text-2xl font-bold small-screen:block hidden">
          <i className="bi bi-list"></i>
          <span className="sr-only">Toggle sidebar</span>
        </button>
        <SearchBar />
      </div>
    </header>
  )
}

export default Header;