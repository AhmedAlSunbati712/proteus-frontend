import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';

function scrollToHowItWorks() {
  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* Optional subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/30 to-background"
        aria-hidden
      />
      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Proteus
        </h1>
        <p className="mt-3 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          AI-Powered Virtual Try-On
        </p>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Upload any outfit. See it on you in seconds.
        </p>
        <p className="mt-1 text-muted-foreground">
          No apps. No plugins. Just your browser.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="font-medium">
            <Link to={ROUTES.AUTH}>Get Started — Free</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToHowItWorks}
            className="font-medium"
          >
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}
