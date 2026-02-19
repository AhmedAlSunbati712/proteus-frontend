import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';

export default function CTASection() {
  return (
    <section className="border-t border-border/40 bg-muted/20 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to try it on?
        </h2>
        <p className="mt-4 text-muted-foreground">
          No credit card required.
        </p>
        <Button asChild size="lg" className="mt-6 font-medium">
          <Link to={ROUTES.AUTH}>Get Started — Free</Link>
        </Button>
      </div>
    </section>
  );
}
