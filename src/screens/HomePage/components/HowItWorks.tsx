import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Upload',
    description:
      'Drop any outfit photo — product shots work too. Our AI extracts the clothing automatically.',
  },
  {
    number: 2,
    title: 'Preview',
    description:
      'See the outfit on you in real-time with our AR magic mirror.',
  },
  {
    number: 3,
    title: 'Snap',
    description:
      'Capture your pose and get a high-fidelity AI-generated try-on image.',
  },
] as const;

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-border/40 bg-muted/20 py-24 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          How It Works
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Upload, preview, snap — three steps to your virtual try-on.
        </p>
        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-stretch sm:gap-4">
          {steps.flatMap((step, index) => [
            <div
              key={`card-${step.number}`}
              className="flex min-h-[180px] flex-1 flex-col rounded-lg border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md sm:min-h-0"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>,
            ...(index < steps.length - 1
              ? [
                  <div
                    key={`arrow-${step.number}`}
                    className="flex flex-shrink-0 items-center justify-center py-2 sm:px-1"
                  >
                    <ArrowRight
                      className="h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0"
                      aria-hidden
                    />
                  </div>,
                ]
              : []),
          ])}
        </div>
      </div>
    </section>
  );
}
