import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie', hide: false },
  { key: 'orders', title: 'Orders', href: paths.dashboard.orders, icon: 'list' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'products', title: 'Products', href: paths.dashboard.integrations, icon: 'circles-three-plus', hide: false },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'user', title: 'Users', href: paths.dashboard.user, icon: 'user', hide: false },
] satisfies NavItemConfig[];
