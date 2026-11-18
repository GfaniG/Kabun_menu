import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomerMenu } from './pages/CustomerMenu';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Render error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('kabun_live_menu_cache');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0E2F2C] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-12 h-12 rounded-full bg-[#133834] border border-[#1D4D47] flex items-center justify-center text-[#E5CFAF] mb-4 text-xl">
            ☕
          </div>
          <h2 className="font-headline text-lg font-bold text-[#FAF7F2]">Kabun Coffee + Roastery</h2>
          <p className="text-xs text-[#C5D5D3] mt-1 mb-6">Reconnecting to digital menu...</p>
          <button
            onClick={this.handleReload}
            className="px-6 py-2.5 bg-[#E5CFAF] text-[#0E2F2C] font-headline text-xs uppercase font-extrabold rounded-full hover:brightness-110 cursor-pointer shadow-lg"
          >
            Reload Menu
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E2F2C] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#E5CFAF] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer QR Mobile View */}
                <Route path="/" element={<CustomerMenu />} />

                {/* Admin Authentication Screen */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Management Dashboard (Strictly Protected) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
