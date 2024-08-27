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
import { Box, LinearProgress } from '@mui/material';
import { environmentVariables } from '../../helper/helper';


const AddFolderModel = memo(({ isOpen, setOpen, reValidatePath }) => {

    const { folderId } = useParams();

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);
    const [progress, setProgress] = useState(false);

    const handleClose = () => {
        setOpen(false);
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    const handleOnInputChange = () => {
        if (errorMessage) {
            setErrorMessage(null);
        }

    }
    const handleSubmit = async (event) => {

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const folderName = formJson.foldername?.trim();

        if (!folderName) {
            setErrorMessage('Folder name is required');
            return;
        } else if (folderName.length > 30) {
            setErrorMessage('Folder name is to large plese make it under 30 characters');
            return;
        };
        const payload = {
            folderName,
            folderId
        };

        if (folderId) {
            payload.folderId = folderId;
        }
        try {

            setProgress(true);

            const api = axios.create({
                baseURL: environmentVariables.backendUrls.render,
                withCredentials: true
            });

            const response = await api.post('/user/upload/folder', payload);

            if (response.status === 200) {

                handleClose();

                if (pathname === '/') {

                    navigate('/drive/folders');
                } else {
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
        } finally {
            setProgress(false)
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

                {progress ? (
                    <Box sx={{ width: '100%', minWidth: '220px' }}>
                        <div className="flex justify-center my-2 ">
                            <small>Uploading...</small>
                        </div>
                        <LinearProgress />
                    </Box>
                ) : (
                    <>
                        <DialogContentText className="max-w-80">
                            Folder name must be under 30 characters
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
                            onChange={handleOnInputChange}
                        />

                    </>
                )}

            </DialogContent>

            {!progress && (
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Creat</Button>
                </DialogActions>
            )}
        </Dialog>
    );
})

export default AddFolderModel;

