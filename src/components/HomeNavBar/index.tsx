import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/utils/constants';

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
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

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60',
        className
      )}
      role="banner"
    >
      <nav 
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          aria-label="Proteus - Home"
        >
          <span className="text-xl font-semibold tracking-tight">Proteus</span>
        </Link>

        {/* Desktop Navigation - Center */}
        {navItems.length > 0 && (
          <div className="hidden md:flex md:flex-1 md:justify-center md:gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  item.isActive 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground'
                )}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            asChild
          >
            <Link to={ROUTES.AUTH}>Log in</Link>
          </Button>
          <Button 
            variant="default" 
            size="sm"
            asChild
          >
            <Link to={ROUTES.AUTH}>Sign up</Link>
          </Button>
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
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'block px-4 py-3 text-sm font-medium rounded-md transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    item.isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground'
                  )}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ))}
              <div className="my-2 h-px bg-border/60" />
            </>
          )}
          
          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-2 pt-2">
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
          </div>
        </div>
      </div>
    </header>
  );
}
