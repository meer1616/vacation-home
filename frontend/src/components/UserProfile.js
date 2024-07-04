import React, { useState, useEffect } from 'react'
import { Typography, Box, Grid, Card } from '@mui/material'

const UserProfile = () => {
    const [firstName, setFirstName] = useState('testFirstName');
    const [lastName, setLastName] = useState('testLastName');
    const [email, setEmail] = useState('email@test.com');
    const [phoneNumber, setPhoneNumber] = useState('1234567890');
    const [address, setAddress] = useState('test address, testCity');

    // useEffect( () => {
    // }, []);

    return (
        <Box 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight={'70vh'}
        >
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Card sx={{  margin: '1rem', boxShadow: 3, maxWidth: 600, padding: '1rem' }}>
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                    First Name:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                    {firstName}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                    Last Name:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                    {lastName}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                    Email:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                    {email}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                    Phone Number:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                    {phoneNumber}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom>
                    Address:
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                    {address}
                    </Typography>
                </Grid>
                </Grid>
            </Card>
        </Box>
    );
}

export default UserProfile;