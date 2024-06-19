import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    TextField,
    Button,
    Grid,
    Container,
    Typography,
} from '@mui/material';

const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    phoneNumber: yup.string().required('Phone Number is required'),
    address: yup.string().required('Address is required'),
});

const RegisterUser = () => {
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <Container component="main" maxWidth="sm" className='mt-10'>
            <div className='p-12 border-2 rounded-lg shadow-lg'
            //  style={{ border: "1px solid black" }}
            >
                <Typography component="h1" variant="h5" className='text-center'>
                    Registration Form
                </Typography>
                <br />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="firstName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        label="First Name"
                                        error={!!errors.firstName}
                                        helperText={errors.firstName ? errors.firstName.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="lastName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        label="Last Name"
                                        error={!!errors.lastName}
                                        helperText={errors.lastName ? errors.lastName.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        label="Email Address"
                                        error={!!errors.email}
                                        helperText={errors.email ? errors.email.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        error={!!errors.password}
                                        helperText={errors.password ? errors.password.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        type='number'
                                        label="Phone Number"
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        fullWidth
                                        label="Address"
                                        error={!!errors.address}
                                        helperText={errors.address ? errors.address.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

export default RegisterUser;
