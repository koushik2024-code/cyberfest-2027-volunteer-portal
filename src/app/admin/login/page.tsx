'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  KeyRound,
  Info,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@cbit.ac.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both administrator email and access password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials. Access rejected.');
        setIsLoading(false);
        return;
      }

      // Successful login
      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Connection failure while reaching authentication gateway.');
      setIsLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('admin@cbit.ac.in');
    setPassword('CyberFest2027!Admin');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)]">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wide">
            DDC ADMIN LOGIN
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            CyberFest 2027 • Digital Defence Club Security Gateway
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] backdrop-blur-md space-y-5"
        >
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-start space-x-2 animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="adminEmail"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Administrator Email
            </label>
            <div className="relative">
              <input
                id="adminEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cbit.ac.in"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label
              htmlFor="adminPassword"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Secret Access Key
            </label>
            <div className="relative">
              <input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING PRIVILEGES...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>ACCESS COMMAND DASHBOARD</span>
              </>
            )}
          </button>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-cyan-400">
                <Info className="w-3.5 h-3.5" />
                <span>Default Credentials:</span>
              </span>
              <button
                type="button"
                onClick={fillDefaultCredentials}
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
              >
                Auto-Fill Demo
              </button>
            </div>
            <p className="mt-1 text-slate-500">
              Email: <code className="text-slate-300">admin@cbit.ac.in</code> | Password:{' '}
              <code className="text-slate-300">CyberFest2027!Admin</code>
            </p>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors"
          >
            ← Return to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
