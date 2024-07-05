import React, { useState, useEffect } from 'react'
import { Container, Grid, Typography, Box, List, ListItem, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const schema = yup.object().shape({
    check_in: yup.date().required('Check-in date is required'),
    check_out: yup.date().required('Check-out date is required'),
    number_of_people: yup.number().required('Number of people is required').positive().integer(),
    email: yup.string().email('Invalid email').required('Email is required'),
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    room_number: yup.string().required('Room number is required')
});

const PropertyBooking = () => {
    const [property, setProperty] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const sampleProperty = {
            "rate": 50,
            "capacity": 4,
            "room_number": "123",
            "description": "A comfortable and cozy room featuring a plush bed, a work desk with a chair, ample wardrobe space, and modern amenities including a flat-screen TV, air conditioning, and free Wi-Fi. The room also includes a private bathroom with fresh towels and toiletries.",
            "id": "1",
            "features": "bed,desk,chair,wardrobe,mirror,bedside table,lamps,television,air conditioning,heating,curtains,carpet,wifi,minibar,telephone,safe,clock,sofa,coffee maker,hairdryer,bathroom towels,toiletries,iron,ironing board",
            "type": "room"
        };

        setProperty(sampleProperty);
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        const check_in_epoch = Math.floor(new Date(data.check_in).getTime() / 1000);
        const check_out_epoch = Math.floor(new Date(data.check_out).getTime() / 1000);
        const formData = { ...data, check_in: check_in_epoch, check_out: check_out_epoch };
        console.log(formData);
        
        // Submit formData to your API or handle it as needed
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={6} boxShadow={1}>
                    <Typography variant="h4" textAlign={'center'}>Information</Typography>
                    <Typography variant="h6">Room Number: {property.room_number}</Typography>
                    <Typography variant="h6">Capacity: {property.capacity}</Typography>
                    <Typography variant="h6">Rate: CAD$ {property.rate}</Typography>
                    <Box>
                        <Typography variant="h6">Description:</Typography>
                        <Typography variant="body1">{property.description}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Features: </Typography>
                        <List>
                            <Grid container spacing={2}>
                                {property.features && property.features.split(',').map((feature, index) => {
                                    return (
                                        <Grid item xs={6}><ListItem key={index}>{feature}</ListItem></Grid>
                                    );
                                })}
                            </Grid>
                        </List>
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h4" textAlign={'center'}>Booking Form</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    name="check_in"
                                    control={control}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                {...field}
                                                label="Check-in Date"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!errors.check_in}
                                                        helperText={errors.check_in?.message}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="check_out"
                                    control={control}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                {...field}
                                                label="Check-out Date"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!errors.check_out}
                                                        helperText={errors.check_out?.message}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="number_of_people"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Number of People"
                                            fullWidth
                                            error={!!errors.number_of_people}
                                            helperText={errors.number_of_people?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Email"
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="first_name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="First Name"
                                            fullWidth
                                            error={!!errors.first_name}
                                            helperText={errors.first_name?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="last_name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Last Name"
                                            fullWidth
                                            error={!!errors.last_name}
                                            helperText={errors.last_name?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1">Room Number: {property.room_number}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4">Reviews</Typography>
                <Typography variant="h6">No reviews yet</Typography>
            </Box>
        </Container>
    )
}

export default PropertyBooking;