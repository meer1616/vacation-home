import React, { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    TextField,
    Button,
    Grid,
    Container,
    Typography,
    Box,
} from '@mui/material';

const schema = yup.object().shape({
    answer: yup.string().required('Answer is required'),
})

const ThirdFAForm = ({ email, backToSecondFA }) => {
    const { handleSubmit, control, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data)
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <div className='w-full p-10 border-2 rounded-lg shadow-lg'>
                    <Typography component="h1" variant="h5" className='text-center'>
                        Third-Factor Authentication
                    </Typography>
                    <br />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <Controller
                                        name={`answer`}
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                variant="outlined"
                                                fullWidth
                                                label={`Answer`}
                                                error={!!errors[`answer`]}
                                                helperText={errors[`answer`] ? errors[`answer`].message : ''}
                                            />
                                        )}
                                    />
                                </Grid>
                            </React.Fragment>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" color="primary" onClick={backToSecondFA}>
                                    Go Back
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Box>
        </Container>
    );
}

export default ThirdFAForm;
