import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LoginForm, { type LoginFormData } from './LoginForm';
import SignupForm, { type SignupFormData } from './SignupForm';
import { logIn, signUp } from '@/api/user';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: AuthMode;
}

export default function AuthModal({ 
  open, 
  onOpenChange, 
  defaultMode = 'login' 
}: AuthModalProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: loginAsync } = logIn(
    () => toast.success('Login successful!'),
    () => toast.error('Login failed!')
  );
  const { mutateAsync: signupAsync } = signUp(
    () => toast.success('Signup successful!'),
    () => toast.error('Signup failed!')
  );
  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await loginAsync(data);
      console.log('Login response:', response);
      onOpenChange(false);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword: _, ...userData } = data;
      const response = await signupAsync(userData);
      console.log('Signup response:', response);
      setMode('login' as AuthMode);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToLogin = () => setMode('login');
  const switchToSignup = () => setMode('signup');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Fill in your details to get started'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {mode === 'login' ? (
            <>
              <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={switchToSignup}
                  className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
              <SignupForm onSubmit={handleSignup} isSubmitting={isSubmitting} />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Sign in
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
