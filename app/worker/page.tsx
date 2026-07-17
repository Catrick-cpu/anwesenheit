'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function WorkerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
  }, [router]);

  const animateButton = () => {
    if (!buttonRef.current) return;

    gsap.timeline()
      .to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
      })
      .to(buttonRef.current, {
        scale: 1,
        duration: 0.1,
      });
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    if (!messageRef.current) return;

    setMessage(text);
    gsap.fromTo(
      messageRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

    setTimeout(() => {
      gsap.to(messageRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => setMessage(''),
      });
    }, 3000);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    animateButton();

    try {
      const res = await fetch('/api/sessions/checkin', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || 'Check-in failed', 'error');
        setLoading(false);
        return;
      }

      setIsCheckedIn(true);
      setCurrentSessionId(data.session.id);
      setSessionStart(new Date(data.session.check_in));
      showMessage('Checked in successfully!', 'success');
      localStorage.setItem('sessionId', data.session.id);
    } catch (err) {
      showMessage('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    animateButton();

    try {
      const res = await fetch('/api/sessions/checkout', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || 'Check-out failed', 'error');
        setLoading(false);
        return;
      }

      setIsCheckedIn(false);
      setCurrentSessionId(null);
      setSessionStart(null);
      localStorage.removeItem('sessionId');
      showMessage('Checked out successfully!', 'success');
    } catch (err) {
      showMessage('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    router.push('/');
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user.name}!</h1>
            <p className="text-slate-400 mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            ref={messageRef}
            className={`p-4 rounded-lg mb-8 ${
              message.includes('successfully')
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {isCheckedIn ? 'You are checked in' : 'You are checked out'}
            </h2>

            {isCheckedIn && sessionStart && (
              <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-slate-300 text-sm">Session started at</p>
                <p className="text-blue-400 font-mono text-lg">
                  {sessionStart.toLocaleTimeString()}
                </p>
              </div>
            )}

            <button
              ref={buttonRef}
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              disabled={loading}
              className={`w-full py-4 px-6 text-white font-bold text-2xl rounded-xl transition transform ${
                isCheckedIn
                  ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                  : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
              } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : isCheckedIn ? (
                <span>Check Out</span>
              ) : (
                <span>Check In</span>
              )}
            </button>

            <p className="text-slate-500 text-sm mt-6">
              {isCheckedIn
                ? 'Click the button above to end your work session'
                : 'Click the button above to start your work session'}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Status</p>
            <p className="text-white font-semibold mt-1">
              {isCheckedIn ? '✓ Active' : '✗ Inactive'}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Role</p>
            <p className="text-white font-semibold mt-1 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
