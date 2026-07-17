'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface InviteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteModal({ onClose, onSuccess }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out' }
    );
  }, []);

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate invite');
        setLoading(false);
        return;
      }

      setInviteCode(data.code);
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: 'back.in',
      onComplete: onClose,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Invite Administrator</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition text-2xl"
          >
            ×
          </button>
        </div>

        {inviteCode ? (
          <div className="space-y-4">
            <div>
              <p className="text-slate-300 text-sm mb-2">Invite code generated for:</p>
              <p className="text-white font-semibold">{email}</p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-slate-300 text-xs mb-2">Share this code:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inviteCode}
                  readOnly
                  className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono font-bold"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteCode);
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <p className="text-slate-400 text-xs">
              Share this code with {email}. They can use it to create an admin account.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerateInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Invite Code'}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
