import { Outlet } from 'react-router-dom';
import HomeNavBar from '@/components/HomeNavBar';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
