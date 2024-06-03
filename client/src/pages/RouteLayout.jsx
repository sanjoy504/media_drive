import { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

//Login page component
const LoginPage = lazy(() => import("./login/LoginPage"));

//Home page component
const Home = lazy(() => import("./home/Home"));

/**** Folders Layout/Folders items Page Component *****/
const FoldersLayout = lazy(() => import("./folders_layout/FoldersLayout"));

//Recent uploads files route
const RecentUploadsFiles = lazy(() => import("./recent_upoads_files/RecentUploadsFiles"));

//Storage page route
const StoragePage = lazy(() => import("./storage/StoragePage"));

//Search page route
const SearchPage = lazy(() => import("./search/SearchPage"));

function RouteLayout() {
    return (
        <Suspense>
            <Routes>
                <Route exact path="/" element={<Home />} />

                <Route exact path="/drive/folders/:folderId" element={<FoldersLayout />} />
    
                <Route exact path="/drive/recent-files" element={<RecentUploadsFiles />} />
                <Route exact path="/storage" element={<StoragePage />} />

                <Route exact path="/search" element={<SearchPage />} />

                <Route exact path="/login" element={<LoginPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    )
}

export default RouteLayout
