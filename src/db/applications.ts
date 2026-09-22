import { db } from './index.ts';
import { applications, emailLogs } from './schema.ts';
import { desc, eq } from 'drizzle-orm';
import { sendApplicationEmail, ApplicationMailData, TARGET_EMAIL } from '../lib/mailer.ts';

export async function submitApplicationWithMailer(appData: any) {
  try {
    // 1. Insert into database
    const newRecord = await db.insert(applications).values({
      externalId: appData.id || `app_${Date.now()}`,
      authorName: appData.authorName,
      birthDate: appData.birthDate || null,
      age: appData.age ? parseInt(String(appData.age), 10) : null,
      city: appData.city || null,
      organization: appData.organization || null,
      phone: appData.phone,
      email: appData.email,
      telegram: appData.telegram || null,
      workTitle: appData.workTitle,
      nominationId: appData.nominationId || 'main',
      nominationTitle: appData.nominationTitle || appData.nominationId || 'Конкурсная номинация',
      duration: appData.duration || null,
      description: appData.description || null,
      link: appData.link,
      technique: appData.technique || null,
      consent: Boolean(appData.consent ?? true),
      status: 'pending',
      emailSent: false,
    }).returning();

    const savedApp = newRecord[0];

    // 2. Dispatch email to chita11kadrov@mail.ru via mailer
    const mailPayload: ApplicationMailData = {
      id: savedApp.id,
      authorName: savedApp.authorName,
      birthDate: savedApp.birthDate || undefined,
      age: savedApp.age || undefined,
      city: savedApp.city || undefined,
      organization: savedApp.organization || undefined,
      phone: savedApp.phone,
      email: savedApp.email,
      telegram: savedApp.telegram || undefined,
      workTitle: savedApp.workTitle,
      nominationTitle: savedApp.nominationTitle,
      duration: savedApp.duration || undefined,
      description: savedApp.description || undefined,
      link: savedApp.link,
      technique: savedApp.technique || undefined,
    };

    const mailResult = await sendApplicationEmail(mailPayload, savedApp.id);

    // 3. Update application email status in DB
    await db.update(applications)
      .set({
        emailSent: mailResult.success,
        emailError: mailResult.error || null,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, savedApp.id));

    return {
      success: true,
      application: savedApp,
      mailResult,
      recipient: TARGET_EMAIL,
    };
  } catch (error) {
    console.error('Failed to submit application with mailer:', error);
    throw new Error('Database application submission failed', { cause: error });
  }
}

export async function getAllApplications() {
  try {
    return await db.select().from(applications).orderBy(desc(applications.createdAt));
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    throw new Error('Database fetch applications failed', { cause: error });
  }
}

export async function updateApplicationStatusInDb(id: number, status: string) {
  try {
    const updated = await db.update(applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error(`Failed to update application status ${id}:`, error);
    throw new Error('Database update status failed', { cause: error });
  }
}

export async function deleteApplicationFromDb(id: number) {
  try {
    await db.delete(applications).where(eq(applications.id, id));
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete application ${id}:`, error);
    throw new Error('Database delete application failed', { cause: error });
  }
}

export async function resendApplicationEmailById(id: number) {
  try {
    const found = await db.select().from(applications).where(eq(applications.id, id));
    if (found.length === 0) {
      throw new Error('Заявка не найдена в базе данных');
    }

    const app = found[0];
    const mailPayload: ApplicationMailData = {
      id: app.id,
      authorName: app.authorName,
      birthDate: app.birthDate || undefined,
      age: app.age || undefined,
      city: app.city || undefined,
      organization: app.organization || undefined,
      phone: app.phone,
      email: app.email,
      telegram: app.telegram || undefined,
      workTitle: app.workTitle,
      nominationTitle: app.nominationTitle,
      duration: app.duration || undefined,
      description: app.description || undefined,
      link: app.link,
      technique: app.technique || undefined,
    };

    const mailResult = await sendApplicationEmail(mailPayload, app.id);
    await db.update(applications)
      .set({
        emailSent: mailResult.success,
        emailError: mailResult.error || null,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, app.id));

    return mailResult;
  } catch (error) {
    console.error('Failed to resend email:', error);
    throw error;
  }
}

export async function getRecentEmailLogs(limitCount = 20) {
  try {
    return await db.select().from(emailLogs).orderBy(desc(emailLogs.createdAt)).limit(limitCount);
  } catch (error) {
    console.error('Failed to fetch email logs:', error);
    return [];
  }
}
