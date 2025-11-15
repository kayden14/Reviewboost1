import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

type LayoutProps = {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
};

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onNavigate) onNavigate('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = user
    ? profile?.role === 'admin'
      ? [
          { name: 'Admin Dashboard', page: 'admin-dashboard' },
          { name: 'About Us', page: 'about' },
          { name: 'Contact', page: 'contact' },
        ]
      : [
          { name: 'Dashboard', page: 'freelancer-dashboard' },
          { name: 'Request Review', page: 'review-request' },
          { name: 'About Us', page: 'about' },
          { name: 'Contact', page: 'contact' },
        ]
    : [
        { name: 'Home', page: 'home' },
        { name: 'For Freelancers', page: 'for-freelancers' },
        { name: 'About Us', page: 'about' },
        { name: 'Contact', page: 'contact' },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate && onNavigate(user ? (profile?.role === 'admin' ? 'admin-dashboard' : 'freelancer-dashboard') : 'home')}
                className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent"
              >
                ReviewBoost
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate && onNavigate(item.page)}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === item.page
                      ? 'text-teal-600'
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{profile?.full_name}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate && onNavigate('signin')}
                    className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('signup')}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate && onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm font-medium ${
                    currentPage === item.page
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600 border-t">
                    {profile?.full_name}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-4 pt-2 border-t">
                  <button
                    onClick={() => {
                      onNavigate && onNavigate('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm font-medium text-gray-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onNavigate && onNavigate('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-semibold rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
