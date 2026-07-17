'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AdminLeaderboard({ leaderboard }: any) {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    const rows = tableRef.current.querySelectorAll('tbody tr');
    gsap.fromTo(
      rows,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out',
      }
    );
  }, [leaderboard]);

  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '🔹';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-white">Sessions</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-white">Total Time</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-white">Last Active</th>
            </tr>
          </thead>
          <tbody ref={tableRef} className="divide-y divide-slate-700">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((user: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-white font-bold text-lg">
                    {getMedalEmoji(idx)}
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-right text-white font-semibold">
                    {user.total_sessions || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                      {formatSeconds(user.total_seconds || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 text-sm">
                    {user.last_check_in
                      ? new Date(user.last_check_in).toLocaleDateString()
                      : 'Never'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
