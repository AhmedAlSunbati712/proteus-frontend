import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold tracking-tight">404</h1>
      <p className="mt-2 text-muted-foreground">This page could not be found.</p>
      <Link
        to={ROUTES.HOME}
        className="mt-6 text-sm underline underline-offset-4 hover:text-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
