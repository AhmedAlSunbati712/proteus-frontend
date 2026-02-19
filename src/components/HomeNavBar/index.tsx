import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/utils/constants';
import { useAuth } from '@/contexts/AuthContext';
import { logOut } from '@/api/user';
import { toast } from 'react-toastify';

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

function getSectionIdFromHref(href: string): string | null {
  if (href.startsWith('#')) return href.slice(1);
  return null;
}

interface HomeNavBarProps {
  navItems?: NavItem[];
  className?: string;
}

const defaultNavItems: NavItem[] = [
  // Placeholder for future navigation items
  // { label: 'Features', href: '#features', isActive: false },
  // { label: 'How it Works', href: '#how-it-works', isActive: false },
  // { label: 'Pricing', href: '#pricing', isActive: false },
];

export default function HomeNavBar({ 
  navItems = defaultNavItems, 
  className 
}: HomeNavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isLoading, isError, refetch } = useAuth();
  const { mutateAsync: logoutAsync } = logOut(
    () => toast.success('Logged out successfully!'),
    () => toast.error('Failed to log out!')
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Track which section is in view for active nav underline
  useEffect(() => {
    if (navItems.length === 0) return;
    const sectionIds = navItems.map((item) => getSectionIdFromHref(item.href)).filter(Boolean) as string[];
    if (sectionIds.length === 0) return;

    const hash = window.location.hash.slice(1);
    if (hash && sectionIds.includes(hash)) setActiveSection(hash);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (sectionIds.includes(id)) setActiveSection(id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [navItems]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutAsync();
      closeMobileMenu();
      navigate(ROUTES.AUTH);
    } catch {
      // onError callback handles toast
    } finally {
      setIsLoggingOut(false);
    }
  }, [logoutAsync, closeMobileMenu, navigate]);

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60',
        className
      )}
      role="banner"
    >
      <nav 
        className="mx-auto grid h-16 max-w-7xl grid-cols-2 items-center px-4 sm:px-6 lg:px-8 md:grid-cols-3"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo - left */}
        <Link 
          to="/" 
          className="flex items-center justify-self-start space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          aria-label="Proteus - Home"
        >
          <span className="text-xl font-semibold tracking-tight">Proteus</span>
        </Link>

        {/* Desktop Navigation - centered (placeholder when no items so grid stays 3-column) */}
        {navItems.length > 0 ? (
          <div className="hidden md:flex md:items-center md:justify-center md:gap-1">
            {navItems.map((item) => {
              const sectionId = getSectionIdFromHref(item.href);
              const isActive = sectionId != null && activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                </a>
              );
            })}
          </div>
        ) : (
          <div className="hidden md:block" aria-hidden />
        )}

        {/* Right column: Desktop Auth + Mobile Menu Button */}
        <div className="flex w-full min-w-0 items-center justify-end gap-2">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:gap-2">
            {!user && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={ROUTES.AUTH}>Log in</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to={ROUTES.AUTH}>Sign up</Link>
                </Button>
              </>
            )}
            {user && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={ROUTES.HISTORY}>History</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="relative"
          >
            <span className="sr-only">
              {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            </span>
            <Menu 
              className={cn(
                'absolute h-5 w-5 transition-all duration-200',
                isMobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              )} 
              aria-hidden="true"
            />
            <X 
              className={cn(
                'absolute h-5 w-5 transition-all duration-200',
                isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              )} 
              aria-hidden="true"
            />
          </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-sm px-4 py-4 space-y-1">
          {/* Mobile Nav Items */}
          {navItems.length > 0 && (
            <>
              {navItems.map((item) => {
                const sectionId = getSectionIdFromHref(item.href);
                const isActive = sectionId != null && activeSection === sectionId;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'block px-4 py-3 text-sm font-medium rounded-md transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="my-2 h-px bg-border/60" />
            </>
          )}
          
          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            {!user && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <Link to={ROUTES.AUTH} onClick={closeMobileMenu}>Log in</Link>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <Link to={ROUTES.AUTH} onClick={closeMobileMenu}>Sign up</Link>
                </Button>
              </>
            )}
            {user && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <Link to={ROUTES.HISTORY} onClick={closeMobileMenu}>History</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full"
                >
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
