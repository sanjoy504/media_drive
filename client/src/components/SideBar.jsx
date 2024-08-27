
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom"
import { toggleSidebar } from "../util/utils";
import DropdownProfile from "../components/DropdownProfile";


function SideBar() {

    const { pathname } = useLocation();

    const navLinks = [{
        name: "My Folders",
        path: "/drive/folders/indexfolders",
        icon: "bi bi-folder-fill"
    },
    {
        name: "My Photos",
        path: "/drive/uploads/photos",
        icon: "bi bi-images"
    },
    {
        name: "My Files",
        path: "/drive/uploads/files",
        icon: "bi bi-files"
    },
    {
        name: "Recent",
        path: "/drive/recent-files",
        icon: "bi bi-clock-history"
    },
    {
        name: "Storage details",
        path: "/storage",
        icon: "bi bi-cloud-fill"
    },
    ];


    useEffect(() => {
        if (pathname !== "/" && window.innerWidth <= 800) {
            toggleSidebar('hide')
        }
    }, [toggleSidebar, pathname]);

    return (
        <div onClick={() => toggleSidebar('hide')} id="sidebar" className="small-screen:w-full w-fit h-full bg-white bg-opacity-20 small-screen:fixed small-screen:-translate-x-full top-0 left-0 z-50 transition-all duration-300 ease-in-out">
            <div onClick={(e) => e.stopPropagation()} className="w-64 h-screen bg-white border-r border-r-slate-200 py-2">
                <div className="px-2.5 flex justify-between items-center">

                    <DropdownProfile />
                    <button onClick={toggleSidebar} type="button" className="hidden small-screen:block hover:bg-gray-100 w-7 h-7 rounded-md">
                        <i className="bi bi-x-lg text-gray-700"></i>
                    </button>
                </div>

                <div className="flex flex-col py-3 space-y-2 hover:text-gray-900 text-gray-700 relative">

                    {navLinks.map((data, index) => (

                        <Link
                            key={index + 1}
                            to={data.path}
                            className={`py-2 px-2.5 ml-1 block transition duration-150 truncate text-sm ${pathname.startsWith(data.path) || pathname === data.path ? 'text-blue-600 border-l-2 border-blue-700' : 'text-slate-600'}`}
                        >
                            <div className="flex items-center space-x-2">
                                {data.icon && <i className={data.icon + " text-xl"}></i>}
                                <div>{data.name}</div>
                            </div>
                        </Link>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default SideBar
