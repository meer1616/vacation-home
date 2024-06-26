import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { VALIDATE_SECURITY_ANSWER_API_ENDPOINT } from '../utils/Constants';
import axios from "axios";
import Notification from './Notification';

const schema = yup.object().shape({
    answer: yup.string().required('Answer is required'),
})

const TwoFAForm = ({ question, email, backToLogin, toggleShowThirdFA }) => {
    const { handleSubmit, control, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
    });

    const [notificationData, setNotificationData] = useState({})

    const postAnswerData = async (userData) => {
        try {
            const response = await axios.post(VALIDATE_SECURITY_ANSWER_API_ENDPOINT, { email, ...userData})
            const data = response.data;
            if (data && data.success) {
                toggleShowThirdFA()
            } else {
                setNotificationData({
                    severity: "error",
                    message: data.message
                })
            }
        } catch(error) {
            console.log(error)
            setNotificationData({
                severity: "error",
                message: error.message
            })
        }
    }
    
    const onSubmit = (data) => {
        postAnswerData(data)
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
                        Two-Factor Authentication
                    </Typography>
                    <br />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <React.Fragment>
                                <Grid item xs={12}>
                                    {question}
                                </Grid>
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
                                <Button type="submit" fullWidth variant="contained" color="primary" onClick={backToLogin}>
                                    Go Back To Login
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    {notificationData && notificationData.message != null && (
                        <Notification message={notificationData.message} severity={notificationData.severity} show={true}/>
                    )}
                </div>
            </Box>
        </Container>
    );
}

export default TwoFAForm;
