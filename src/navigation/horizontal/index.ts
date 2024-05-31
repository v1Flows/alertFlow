export default [
  {
    title: 'Home',
    to: { name: 'dashboard' },
    icon: { icon: 'ri-dashboard-line' },
    action: 'create',
    subject: 'all',
  },
  {
    title: 'Projects',
    to: { name: 'dashboard-projects' },
    icon: { icon: 'ri-stack-line' },
    action: 'create',
    subject: 'all',
  },
  {
    title: 'Flows',
    to: 'dashboard-flows',
    icon: { icon: 'ri-swap-2-line' },
    action: 'create',
    subject: 'all',
  },
  {
    title: 'Payloads',
    to: { name: 'dashboard-payloads' },
    icon: { icon: 'ri-database-line' },
    action: 'create',
    subject: 'all',
  },
]
