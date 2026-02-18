import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';

export default function HomePage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold tracking-tight">Proteus</h1>
      <p className="mt-2 text-muted-foreground">
        Event-driven virtual try-on — upload, preview, snap.
      </p>
      <Button asChild variant="outline" className="mt-6" size="sm">
        <Link to={ROUTES.HOME}>Home</Link>
      </Button>
    </div>
  );
}
