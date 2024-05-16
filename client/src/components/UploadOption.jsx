

import { useRef, useState } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import AddFolderModel from './models/AddFolderModel';
import UploadFileModel from './models/UploadFileModel';

export default function UploadOption({ buttonText = "Add new", reValidatePath }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const [openFolderModel, setOpenFolderModel] = useState(false);

    const [openFileModel, setOpenFileModel] = useState(false);


    const fileRef = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Button aria-describedby={id} variant="contained" className="flex gap-1 h-8" onClick={handleClick}>
                <i className="bi bi-plus text-xl"></i>
                <span className="capitalize text-sm">{buttonText}</span>
            </Button>
            <Popover
                className="my-2"
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >

                <div className="px-3 py-2 flex flex-col space-y-2">

                    <button
                        onClick={() => setOpenFileModel(true)}
                        type="button"
                        className="flex gap-2 text-gray-600 text-base">
                        <i className="bi bi-file-plus"></i>
                        <span>Add file</span>
                    </button>

                    <input ref={fileRef} type="file" name="file" className="hidden" />

                    <button onClick={() => setOpenFolderModel(true)} type="button" className="flex gap-2 text-gray-600 text-base">
                        <i className="bi bi-folder-plus"></i>
                        <span>New folder</span>
                    </button>
                </div>
            </Popover>

            <AddFolderModel 
            isOpen={openFolderModel} 
            setOpen={setOpenFolderModel} 
            reValidatePath={reValidatePath}
            />

            <UploadFileModel 
            isOpen={openFileModel} 
            setOpen={setOpenFileModel}
            reValidatePath={reValidatePath}
             />
        </>
    );
}

