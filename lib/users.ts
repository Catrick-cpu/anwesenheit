import db, { initDb } from './db';
import { hashPassword, verifyPassword } from './auth';
import { randomUUID } from 'crypto';

// Initialize DB on module load
initDb();

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  duration_seconds: number | null;
  created_at: string;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'user' = 'user'
): Promise<User> {
  const id = randomUUID();
  const hashedPassword = await hashPassword(password);

  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    stmt.run(id, email, hashedPassword, name, role);

    return getUserById(id) as Promise<User>;
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export function getUserByEmail(email: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | null;
}

export function getUserById(id: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | null;
}

export async function validateUserLogin(
  email: string,
  password: string
): Promise<User | null> {
  const user = getUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password as any);
  if (!isValid) return null;

  return user;
}

export function createSession(userId: string): Session {
  const id = randomUUID();
  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, check_in, created_at)
    VALUES (?, ?, datetime('now'), datetime('now'))
  `);
  stmt.run(id, userId);

  return getSessionById(id) as Session;
}

export function getSessionById(id: string): Session | null {
  const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
  return stmt.get(id) as Session | null;
}

export function endSession(sessionId: string): Session | null {
  const stmt = db.prepare(`
    UPDATE sessions
    SET check_out = datetime('now'),
        duration_seconds = CAST((julianday('now') - julianday(check_in)) * 86400 AS INTEGER)
    WHERE id = ?
  `);
  stmt.run(sessionId);

  return getSessionById(sessionId);
}

export function getUserSessions(userId: string, limit = 50): Session[] {
  const stmt = db.prepare(`
    SELECT * FROM sessions
    WHERE user_id = ?
    ORDER BY check_in DESC
    LIMIT ?
  `);
  return stmt.all(userId, limit) as Session[];
}

export function getActiveSessions(): Session[] {
  const stmt = db.prepare(`
    SELECT s.*, u.name, u.email
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.check_out IS NULL
    ORDER BY s.check_in DESC
  `);
  return stmt.all() as any[];
}

export function getLeaderboard(limit = 10): any[] {
  const stmt = db.prepare(`
    SELECT
      u.id,
      u.name,
      u.email,
      COUNT(s.id) as total_sessions,
      SUM(COALESCE(s.duration_seconds, 0)) as total_seconds,
      MAX(s.check_in) as last_check_in
    FROM users u
    LEFT JOIN sessions s ON u.id = s.user_id
    WHERE u.role = 'user'
    GROUP BY u.id
    ORDER BY total_seconds DESC
    LIMIT ?
  `);
  return stmt.all(limit) as any[];
}

export function getStats(): any {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get() as any;
  const totalAdmins = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "admin"').get() as any;
  const totalSessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get() as any;
  const totalHours = db.prepare('SELECT SUM(duration_seconds) as total FROM sessions').get() as any;

  return {
    total_users: totalUsers.count,
    total_admins: totalAdmins.count,
    total_sessions: totalSessions.count,
    total_hours: totalHours.total ? Math.round(totalHours.total / 3600) : 0,
  };
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createAdminInvite(email: string, createdBy: string): string {
  const id = randomUUID();
  const code = generateInviteCode();

  try {
    const stmt = db.prepare(`
      INSERT INTO admin_invites (id, email, code, created_by, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(id, email, code, createdBy);
    return code;
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      throw new Error('Invite already exists for this email');
    }
    throw error;
  }
}

export function validateInviteCode(email: string, code: string): boolean {
  const stmt = db.prepare(`
    SELECT * FROM admin_invites
    WHERE email = ? AND code = ? AND used = 0
  `);
  const invite = stmt.get(email, code) as any;
  return !!invite;
}

export function markInviteAsUsed(email: string, code: string): void {
  const stmt = db.prepare(`
    UPDATE admin_invites
    SET used = 1
    WHERE email = ? AND code = ?
  `);
  stmt.run(email, code);
}
