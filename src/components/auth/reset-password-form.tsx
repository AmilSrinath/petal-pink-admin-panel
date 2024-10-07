'use client';

import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Snackbar,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';



type Step = 'request' | 'verify' | 'reset' | 'success';


const emailSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
});

const codeSchema = zod.object({
  code: zod
    .string()
    .length(6, { message: 'Code must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'Code must be numeric' }),
});

const passwordSchema = zod
  .object({
    password: zod.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: zod.string().min(6, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });


type EmailValues = zod.infer<typeof emailSchema>;
type CodeValues = zod.infer<typeof codeSchema>;
type PasswordValues = zod.infer<typeof passwordSchema>;

export function ResetPasswordForm(): React.JSX.Element {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>('request');
  const [email, setEmail] = React.useState<string>('');
  const [recoveryCode, setRecoveryCode] = React.useState<string>('');
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });


  const handleOpenSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const {
    control: controlEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmitEmail = async (data: EmailValues) => {
    setIsPending(true);
    try {
      const response = await axios.post('http://localhost:4000/api/users/forgotPassword', {
        email: data.email,
      });
      handleOpenSnackbar(response.data.message, 'success');
      setEmail(data.email);
      setStep('verify');
    } catch (error: any) {
      handleOpenSnackbar(error.response?.data?.message || 'Failed to send recovery code.', 'error');
    } finally {
      setIsPending(false);
    }
  };

 
  const {
    control: controlCode,
    handleSubmit: handleSubmitCode,
    setValue: setCodeValue,
    formState: { errors: codeErrors },
  } = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  const onSubmitCode = async (data: CodeValues) => {
    setIsPending(true);
    try {
      const response = await axios.post('http://localhost:4000/api/users/verifyResetCode', {
        email,
        code: data.code,
      });
      handleOpenSnackbar(response.data.message, 'success');
      setRecoveryCode(data.code);
      setStep('reset');
    } catch (error: any) {
      handleOpenSnackbar(error.response?.data?.message || 'Invalid or expired code.', 'error');
    } finally {
      setIsPending(false);
    }
  };

 
  const handleCodeChange = (value: string) => {
    setCodeValue('code', value);
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      handleSubmitCode(onSubmitCode)();
    }
  };

  
  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmitPassword = async (data: PasswordValues) => {
    setIsPending(true);
    try {
      const response = await axios.put(`http://localhost:4000/api/users/updatePassword/${email}`, {
        email,
        password: data.password,
        // code: recoveryCode,
      });
      handleOpenSnackbar(response.data.message, 'success');
      setStep('success');
    } catch (error: any) {
      handleOpenSnackbar(error.response?.data?.message || 'Failed to reset password.', 'error');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Stack spacing={4} maxWidth={400} margin="auto" padding={2}>
      <Typography variant="h5">Reset Password</Typography>

     
      {step === 'request' && (
        <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
          <Stack spacing={2}>
            <Controller
              control={controlEmail}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(emailErrors.email)}>
                  <InputLabel>Email Address</InputLabel>
                  <OutlinedInput {...field} label="Email Address" type="email" />
                  {emailErrors.email && <FormHelperText>{emailErrors.email.message}</FormHelperText>}
                </FormControl>
              )}
            />
            {emailErrors.root && <Alert color="error">{emailErrors.root.message}</Alert>}
            <Button disabled={isPending} type="submit" variant="contained">
              Send Recovery Code
            </Button>
          </Stack>
        </form>
      )}

     
      {step === 'verify' && (
        <form onSubmit={handleSubmitCode(onSubmitCode)}>
          <Stack spacing={2}>
            <Typography>Enter the 6-digit code sent to your email.</Typography>
            <Controller
              control={controlCode}
              name="code"
              render={({ field }) => (
                <FormControl error={Boolean(codeErrors.code)}>
                  <InputLabel>Recovery Code</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Recovery Code"
                    inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={(e) => handleCodeChange(e.target.value)}
                  />
                  {codeErrors.code && <FormHelperText>{codeErrors.code.message}</FormHelperText>}
                </FormControl>
              )}
            />
            {/* oninm apita aye resend code ek danna puluwn*/}
            {/* <Button disabled={isPending} type="submit" variant="outlined">
              Verify Code
            </Button> */}
            {codeErrors.root && <Alert color="error">{codeErrors.root.message}</Alert>}
          </Stack>
        </form>
      )}

      
      {step === 'reset' && (
        <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <Stack spacing={2}>
            <Controller
              control={controlPassword}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(passwordErrors.password)}>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput {...field} label="New Password" type="password" />
                  {passwordErrors.password && <FormHelperText>{passwordErrors.password.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              control={controlPassword}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl error={Boolean(passwordErrors.confirmPassword)}>
                  <InputLabel>Confirm Password</InputLabel>
                  <OutlinedInput {...field} label="Confirm Password" type="password" />
                  {passwordErrors.confirmPassword && (
                    <FormHelperText>{passwordErrors.confirmPassword.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            {passwordErrors.root && <Alert color="error">{passwordErrors.root.message}</Alert>}
            <Button disabled={isPending} type="submit" variant="contained">
              Reset Password
            </Button>
          </Stack>
        </form>
      )}

     
      {step === 'success' && (
        <Stack spacing={2}>
          <Alert severity="success">Your password has been reset successfully!</Alert>
          <Button variant="contained" onClick={() => router.push(paths.auth.signIn)}>
            Go to Login
          </Button>
        </Stack>
      )}

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
