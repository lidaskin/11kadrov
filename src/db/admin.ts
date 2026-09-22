import { db } from './index.ts';
import { adminCredentials, adminAuditLogs } from './schema.ts';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

export async function verifyAdminLogin(password: string, ipAddress?: string) {
  try {
    const hashed = hashPassword(password);
    
    // Check if admin exists
    const admins = await db.select().from(adminCredentials).where(eq(adminCredentials.username, 'admin'));
    
    if (admins.length === 0) {
      // Auto-seed default admin if table was empty
      await db.insert(adminCredentials).values({
        username: 'admin',
        passwordHash: hashPassword('11kadrov'),
        role: 'admin',
        isActive: true,
      }).onConflictDoNothing();
      
      const recheck = await db.select().from(adminCredentials).where(eq(adminCredentials.username, 'admin'));
      if (recheck.length > 0 && (recheck[0].passwordHash === hashed || password.trim() === '11kadrov')) {
        await db.update(adminCredentials)
          .set({ lastLoginAt: new Date(), updatedAt: new Date() })
          .where(eq(adminCredentials.id, recheck[0].id));
          
        await db.insert(adminAuditLogs).values({
          username: 'admin',
          action: 'LOGIN',
          ipAddress: ipAddress || 'internal',
          success: true,
        });

        return { success: true, username: 'admin', role: recheck[0].role };
      }
    }

    const admin = admins[0];
    if (!admin || !admin.isActive) {
      await db.insert(adminAuditLogs).values({
        username: 'admin',
        action: 'LOGIN',
        ipAddress: ipAddress || 'internal',
        success: false,
      });
      return { success: false, error: 'Аккаунт администратора не найден или заблокирован.' };
    }

    const isValid = admin.passwordHash === hashed || (password.trim() === '11kadrov' && admin.passwordHash === hashPassword('11kadrov'));

    await db.insert(adminAuditLogs).values({
      username: 'admin',
      action: 'LOGIN',
      ipAddress: ipAddress || 'internal',
      success: isValid,
    });

    if (isValid) {
      await db.update(adminCredentials)
        .set({ lastLoginAt: new Date(), updatedAt: new Date() })
        .where(eq(adminCredentials.id, admin.id));

      return {
        success: true,
        username: admin.username,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
      };
    } else {
      return { success: false, error: 'Неверный пароль администратора.' };
    }
  } catch (error) {
    console.error('Error verifying admin login:', error);
    throw new Error('Database authentication check failed', { cause: error });
  }
}

export async function changeAdminPassword(currentPass: string, newPass: string) {
  try {
    const loginResult = await verifyAdminLogin(currentPass);
    if (!loginResult.success) {
      return { success: false, error: 'Текущий пароль указан неверно.' };
    }

    if (!newPass || newPass.trim().length < 4) {
      return { success: false, error: 'Новый пароль должен содержать минимум 4 символа.' };
    }

    const newHash = hashPassword(newPass);
    await db.update(adminCredentials)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(adminCredentials.username, 'admin'));

    await db.insert(adminAuditLogs).values({
      username: 'admin',
      action: 'PASSWORD_CHANGE',
      ipAddress: 'internal',
      success: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Error changing admin password:', error);
    throw new Error('Failed to update admin password in database', { cause: error });
  }
}

export async function getAdminDbStatus() {
  try {
    const admins = await db.select().from(adminCredentials).where(eq(adminCredentials.username, 'admin'));
    if (admins.length === 0) {
      return { configured: false, connected: true };
    }
    return {
      configured: true,
      connected: true,
      lastLoginAt: admins[0].lastLoginAt,
      role: admins[0].role,
    };
  } catch (error) {
    console.error('Error getting admin db status:', error);
    return { configured: false, connected: false, error: 'SQL connection pending or unavailable' };
  }
}
