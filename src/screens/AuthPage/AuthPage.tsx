import { useState } from 'react';
import AuthModal from './components/AuthModal';

export default function AuthPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Get Started
        </h1>
        <p className="text-muted-foreground max-w-md">
          Sign in to your account or create a new one to start using Proteus.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Continue
        </button>
      </div>

      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen} 
      />
    </div>
  );
}
