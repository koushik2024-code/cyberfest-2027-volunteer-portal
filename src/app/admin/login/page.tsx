'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter the administrator access password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
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

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-6">
        {/* Header with Official DDC & CyberFest Logos */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative w-14 h-14 rounded-full p-1 bg-slate-900 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Image
                src="/images/ddc-logo-circle.png"
                alt="Digital Defence Club (DDC) Logo"
                fill
                className="object-contain p-0.5 rounded-full"
                priority
              />
            </div>
            <div className="relative w-14 h-14 rounded-full p-1 bg-slate-900 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Image
                src="/images/cyberfest-logo-circle.png"
                alt="CyberFest 2027 Logo"
                fill
                className="object-contain p-0.5 rounded-full"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wide">
            ADMIN GATEWAY
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            CyberFest 2027 • Digital Defence Club Security Verification
          </p>
        </div>

        {/* Login Card (Only Password Required) */}
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
              htmlFor="adminPassword"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Access Password
            </label>
            <div className="relative">
              <input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
            className="w-full py-3.5 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>VERIFYING ACCESS...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>ACCESS COMMAND DASHBOARD</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 pt-2 text-[11px] font-mono text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>Authorized Committee &amp; Core Executive Access</span>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors"
          >
            ← Return to Registration Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
