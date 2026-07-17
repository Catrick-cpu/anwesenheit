import { NextRequest, NextResponse } from 'next/server';
import { getStats, getActiveSessions, getLeaderboard } from '@/lib/users';
import { getAuthCookie, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const stats = getStats();
    const activeSessions = getActiveSessions();
    const leaderboard = getLeaderboard(10);

    return NextResponse.json({
      stats,
      activeSessions,
      leaderboard,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
