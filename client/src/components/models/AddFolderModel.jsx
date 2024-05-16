import { memo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { environmentVariables } from '../../helper/helper';

const AddFolderModel = memo(({ isOpen, setOpen, reValidatePath }) => {

    const { folderId } = useParams();

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null)

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const folderName = formJson.foldername;

        const payload = {
            userId: '6612728ad3fd6ef24ad97703',
            folderName,
            folderId
        };

        if (folderId) {
            payload.folderId = folderId;
        }
        try {

            const api = axios.create({
                baseURL: environmentVariables.backendUrl,
                withCredentials: true
            });

            const response = await api.post('/upload/folder', payload);

            if (response.status === 200) {

                handleClose();

                if (pathname === '/') {
                  
                    navigate('/uploads');
                }else{
                    reValidatePath(); 
                }

            } else {
                setErrorMessage(response.data.message)
            }
        } catch (error) {
            console.error('Error occurred:', error);

            if (error.response) {
                setErrorMessage(error.response.data.message)
            }
        }
    };


    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
            }}
        >
            <DialogTitle>Add new folder</DialogTitle>
            <DialogContent>
                {errorMessage && (
                    <p className="text-xs text-red-700">{errorMessage}</p>
                )}
                <DialogContentText>
                    Please provide your folder name and create
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="foldername"
                    name="foldername"
                    label="Folder name"
                    type="text"
                    fullWidth
                    variant="standard"
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
        </Dialog>
    );
})

export default AddFolderModel;

