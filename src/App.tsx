import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ChatOverlay from './components/ChatOverlay';
import Home from './pages/Home';
import ForFreelancers from './pages/ForFreelancers';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SetupProfile from './pages/SetupProfile';
import ReviewRequest from './pages/ReviewRequest';
import Resources from './pages/Resources';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (profile.role === 'freelancer') {
        setCurrentPage('freelancer-dashboard');
      }
    }
  }, [user, profile, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case 'home':
          return <Home onNavigate={setCurrentPage} />;
        case 'for-freelancers':
          return <ForFreelancers onNavigate={setCurrentPage} />;
        case 'about':
          return <About onNavigate={setCurrentPage} />;
        case 'contact':
          return <Contact onNavigate={setCurrentPage} />;
        case 'signin':
          return <SignIn onNavigate={setCurrentPage} />;
        case 'signup':
          return <SignUp onNavigate={setCurrentPage} />;
        default:
          return <Home onNavigate={setCurrentPage} />;
      }
    }

    if (profile?.role === 'admin') {
      switch (currentPage) {
        case 'admin-dashboard':
          return <AdminDashboard onNavigate={setCurrentPage} />;
        case 'about':
          return <About onNavigate={setCurrentPage} />;
        case 'contact':
          return <Contact onNavigate={setCurrentPage} />;
        default:
          return <AdminDashboard onNavigate={setCurrentPage} />;
      }
    }

    switch (currentPage) {
      case 'freelancer-dashboard':
        return <FreelancerDashboard onNavigate={setCurrentPage} />;
      case 'setup-profile':
        return <SetupProfile onNavigate={setCurrentPage} />;
      case 'review-request':
        return <ReviewRequest onNavigate={setCurrentPage} />;
      case 'resources':
        return <Resources onNavigate={setCurrentPage} />;
      case 'about':
        return <About onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact onNavigate={setCurrentPage} />;
      default:
        return <FreelancerDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
      <ChatOverlay />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
