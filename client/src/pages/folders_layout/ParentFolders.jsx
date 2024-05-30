import { Helmet } from "react-helmet-async";
import FolderItems from "../../components/FolderItems";

function ParentFolders() {

    return (
        <>
            <Helmet>
                <title>Media Drive | My Folders</title>
            </Helmet>
            <FolderItems />
        </>
    )
}

export default ParentFolders;

