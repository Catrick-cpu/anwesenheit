'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AdminStats({ stats, activeSessions }: any) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.stat-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out',
      }
    );
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.total_users || 0,
      icon: '👥',
      color: 'from-blue-600 to-blue-400',
    },
    {
      label: 'Administrators',
      value: stats?.total_admins || 0,
      icon: '🔐',
      color: 'from-purple-600 to-purple-400',
    },
    {
      label: 'Total Sessions',
      value: stats?.total_sessions || 0,
      icon: '⏱️',
      color: 'from-green-600 to-green-400',
    },
    {
      label: 'Total Hours Logged',
      value: stats?.total_hours || 0,
      icon: '⌛',
      color: 'from-orange-600 to-orange-400',
    },
    {
      label: 'Currently Online',
      value: activeSessions?.length || 0,
      icon: '🟢',
      color: 'from-red-600 to-red-400',
    },
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className="stat-card bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`text-3xl bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}>
              {card.icon}
            </div>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color}`}></div>
          </div>
          <p className="text-slate-400 text-sm font-medium">{card.label}</p>
          <p className="text-white text-3xl font-bold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
