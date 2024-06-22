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
import { LOGIN_USER_API_ENDPOINT } from '../utils/Constants';
import ThirdFAForm from './ThirdFAForm';

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

  const onSubmit = (data) => {
    postUserData(data)
  };

  const postUserData = async (userData) => {
    try {
      const response = await axios.post(LOGIN_USER_API_ENDPOINT, userData)
      const data = response.data;
      if (data && data.success) {
        toggleLogin(!showLogin)
        toggleShowTwoFA(!showTwoFA)
        updateTwoFAData({ question: data.data.securityQuestion, email: userData.email })
      }
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <>
      {showLogin && (
        <Container component="main" maxWidth="xs">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
          >
            <div className='w-full p-10 border-2 rounded-lg shadow-lg'>
              <Typography component="h1" variant="h5" className='text-center mt-60'>
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
          </Box>
        </Container>
      )}
      { showTwoFA && (
        <TwoFAForm  question={twoFAData.question} email={twoFAData.email} backToLogin={() => { toggleLogin(true); toggleShowTwoFA(false)}} toggleShowThirdFA={() => { toggleShowThirdFA(true); toggleShowTwoFA(false)}}/>
      )}
      { showThirdFA && (
        <ThirdFAForm email={twoFAData.email} backToSecondFA={() => { toggleShowThirdFA(false); toggleShowTwoFA(true)}} />
      )}
    </>

  );
}

export default LoginUser;
