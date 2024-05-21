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
    const [errorMessage, setErrorMessage] = useState(null);

    const handleClose = () => {
        setOpen(false);
        setErrorMessage(null);
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

            setErrorMessage(null);

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
                } else {
                    reValidatePath();
                }

            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            if (error.response.data) {
                setErrorMessage(error.response.data.message);
            }
            console.error('Error occurred:', error);
        } finally {
            setProgress(false);
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
            <DialogTitle>
                Upload file
                {errorMessage && (
                    <p className="text-xs text-red-700">{errorMessage}</p>
                )}
            </DialogTitle>

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
                        <DialogContentText className="max-w-80">
                            <small className="text-xs">Accept only Image and PDF files and size under 15MB and one time 10 files</small>
                        </DialogContentText>

                        <InputFileUpload setErrorMessage={setErrorMessage} />
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

function InputFileUpload({ setErrorMessage }) {

    const [filePreviews, setFilePreviews] = useState([]);

    const [fileList, setFileList] = useState([]);

    // File selection handler
    const handleFileChange = (event) => {

        const newFiles = Array.from(event.target.files);

        if (newFiles.length > 10) {
            setErrorMessage('You can upload only 10 files at a time');
            event.target.value = ''; // Clear the file input field
            return;
        } else if (fileList.concat(newFiles).length > 10) {
            setErrorMessage('You can upload only 10 files at a time');
            return;
        };

        setErrorMessage(null);

        const previews = newFiles.map((file) => {
            return { url: URL.createObjectURL(file), type: file.type };
        });

        //Add updateed new files at beggining of array
        setFilePreviews([...previews, ...filePreviews,]);

        // Concatenate the new files to the existing fileList
        const updatedFiles = [...fileList, ...newFiles];
        setFileList(updatedFiles);
        updateInputFiles(updatedFiles);
    };

    const updateInputFiles = (files) => {
        const dt = new DataTransfer();
        files.forEach(file => dt.items.add(file));
        document.getElementById('files').files = dt.files;
    };

    const handleRemoveFile = (index) => {
        const updatedPreviews = [...filePreviews];
        updatedPreviews.splice(index, 1);
        setFilePreviews(updatedPreviews);

        const updatedFiles = fileList.filter((_, i) => i !== index);
        setFileList(updatedFiles);
        updateInputFiles(updatedFiles);
        setErrorMessage(null);
    };

    return (
        <div className="max-w-96 my-3 flex flex-col justify-center">
            <div className="flex flex-row items-center overflow-x-auto">
                {filePreviews.map((preview, index) => (
                    <div key={index} className="relative flex-shrink-0 w-auto mr-4">
                        {preview.type.startsWith('image/') && (
                            <img className="max-w-full h-40 border border-slate-200 rounded-sm" src={preview.url} alt={`Preview ${index}`} />
                        )}
                        {preview.type === 'application/pdf' && (
                            <embed className="max-h-52" src={preview.url} type="application/pdf" width="100%" height="500px" />
                        )}

                        <button
                            type="button"
                            className="absolute top-0 right-0 bg-gray-200 text-gray-900 w-8 h-8 rounded-full"
                            onClick={() => handleRemoveFile(index)}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                ))}
            </div>

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
                    name="files"
                    id="files"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, application/pdf"
                    required
                    multiple
                />
            </Button>
            {fileList.length > 0 && (
                <small className="text-center text-gray-700 font-semibold my-4">Total {fileList.length} files select</small>
            )}
        </div>
    );
}

