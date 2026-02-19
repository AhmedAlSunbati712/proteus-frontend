export default function TechStackStrip() {
  const techs = ['PyTorch', 'Three.js', 'Kubernetes', 'KEDA', 'Redis'];
  return (
    <section className="border-t border-border/40 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm text-muted-foreground">
          Built with cutting-edge open-source technology.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
          {techs.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
