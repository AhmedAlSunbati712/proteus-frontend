import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 px-4 sm:px-6" role="contentinfo">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-sm font-semibold tracking-tight">Proteus</span>
        <p className="text-sm text-muted-foreground">
          Virtual try-on powered by GenAI.
        </p>
        <Link
          to={ROUTES.AUTH}
          className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          Get started
        </Link>
      </div>
    </footer>
  );
}
