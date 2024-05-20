
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"
import { toggleSidebar } from "../util/utils";
import DropdownProfile from "../components/DropdownProfile";


function SideBar() {

    const { pathname } = useLocation();

    const navLinks = [{
        name: "My uploads",
        path: "/uploads",
        icon: "bi bi-folder-fill"
    },
    {
        name: "Storage",
        path: "/storage",
        icon: "bi bi-cloud-fill"
    },
    {
        name: "Recent files",
        path: "/recent-files",
        icon: "bi bi-clock-history"
    },
    ];


    useEffect(() => {
        if (pathname !== "/" && window.innerWidth <=800) {
            toggleSidebar('hide')
        }
    }, [toggleSidebar, pathname]);

    return (
        <div id="sidebar" className="w-64 small-screen:fixed small-screen:-translate-x-full h-screen top-0 left-0 z-50 bg-white border-r border-r-slate-300 py-2 transition-all duration-300 ease-in-out">
            <div className="px-2.5 flex justify-between items-center">

                <DropdownProfile />
                <button onClick={toggleSidebar} type="button" className="hidden small-screen:block hover:bg-gray-100 w-7 h-7 rounded-md">
                    <i className="bi bi-x-lg text-gray-700"></i>
                </button>
            </div>

            <div className="flex flex-col py-3 space-y-2 hover:text-gray-900 text-gray-700">

                {navLinks.map((data, index) => (

                    <NavLink
                        key={index + 1}
                        end
                        to={data.path}
                        className={({ isActive }) =>
                            'py-2 px-2.5 block transition duration-150 truncate text-sm' +
                            (isActive ? 'text-gray-900 bg-blue-50' : 'text-slate-700 hover:text-slate-600')
                        }
                    >
                        <div className="flex items-center space-x-2">
                            {data.icon && <i className={data.icon + " text-xl"}></i>}
                            <div>{data.name}</div>
                        </div>
                    </NavLink>
                ))}

            </div>
        </div>
    )
}

export default SideBar
