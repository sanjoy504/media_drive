import { Helmet } from "react-helmet-async";
import FolderItems from "../../components/FolderItems"

function UploadFoldersItems() {

    return (
        <>
            <Helmet>
                <title>Media Drive | Folder items</title>
            </Helmet>
            <FolderItems />
        </>
    )
}
export default UploadFoldersItems;
