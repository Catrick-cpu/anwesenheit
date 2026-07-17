'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AdminSessions({ sessions }: any) {
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
  }, [sessions]);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-600">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Checked In</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody ref={tableRef} className="divide-y divide-slate-700">
            {sessions && sessions.length > 0 ? (
              sessions.map((session: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-white font-medium">{session.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{session.email}</td>
                  <td className="px-6 py-4 text-white">
                    {formatTime(session.check_in)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      Online
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  No users currently online
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
