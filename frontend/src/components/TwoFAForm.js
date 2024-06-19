import React from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    TextField,
    Button,
    Grid,
    Container,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';

const schema = yup.object().shape({
    question1: yup.string().required('Question 1 is required'),
    answer1: yup.string().required('Answer 1 is required'),
    question2: yup.string().required('Question 2 is required'),
    answer2: yup.string().required('Answer 2 is required'),
    question3: yup.string().required('Question 3 is required'),
    answer3: yup.string().required('Answer 3 is required'),
}).test('unique-questions', 'Questions must be unique', (values) => {
    const { question1, question2, question3 } = values;
    const questions = [question1, question2, question3];
    return new Set(questions).size === questions.length;
});

const securityQuestions = [
    'What was the name of your first pet?',
    'What is your mother’s maiden name?',
    'What was the name of your first school?',
    'What is your best friend name?',
    'What city were you born in?',
    'What is your favorite food?',
];

const TwoFAForm = () => {
    const { handleSubmit, control, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
    });

    const selectedQuestions = useWatch({ control, name: ['question1', 'question2', 'question3'] });

    const isQuestionDisabled = (question) => selectedQuestions.includes(question);

    const onSubmit = (data) => {
        console.log(data);
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
                            {[1, 2, 3].map((num) => (
                                <React.Fragment key={num}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={`question${num}`}
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <FormControl fullWidth variant="outlined" error={!!errors[`question${num}`]}>
                                                    <InputLabel>{`Select Question ${num}`}</InputLabel>
                                                    <Select
                                                        {...field}
                                                        label={`Select Question ${num}`}
                                                    >
                                                        {securityQuestions.map((question, index) => (
                                                            <MenuItem key={index} value={question} disabled={isQuestionDisabled(question)}>
                                                                {question}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {errors[`question${num}`] && <Typography color="error">{errors[`question${num}`]?.message}</Typography>}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={`answer${num}`}
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="outlined"
                                                    fullWidth
                                                    label={`Answer ${num}`}
                                                    error={!!errors[`answer${num}`]}
                                                    helperText={errors[`answer${num}`] ? errors[`answer${num}`].message : ''}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </React.Fragment>
                            ))}
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Box>
        </Container>
    );
}

export default TwoFAForm;
