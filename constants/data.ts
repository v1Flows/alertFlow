import { Icons } from '@/components/icons';
import { NavItem, SidebarNavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: 'folerGit',
    label: 'projects'
  },
  {
    title: 'Flows',
    href: '/dashboard/flows',
    icon: 'workflow',
    label: 'flows'
  },
  {
    title: 'Payloads',
    href: '/dashboard/profile',
    icon: 'library',
    label: 'profile'
  },
  {
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];
