import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Practice from './pages/Practice';
import SpeakingPractice from './pages/SpeakingPractice';
import WritingPractice from './pages/WritingPractice';

// Styles
import './styles/index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout with Navbar and Footer
const Layout = ({ children, hideFooter = false }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } />
      <Route path="/about" element={
        <Layout>
          <About />
        </Layout>
      } />
      <Route path="/how-it-works" element={
        <Layout>
          <HowItWorks />
        </Layout>
      } />
      <Route path="/contact" element={
        <Layout>
          <Contact />
        </Layout>
      } />

      {/* Auth Pages */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Protected Pages */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout hideFooter>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout hideFooter>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/practice" element={
        <ProtectedRoute>
          <Layout>
            <Practice />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/practice/speaking" element={
        <ProtectedRoute>
          <Layout hideFooter>
            <SpeakingPractice />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/practice/writing" element={
        <ProtectedRoute>
          <Layout hideFooter>
            <WritingPractice />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
