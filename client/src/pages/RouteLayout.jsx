import { Suspense, lazy } from "react"
import { Route, Routes } from "react-router-dom"

//Home page component
const Home = lazy(() => import("./home/Home"));

/**** Folders Route All Layout Component *****/
const DriveLayout = lazy(() => import("./uploads_layout/DriveLayout"));
const UploadHome = lazy(() => import("./uploads_layout/UploadHome"));
const UploadItems = lazy(() => import("./uploads_layout/UploadItems"));

//Recent uploads files route
const RecentUploadsFiles = lazy(() => import("./recent_upoads_files/RecentUploadsFiles"));

//Storage page route
const StoragePage = lazy(() => import("./storage/StoragePage"));

function RouteLayout() {
    return (
        <Suspense>
            <Routes>
                <Route exact path="/" element={<Home />} />

                <Route exact path="/uploads" element={<DriveLayout />} >
                    <Route index element={<UploadHome />} />
                    <Route exact path="/uploads/:folderId" element={<UploadItems />} />
                </Route>
                <Route exact path="/recent-files" element={<RecentUploadsFiles />} />
                <Route exact path="/storage" element={<StoragePage />} />

                <Route path="*" element={<h1>No content</h1>} />
            </Routes>
        </Suspense>
    )
}

export default RouteLayout
