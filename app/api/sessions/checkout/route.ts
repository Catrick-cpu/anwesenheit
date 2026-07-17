import { NextRequest, NextResponse } from 'next/server';
import { endSession, getActiveSessions, getUserById } from '@/lib/users';
import { getAuthCookie, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find active session for this user
    const activeSessions = getActiveSessions();
    const userSession = activeSessions.find(s => s.user_id === decoded.userId);

    if (!userSession) {
      return NextResponse.json({ error: 'No active session found' }, { status: 404 });
    }

    const session = endSession(userSession.id);

    return NextResponse.json({
      success: true,
      session: {
        id: session?.id,
        check_in: session?.check_in,
        check_out: session?.check_out,
        duration_seconds: session?.duration_seconds,
      },
    });
  } catch (error: any) {
    console.error('Check-out error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
