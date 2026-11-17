import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { KabunLogo } from '../components/common/KabunLogo';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setError('Access temporarily locked due to too many failed attempts. Please wait 30 seconds.');
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Please enter both your username and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(username.trim(), password);
      setFailedAttempts(0);
      navigate('/admin');
    } catch (err: any) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 5) {
        setIsLocked(true);
        setError('Too many failed attempts. Login locked for 30 seconds.');
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
          setError(null);
        }, 30000);
      } else {
        const errorMsg = err.message?.includes('Incorrect password')
          ? 'Incorrect password. Access denied.'
          : err.message || 'Invalid username or password. Access denied.';
        setError(`${errorMsg} (${5 - nextAttempts} attempts remaining)`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071B19] flex flex-col justify-center items-center p-4 selection:bg-[#E5CFAF] selection:text-[#0E2F2C]">
      {/* Return to menu link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-headline text-xs uppercase tracking-wider text-[#A1A1AA] hover:text-[#E5CFAF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Coffee Menu</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#0E2F2C] border border-[#1D4D47] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E5CFAF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3 mb-6 relative z-10">
          <div className="flex justify-center">
            <KabunLogo variant="full" className="w-40 sm:w-48" />
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <Shield className="w-4 h-4 text-[#E5CFAF]" />
            <h1 className="font-headline text-lg font-bold text-white uppercase tracking-wider">
              Management Portal
            </h1>
          </div>
          <p className="font-body text-xs text-[#DFC69E]/80">
            Authorized personnel only. Please sign in with your roastery manager credentials.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-300 animate-in fade-in relative z-10">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <Input
            label="Username or Email"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username or email"
            leftIcon={<User className="w-4 h-4 text-[#DFC69E]" />}
            required
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter manager password"
            leftIcon={<Lock className="w-4 h-4 text-[#DFC69E]" />}
            required
          />

          <Button
            size="lg"
            type="submit"
            className="w-full mt-2 font-extrabold !bg-[#E5CFAF] !text-[#0E2F2C] hover:!bg-[#F5E6D0] hover:shadow-[0_0_20px_rgba(229,207,175,0.3)] transition-all"
            isLoading={isLoading}
            disabled={isLocked}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#1D4D47] text-center relative z-10">
          <p className="text-[11px] text-[#DFC69E]/60">
            Kabun Coffee + Roastery (ካቡን) &bull; Secure Roastery Operations
          </p>
        </div>
      </div>
    </div>
  );
};
