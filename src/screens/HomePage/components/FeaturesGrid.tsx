import { Zap, Target, Shield, Rocket } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Preview',
    description: 'Real-time AR mesh warp using Three.js + MediaPipe.',
  },
  {
    icon: Target,
    title: 'High Fidelity',
    description: 'CatVTON diffusion for photorealistic results.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your images processed securely; we respect your data.',
  },
  {
    icon: Rocket,
    title: 'Scalable',
    description: 'KEDA-powered GPU orchestration for fast results.',
  },
] as const;

export default function FeaturesGrid() {
  return (
    <section
      id="features"
      className="scroll-mt-20 py-24 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Built Different
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Real-time preview, diffusion-quality output, and infrastructure that scales.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Icon className="h-5 w-5 text-foreground" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
