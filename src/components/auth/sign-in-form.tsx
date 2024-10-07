'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Swal from 'sweetalert2';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
  
      try {
        // Perform login request
        const response = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Save tokens to localStorage
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
  
          // Fetch user details with the access token
          const userResponse = await fetch(`http://localhost:4000/api/users/getUser/${values.email}`, {
            headers: {
              'Authorization': `Bearer ${result.accessToken}`,
            },
          });
  
          const userData = await userResponse.json();
  
          if (userResponse.ok) {
            // Save user avatar URL to localStorage
            localStorage.setItem('avatarUrl', userData.image_url || '');
  
            // Save user details to localStorage
            localStorage.setItem('useremail', userData.email || '');  
            localStorage.setItem('username', userData.name || '');
            localStorage.setItem('userrole', userData.role || '');
            localStorage.setItem('usernic', userData.nic || '');
            localStorage.setItem('userpas', userData.password || '');
            localStorage.setItem('userid', userData.user_id || '');
  
            // Optional: Update state if you're using it for display purposes
            // setAvatar(userData.avatarUrl || '');
  
            // Show success message and redirect
            Swal.fire({
              title: 'Success!',
              text: 'You have been logged in successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                router.replace('/dashboard');
              }
            });
  
          } else {
            Swal.fire({
              title: 'Error!',
              text: userData.message || 'Failed to fetch user details. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
  
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.message || 'Login failed. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          setError('root', { type: 'server', message: result.message || 'Login failed.' });
        }
      } catch (error) {
        console.error('Login error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setIsPending(false);
      }
    },
    [router, setError]
  );
  

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => setShowPassword(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => setShowPassword(true)}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href="/auth/reset-password" variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
