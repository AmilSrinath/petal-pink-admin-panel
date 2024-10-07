export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/product',
    settings: '/dashboard/settings',
    orders: '/dashboard/orders',
    user: '/dashboard/user',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
