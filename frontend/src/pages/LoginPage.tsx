import React, { useState } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { useAppState } from '../context/AppState';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { AIOrb } from '../components/AIOrb';
import { supabase } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const { setCurrentPage, addToast } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuth = async (provider: 'google' | 'github') => {
    addToast(`Connecting ${provider} baseline...`, 'info');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      addToast(err.message || `Failed to authenticate with ${provider}`, 'error');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email first to reset your password.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      addToast('Password reset instructions sent to your email.', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Cognitive key email is required');
      return;
    }

    if (!email.includes('@')) {
      setEmailError('Please enter a valid cognitive key email');
      return;
    }

    if (!password) {
      addToast('Password is required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: email.split('@')[0] }
          }
        });
        if (error) throw error;
        addToast('Registration successful! Please sign in.', 'success');
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        addToast('Authentication successful.', 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between py-8 px-4 relative bg-white overflow-y-auto no-scrollbar">

      {/* Top action back to landing */}
      <header className="max-w-md mx-auto w-full z-10">
        <button
          onClick={() => setCurrentPage('landing')}
          disabled={isLoading}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-100 bg-white/70 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all hover:-translate-x-0.5 shadow-sm disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full flex flex-col items-center justify-center z-10 py-6">

        {/* Floating AI Orb */}
        <div className="mb-6">
          <AIOrb size="sm" state={isLoading ? 'thinking' : 'idle'} />
        </div>

        <Card className="w-full p-8 shadow-premium border-slate-100/50">

          {/* Headline details */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {isRegistering ? 'Initialize Profile' : 'Access ProfileMind'}
            </h2>
            <p className="text-xs font-medium text-slate-400">
              {isRegistering ? 'Create your cognitive baseline' : 'Sync your cognitive digital baseline'}
            </p>
          </div>

          {/* Social Sign Ins */}
          {!isRegistering && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant="secondary"
                disabled={isLoading}
                className="py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-100 hover:border-slate-200"
                onClick={() => handleOAuth('google')}
                icon={
                  <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.08-1.32-.18-1.886H12.24z" />
                  </svg>
                }
              >
                Google
              </Button>

              <Button
                variant="secondary"
                disabled={isLoading}
                className="py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-100 hover:border-slate-200"
                onClick={() => handleOAuth('github')}
                icon={
                  <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                }
              >
                GitHub
              </Button>
            </div>
          )}

          {/* Divider */}
          {!isRegistering && (
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-slate-50"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or email key</span>
              <div className="flex-grow border-t border-slate-50"></div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Cognitive Key (Email)"
              placeholder="identity@profilemind.ai"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              required
              disabled={isLoading}
            />

            <Input
              label="Biometric Passcode"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              iconRight={
                showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815L21 21m-3.957-3.957l-1.4 1.4m-1.397-1.397a4.5 4.5 0 00-6.364-6.364l1.397 1.397" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              }
              onIconRightClick={() => setShowPassword(!showPassword)}
              required
            />

            {!isRegistering && (
              <div className="flex justify-between items-center text-xs font-semibold px-1">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-200 text-brand-blue focus:ring-brand-blue" defaultChecked disabled={isLoading} />
                  Remember key
                </label>
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  className={`text-brand-purple hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Decrypt passcode?
                </a>
              </div>
            )}

            <Button type="submit" className="mt-4 flex items-center justify-center gap-2" disabled={isLoading}>
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isRegistering ? 'Initialize Node' : 'Authenticate baseline'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <span className="text-xs text-slate-400">
              {isRegistering ? 'Already have a neural baseline?' : 'New neural baseline?'}
              {' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) setIsRegistering(!isRegistering);
                }}
                className={`font-bold text-brand-blue hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              >
                {isRegistering ? 'Sign In' : 'Create Account'}
              </a>
            </span>
          </div>

        </Card>
      </main>

      {/* Meta Footer */}
      <footer className="max-w-md mx-auto w-full z-10 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          SECURED VIA Decentralized Homomorphic Keys
        </p>
      </footer>

    </div>
  );
};
