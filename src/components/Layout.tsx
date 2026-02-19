import { Outlet, useLocation } from 'react-router-dom';
import HomeNavBar from '@/components/HomeNavBar';
import { ROUTES } from '@/utils/constants';

const landingNavItems = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
];

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.HOME;
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNavBar navItems={isHome ? landingNavItems : undefined} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
