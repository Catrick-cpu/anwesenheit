import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, verifyToken } from '@/lib/auth';
import { createAdminInvite } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const code = createAdminInvite(email, decoded.userId);

    return NextResponse.json({
      success: true,
      code,
      email,
    });
  } catch (error: any) {
    console.error('Invite error:', error);
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: 'Invite already sent to this email' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
