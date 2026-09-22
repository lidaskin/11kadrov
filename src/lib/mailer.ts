import nodemailer from 'nodemailer';
import { db } from '../db/index.ts';
import { emailLogs } from '../db/schema.ts';

export const TARGET_EMAIL = process.env.NOTIFICATION_EMAIL || 'chita11kadrov@mail.ru';

export interface ApplicationMailData {
  id?: number | string;
  authorName: string;
  birthDate?: string;
  age?: number | string;
  city?: string;
  organization?: string;
  phone: string;
  email: string;
  telegram?: string;
  workTitle: string;
  nominationTitle: string;
  duration?: string;
  description?: string;
  link: string;
  technique?: string;
}

// Check if SMTP credentials are provided in the environment
export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

// Create transport or null if not configured
function getTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Generate styled HTML template for the email notification
export function buildApplicationEmailHtml(data: ApplicationMailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0e21; color: #e2e8f0; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #121633; border: 1px solid #232b5d; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0d112d 0%, #171d47 100%); padding: 24px; border-bottom: 2px solid #00F0FF; text-align: center; }
    .badge { display: inline-block; background: rgba(0,240,255,0.15); color: #00F0FF; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(0,240,255,0.3); margin-bottom: 8px; }
    .title { color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
    .content { padding: 24px; }
    .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #FFD600; letter-spacing: 0.5px; margin: 18px 0 10px 0; border-bottom: 1px solid #242c61; padding-bottom: 6px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .info-table td { padding: 8px 10px; font-size: 13px; vertical-align: top; border-bottom: 1px solid #1a2046; }
    .info-table td.label { width: 150px; color: #94a3b8; font-weight: 600; }
    .info-table td.val { color: #f8fafc; font-weight: 500; }
    .btn-link { display: inline-block; background: #00F0FF; color: #000000 !important; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 10px; font-size: 14px; text-align: center; margin-top: 12px; }
    .footer { padding: 18px 24px; background: #0b0e22; border-top: 1px solid #1c224a; text-align: center; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Фестиваль анимации «11 кадров»</div>
      <h1 class="title">Новая конкурсная заявка</h1>
    </div>
    <div class="content">
      <div class="section-title">Анимационная работа</div>
      <table class="info-table">
        <tr><td class="label">Название:</td><td class="val"><strong>«${data.workTitle}»</strong></td></tr>
        <tr><td class="label">Номинация:</td><td class="val">${data.nominationTitle}</td></tr>
        ${data.duration ? `<tr><td class="label">Хронометраж:</td><td class="val">${data.duration}</td></tr>` : ''}
        ${data.technique ? `<tr><td class="label">Техника:</td><td class="val">${data.technique}</td></tr>` : ''}
        ${data.description ? `<tr><td class="label">Описание:</td><td class="val">${data.description}</td></tr>` : ''}
        <tr>
          <td class="label">Ссылка на видео:</td>
          <td class="val"><a href="${data.link}" target="_blank" style="color: #00F0FF; word-break: break-all;">${data.link}</a></td>
        </tr>
      </table>

      <div class="section-title">Автор / Коллектив</div>
      <table class="info-table">
        <tr><td class="label">ФИО:</td><td class="val"><strong>${data.authorName}</strong></td></tr>
        ${data.age ? `<tr><td class="label">Возраст:</td><td class="val">${data.age} лет</td></tr>` : ''}
        ${data.birthDate ? `<tr><td class="label">Дата рождения:</td><td class="val">${data.birthDate}</td></tr>` : ''}
        ${data.city ? `<tr><td class="label">Город / Населённый пункт:</td><td class="val">${data.city}</td></tr>` : ''}
        ${data.organization ? `<tr><td class="label">Студия / ШКИ:</td><td class="val">${data.organization}</td></tr>` : ''}
      </table>

      <div class="section-title">Контактные данные</div>
      <table class="info-table">
        <tr><td class="label">Телефон:</td><td class="val"><a href="tel:${data.phone}" style="color: #f8fafc; text-decoration: none;">${data.phone}</a></td></tr>
        <tr><td class="label">Email:</td><td class="val"><a href="mailto:${data.email}" style="color: #00F0FF;">${data.email}</a></td></tr>
        ${data.telegram ? `<tr><td class="label">Telegram:</td><td class="val">${data.telegram}</td></tr>` : ''}
      </table>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${data.link}" target="_blank" class="btn-link">Открыть работу в хранилище</a>
      </div>
    </div>
    <div class="footer">
      Заявка принята официальным сайтом фестиваля «11 кадров»<br>
      Получатель: ${TARGET_EMAIL} • Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yakutsk' })}
    </div>
  </div>
</body>
</html>
  `;
}

// Send application notification to TARGET_EMAIL
export async function sendApplicationEmail(data: ApplicationMailData, dbApplicationId?: number): Promise<{ success: boolean; simulated: boolean; messageId?: string; error?: string }> {
  const subject = `🎬 Заявка на фестиваль «11 кадров»: «${data.workTitle}» — ${data.authorName}`;
  const html = buildApplicationEmailHtml(data);
  const transporter = getTransporter();

  if (!transporter) {
    // SMTP is not yet configured with credentials in .env, so record in DB mail queue / logs
    console.log(`[MAILER SIMULATION] Target: ${TARGET_EMAIL}. New application from ${data.authorName} («${data.workTitle}»). SMTP credentials not set.`);
    
    try {
      await db.insert(emailLogs).values({
        recipient: TARGET_EMAIL,
        subject,
        applicationId: dbApplicationId,
        status: 'simulated',
        previewBody: `Заявка от ${data.authorName}, работа: «${data.workTitle}», контакты: ${data.email}, ${data.phone}`,
      });
    } catch (dbErr) {
      console.error('Failed to log simulated email to DB:', dbErr);
    }

    return {
      success: true,
      simulated: true,
      messageId: `sim_${Date.now()}`,
    };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || `"Фестиваль 11 кадров" <${process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to: TARGET_EMAIL,
      replyTo: data.email,
      subject,
      html,
    });

    console.log(`[MAILER SUCCESS] Email delivered to ${TARGET_EMAIL}. MessageId: ${info.messageId}`);

    try {
      await db.insert(emailLogs).values({
        recipient: TARGET_EMAIL,
        subject,
        applicationId: dbApplicationId,
        status: 'sent',
        previewBody: `Успешно отправлено на ${TARGET_EMAIL}`,
      });
    } catch (dbErr) {
      console.error('Failed to log sent email to DB:', dbErr);
    }

    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error(`[MAILER ERROR] Failed to send email to ${TARGET_EMAIL}:`, error);

    try {
      await db.insert(emailLogs).values({
        recipient: TARGET_EMAIL,
        subject,
        applicationId: dbApplicationId,
        status: 'failed',
        error: error?.message || 'SMTP delivery failed',
      });
    } catch (dbErr) {
      console.error('Failed to log failed email to DB:', dbErr);
    }

    return {
      success: false,
      simulated: false,
      error: error?.message || 'Ошибка отправки почты',
    };
  }
}

// Send test email
export async function sendTestMailerEmail(): Promise<{ success: boolean; simulated: boolean; error?: string; target: string }> {
  const transporter = getTransporter();
  const subject = `🔔 Тестовое сообщение почтового сервиса фестиваля «11 кадров»`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #0e122b; color: #fff; border-radius: 12px;">
      <h2 style="color: #00F0FF;">Проверка почтового шлюза фестиваля «11 кадров»</h2>
      <p>Почтовый сервис (Mailer) успешно настроен и подключен к базе данных!</p>
      <p>Все поступающие заявки участников автоматически сохраняются в базу данных Cloud SQL и направляются на адрес <strong>${TARGET_EMAIL}</strong>.</p>
      <hr style="border: 1px solid #232b5d;" />
      <small style="color: #94a3b8;">Время отправки: ${new Date().toISOString()}</small>
    </div>
  `;

  if (!transporter) {
    await db.insert(emailLogs).values({
      recipient: TARGET_EMAIL,
      subject,
      status: 'simulated',
      previewBody: 'Тестовая отправка (SMTP не настроен в .env, эмуляция активна)',
    });
    return {
      success: true,
      simulated: true,
      target: TARGET_EMAIL,
    };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || `"Фестиваль 11 кадров" <${process.env.SMTP_USER}>`;
    await transporter.sendMail({
      from: fromAddress,
      to: TARGET_EMAIL,
      subject,
      html,
    });

    await db.insert(emailLogs).values({
      recipient: TARGET_EMAIL,
      subject,
      status: 'sent',
      previewBody: `Тестовое письмо успешно доставлено на ${TARGET_EMAIL}`,
    });

    return {
      success: true,
      simulated: false,
      target: TARGET_EMAIL,
    };
  } catch (err: any) {
    await db.insert(emailLogs).values({
      recipient: TARGET_EMAIL,
      subject,
      status: 'failed',
      error: err?.message,
    });
    return {
      success: false,
      simulated: false,
      error: err?.message,
      target: TARGET_EMAIL,
    };
  }
}
