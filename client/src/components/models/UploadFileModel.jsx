import { useState, memo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material';
import { environmentVariables } from '../../helper/helper';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const UploadFileModel = memo(({ isOpen, setOpen, reValidatePath }) => {

    const { folderId } = useParams();

    const { pathname } = useLocation();

    const navigate = useNavigate();

    const [progress, setProgress] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
    
        if (folderId) {
            formData.append('folderId', folderId); // Add folder id to FormData   
        }

        //const formJson = Object.fromEntries(formData.entries());

        try {
            setProgress(true);

            const api = axios.create({
                baseURL: environmentVariables.backendUrl,
                withCredentials: true
            });

            const response = await api.post('/upload/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {

                handleClose();

                if (pathname === '/') {
                  
                    navigate('/uploads');
                }else{
                    reValidatePath(); 
                }
                
            }
        } catch (error) {
            console.error('Error occurred:', error);
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
            <DialogTitle>Upload file</DialogTitle>

            <DialogContent>

                {progress ? (
                    <Box sx={{ width: '100%', minWidth: '220px' }}>
                        <div className="flex justify-center my-2 ">
                            <small>Uploading...</small>
                        </div>
                        <LinearProgress />
                    </Box>
                ) : (
                    <>
                        <DialogContentText>
                            <small>Accept only Image and PDF files and size under 15MB</small>
                        </DialogContentText>

                        <InputFileUpload />
                    </>
                )}

            </DialogContent>
            {!progress && (
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Upoad</Button>
            </DialogActions>
            )}
        </Dialog>
    );
})

export default UploadFileModel;

function InputFileUpload() {

    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const imageUrl = URL.createObjectURL(file);
                setImagePreviewUrl(imageUrl);
                setPdfPreviewUrl(null);  // Clear previous PDF preview if any
                return () => URL.revokeObjectURL(imageUrl);
            } else if (file.type === 'application/pdf') {
                const pdfUrl = URL.createObjectURL(file);
                setPdfPreviewUrl(pdfUrl);
                setImagePreviewUrl(null);  // Clear previous image preview if any
                return () => URL.revokeObjectURL(pdfUrl);
            }
        }
    };

    return (
        <div className="my-3 flex flex-col justify-center">
            {imagePreviewUrl && (
                <div className="my-3 relative">
                    <img className="max-w-full max-h-40" src={imagePreviewUrl} alt="Preview" />
                    <button
                        type="button"
                        className="absolute top-0 right-0 bg-gray-200 text-gray-900 w-8 h-8 rounded-full"
                        onClick={() => setImagePreviewUrl(null)}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}
            {pdfPreviewUrl && (
                <div className="my-3 relative">
                    <embed src={pdfPreviewUrl} type="application/pdf" width="100%" height="500px" />
                    <button
                        type="button"
                        className="absolute top-0 right-0 bg-gray-200 text-gray-900 w-8 h-8 rounded-full"
                        onClick={() => setPdfPreviewUrl(null)}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}
            <Button
                className="sticky bottom-0 z-20"
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<i className="bi bi-file-earmark-arrow-up"></i>}
            >
                Select file
                <VisuallyHiddenInput
                    type="file"
                    name="file"
                    id="file"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, application/pdf"
                    required
                />
            </Button>

        </div>
    );
}

