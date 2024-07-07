import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ message, show, severity = "success" }) => {
    const [openSnackbar, setOpenSnackbar] = React.useState(show || false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setOpenSnackbar(false);
    };

    return (
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
                key={'top right'}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default Notification;