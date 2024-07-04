import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';

const ProgressBarOverlay = ({ loading }) => {
    return (
        <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default ProgressBarOverlay;