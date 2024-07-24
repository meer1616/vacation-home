import React, { useState, useEffect } from 'react'
import { Container, Grid, Typography, Box, List, ListItem, Button, TextField } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FETCH_PROPERTY_API_ENDPOINT, BOOK_PROPERTY_API_ENDPOINT, FETCH_PROPERTY_REVIEWS_API_ENDPOINT, SQS_BOOKING_END_POINT } from '../utils/Constants';
import axios from 'axios';
import { isLoggedin, getStringFromDateObject, getStringFromEpoch } from '../utils/helper';

const schema = yup.object().shape({
    number_of_people: yup.number().required('Number of people is required').positive().integer(),
    email: yup.string().email('Invalid email').required('Email is required'),
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required')
});

const PropertyBooking = ({ check_in, check_out }) => {
    const [property, setProperty] = useState({});
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();
    const { state } = useLocation();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperty = async (id) => {
            const endpoint = FETCH_PROPERTY_API_ENDPOINT;
            const request = { "id": id };
            await axios.post(endpoint, request)
                .then((response) => {
                    setProperty(response.data);
                })
                .catch((error) => {
                    alert('Error fetching property');
                });
        }

        const fetchReviews = async (room_id) => {
            const endpoint = FETCH_PROPERTY_REVIEWS_API_ENDPOINT;
            const request = { "room_id": room_id };
            await axios.post(endpoint, request)
                .then((response) => {
                    setReviews(response.data);
                })
                .catch((error) => {
                    alert('Error fetching reviews');
                });
        }

        fetchProperty(id);
        fetchReviews(id);
    }, []);

    const onSubmit = async (data) => {
        const check_in_epoch = Math.floor(new Date(state?.check_in).getTime() / 1000);
        const check_out_epoch = Math.floor(new Date(state?.check_out).getTime() / 1000);
        const user = JSON.parse(localStorage.getItem('user'));
        const email = user?.email;
        const userId = user?.id;

        const bookingRequest = {
            "check_in": check_in_epoch,
            "check_out": check_out_epoch,
            "number_of_people": data.number_of_people,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "room_number": property.room_number,
            "email": email,
            "userId": userId
        };
        console.log(bookingRequest);

        const endpoint = SQS_BOOKING_END_POINT;
        await axios.post(endpoint, bookingRequest)
            .then((response) => {
                if (response.status === 200) {
                    alert('Booking request submitted successfully');
                    // todo: update this to booking history page
                    navigate('/', { replace: true });
                } else {
                    alert('Error submitting booking request');
                }
            })
            .catch((error) => {
                console.log(error);
                alert('Error submitting booking request');
            });
    };

    const goBack = () => {
        navigate('/properties', { replace: true });
    }

    return (
        <Container>
            <Button type="submit" variant="contained" color="secondary" onClick={goBack}>Back to search</Button>
            <Grid container spacing={2} marginTop={2}>
                <Grid item xs={6} boxShadow={2}>
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
                    {
                        !state && (
                            <Typography variant="subtitle1" textAlign={'center'} color="red">Please go to search page to select check-in and check-out dates</Typography>
                        )
                    }
                    {
                        state && (
                            <Box>
                                <Typography variant="body1">Check-in Date: {getStringFromDateObject(state?.check_in)}</Typography>
                                <Typography variant="body1">Check-out Date: {getStringFromDateObject(state?.check_out)}</Typography>
                                <Typography variant="subtitle2" color="#007bff">Please note that both check in and check out times are fixed at 12:00 PM noon.</Typography>
                            </Box>
                        )
                    }
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} my={1}>
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
                                <Button type="submit" variant="contained" color="primary" disabled={!state} fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <Box my={3}>
                <Typography variant="h4">Reviews</Typography>
                {
                    reviews && reviews.length === 0 && (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="h6">No reviews yet</Typography>
                        </Box>
                    )
                }
                {
                    reviews && reviews.length > 0 && (
                        <Grid container spacing={1}>
                            {
                                reviews.map((review) => {
                                    return (
                                        <Grid item xs={12}>
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                            >
                                                <Typography variant="h6">{review.name}</Typography>
                                                <Box display="flex" flexDirection="row" justifyContent="space-between">
                                                    <Typography variant="subtitle1">{review.rating} Stars (out of 5) </Typography>
                                                    <Typography variant="subtitle1">{getStringFromEpoch(review.date)}</Typography>
                                                </Box>
                                                <Typography variant="body1">{review.description}</Typography>
                                            </Box>
                                        </Grid>
                                    )

                                })
                            }
                        </Grid>
                    )
                }
            </Box>
        </Container>
    )
}

export default PropertyBooking;