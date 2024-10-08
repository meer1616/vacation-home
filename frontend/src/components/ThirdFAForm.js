import React, { useEffect, useState } from 'react';
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
import { CAESAR_CIPHER_CHALLENGE_API_ENDPOINT, SNS_PUBLISH_LOGIN_EMAIL } from '../utils/Constants';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Notification from './Notification';
import ProgressBarOverlay from './ProgressBarOverlay';

const schema = yup.object().shape({
    answer: yup.string().required('Answer is required'),
})

const ThirdFAForm = ({ email, backToSecondFA }) => {
    const navigate = useNavigate();
    const [caesarData, updateCaesarData] = useState({})
    const [notificationData, setNotificationData] = useState({})
    const [loading, setLoading] = useState(false);

    const { handleSubmit, control, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
    });

    const fetchCaesarCipherChallenge = async () => {
        try {
            const response = await axios.post(CAESAR_CIPHER_CHALLENGE_API_ENDPOINT, {
                action: "generate"
            })
            const data = response.data;
            if (data && data.success) {
                updateCaesarData(data.data)
            } else {
                setNotificationData({
                    severity: "error",
                    message: data.message
                })
            }
        } catch (error) {
            console.log(error)
            setNotificationData({
                severity: "error",
                message: error.message
            })
        }
    }

    const verifyCaesarCipherChallenge = async (dataToPost) => {
        try {
            const response = await axios.post(CAESAR_CIPHER_CHALLENGE_API_ENDPOINT, {
                action: "verify",
                data: {
                    ...caesarData,
                    email,
                    plainText: dataToPost.answer
                }
            })
            const data = response.data;

            setLoading(false)
            if (data && data.success) {
                setNotificationData({
                    severity: "success",
                    message: data.data
                })
                console.log("login data", { userId: data.userId });
                axios.post(SNS_PUBLISH_LOGIN_EMAIL, { userId: data.userId }).then((res) => {
                    console.log("res", res.data);
                    if (res.data.success) {
                        localStorage.setItem('user', JSON.stringify({ email: data.email, userId: data.userId }));
                        navigate('/');
                    }
                }).catch((err) => {
                    console.log("err in publish login email", err);
                })
            } else {
                setNotificationData({
                    severity: "error",
                    message: data.data
                })
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
            setNotificationData({
                severity: "error",
                message: error.message
            })
        }
    }

    const onSubmit = (data) => {
        setLoading(true)
        verifyCaesarCipherChallenge(data)
    };

    useEffect(() => {
        fetchCaesarCipherChallenge()
    }, [])

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
                                    {caesarData && caesarData.cipherText && (
                                        <>
                                            <p>Decrypt the message below using Ceasar Cipher</p>
                                            <p>Cipher Text: {caesarData.cipherText}</p>
                                            <p>Encrypted with Key: {caesarData.key}</p>
                                            <br />
                                        </>
                                    )}
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
                    {notificationData && notificationData.message != null && (
                        <Notification message={notificationData.message} severity={notificationData.severity} show={true} />
                    )}
                    <ProgressBarOverlay loading={loading} />
                </div>
            </Box>
        </Container>
    );
}

export default ThirdFAForm;
