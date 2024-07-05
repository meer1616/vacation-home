import React, { useState } from 'react'
import { Container, Grid, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { PROPERTIES_RESULT_API_ENDPOINT } from '../utils/Constants';

const schema = yup.object().shape({
    check_in: yup.date().required('Check-in date is required'),
    check_out: yup.date().required('Check-out date is required'),
});

const PropertyResults = () => {
    const [propertyResults, setPropertyResults] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        const check_in_epoch = Math.floor(new Date(data.check_in).getTime() / 1000);
        const check_out_epoch = Math.floor(new Date(data.check_out).getTime() / 1000);

        if (check_in_epoch < Math.floor(Date.now() / 1000) || check_out_epoch < Math.floor(Date.now() / 1000)) {
            alert('Check-in or Check-out date must be today or after');
            return;
        }

        if (check_in_epoch >= check_out_epoch){
            alert('Check-out date must be after check-in date');
            return;
        }

        const searchRequest = {
            "check_in": check_in_epoch,
            "check_out": check_out_epoch
        };

        console.log(searchRequest);

        // Submit formData to your API or handle it as needed
        // load sample data
        const endpoint = PROPERTIES_RESULT_API_ENDPOINT;

        await axios.post(endpoint, searchRequest)
            .then((response) => {
                setPropertyResults(response.data);
            })
            .catch((error) => {
                alert('Error fetching properties');
            });
    };

    return (
        <Container>
            <Typography variant='h3' textAlign={"center"} m={5}>Properties</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
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
                    <Grid item xs={4}>
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
                    <Grid item xs={4}>
                        <Button type="submit" variant="contained" color="primary">Search</Button>
                    </Grid>
                </Grid>
            </form>
            {
                (
                    propertyResults && propertyResults.length > 0 &&
                    <Grid container spacing={2}>
                        {
                            propertyResults.map((property) => {
                                return (
                                    <Grid item xs={12} sm={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" component="h2">
                                                    Type: {property.type}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    Rate per day: CAD$ {property.rate}
                                                </Typography>
                                                <Typography color="body2" component="p">
                                                    Room number: {property.room_number}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    Capacity: {property.capacity}
                                                </Typography>
                                                <Button variant="contained" color="primary">
                                                    Book Now
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                )
            }
            {
                (propertyResults && propertyResults.length === 0) &&
                (
                    <Typography variant="h6" component="p" mt={5}>
                        No properties found for the selected dates
                    </Typography>
                )
            }
        </ Container>
    )
}

export default PropertyResults;