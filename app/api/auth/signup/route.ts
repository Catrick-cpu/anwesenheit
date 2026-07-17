import { NextRequest, NextResponse } from 'next/server';
import { createUser, validateInviteCode, markInviteAsUsed } from '@/lib/users';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, inviteCode } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate invite code if creating admin
    let role: 'admin' | 'user' = 'user';
    if (inviteCode) {
      if (!validateInviteCode(email, inviteCode)) {
        return NextResponse.json({ error: 'Invalid invite code' }, { status: 401 });
      }
      role = 'admin';
    }

    const user = await createUser(email, password, name, role);

    if (inviteCode) {
      markInviteAsUsed(email, inviteCode);
    }

    const token = createToken(user.id, user.role);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
