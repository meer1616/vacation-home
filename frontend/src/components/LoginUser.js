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
import TwoFAForm from './TwoFAForm';
import axios from "axios";
import { LOGIN_USER_API_ENDPOINT, SNS_PUBLISH_LOGIN_EMAIL } from '../utils/Constants';
import ThirdFAForm from './ThirdFAForm';
import Notification from './Notification';
import ProgressBarOverlay from './ProgressBarOverlay';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginUser = () => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [showLogin, toggleLogin] = useState(true)
  const [showTwoFA, toggleShowTwoFA] = useState(false)
  const [showThirdFA, toggleShowThirdFA] = useState(false)
  const [twoFAData, updateTwoFAData] = useState({})
  const [notificationData, setNotificationData] = useState({})
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true)
    postUserData(data)
  };

  const postUserData = async (userData) => {
    try {
      const response = await axios.post(LOGIN_USER_API_ENDPOINT, userData)
      const data = response.data;
      setLoading(false)
      console.log("data in login", data);
      if (data && data.success) {
        toggleLogin(!showLogin)
        toggleShowTwoFA(!showTwoFA)
        updateTwoFAData({ question: data.data.securityQuestion, email: userData.email })

      }
      else {
        setNotificationData({
          severity: "error",
          message: data.message
        })
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
      setNotificationData({
        severity: "error",
        message: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showLogin && (
        // <Container component="main" maxWidth="xs">
        <Box
          display="flex"
          flexDirection="row"
          // alignItems="center"
          // justifyContent="center"
          minHeight="100vh"
        >
          <div style={{ border: "10px soild red" }} >
            <img src='/login.jpg' style={{ height: "100vh", width: "50vw" }}></img>
          </div>
          {/* <div className='w-full p-10 border-2 rounded-lg shadow-lg'> */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto" }}>
            <div className='border-black'>

              <Typography component="h2" variant="h3" className='text-center mt-60'>
                Welcome to Dal Vacation
              </Typography>
              <br />
              <br />
              <Typography component="h1" variant="h4" className='text-center mt-60'>
                Login
              </Typography>

              <br />
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
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
                    <Button type="submit" fullWidth variant="contained" color="primary">
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>

          </div>
        </Box>
        // </Container>
      )}
      {showTwoFA && (
        <TwoFAForm question={twoFAData.question} email={twoFAData.email} backToLogin={() => { toggleLogin(true); toggleShowTwoFA(false) }} toggleShowThirdFA={() => { toggleShowThirdFA(true); toggleShowTwoFA(false) }} />
      )}
      {showThirdFA && (
        <ThirdFAForm email={twoFAData.email} backToSecondFA={() => { toggleShowThirdFA(false); toggleShowTwoFA(true) }} />
      )}
      {notificationData && notificationData.message != null && (
        <Notification message={notificationData.message} severity={notificationData.severity} show={true} />
      )}
      <ProgressBarOverlay loading={loading} />
    </>

  );
}

export default LoginUser;
