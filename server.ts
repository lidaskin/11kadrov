import express from 'express';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { createServer as createViteServer } from 'vite';
import { verifyAdminLogin, changeAdminPassword, getAdminDbStatus } from './src/db/admin.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUsers } from './src/db/users.ts';
import {
  submitApplicationWithMailer,
  getAllApplications,
  updateApplicationStatusInDb,
  deleteApplicationFromDb,
  resendApplicationEmailById,
  getRecentEmailLogs,
} from './src/db/applications.ts';
import { sendTestMailerEmail, isSmtpConfigured, TARGET_EMAIL } from './src/lib/mailer.ts';
import { createPool } from './src/db/index.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'festival-11-kadrov-api' });
  });

  // Admin database status endpoint
  app.get('/api/admin/status', async (req, res) => {
    try {
      const status = await getAdminDbStatus();
      res.json({
        engine: 'Cloud SQL Relational Database',
        ...status,
      });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Database status check failed' });
    }
  });

  // Admin login via database check
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: 'Пароль обязателен для входа' });
      }

      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      const result = await verifyAdminLogin(password, clientIp);

      if (result.success) {
        return res.json({
          success: true,
          username: result.username,
          role: result.role,
          token: `db_token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        });
      } else {
        return res.status(401).json({
          success: false,
          error: result.error || 'Неверный пароль администратора',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка проверки базы данных',
      });
    }
  });

  // Admin change password in database
  app.post('/api/admin/change-password', async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Укажите текущий и новый пароль' });
      }

      const result = await changeAdminPassword(currentPassword, newPassword);
      if (result.success) {
        return res.json({ success: true, message: 'Пароль успешно обновлён в базе данных' });
      } else {
        return res.status(400).json({ success: false, error: result.error });
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      return res.status(500).json({ success: false, error: 'Ошибка при сохранении в базу данных' });
    }
  });

  // ================= APPLICATION SUBMISSION & MAILER =================

  // Submit competition application: Saves to Cloud SQL + triggers Mailer to chita11kadrov@mail.ru
  app.post('/api/applications', async (req, res) => {
    try {
      const appData = req.body;
      if (!appData.authorName || !appData.phone || !appData.email || !appData.workTitle || !appData.link) {
        return res.status(400).json({
          success: false,
          error: 'Заполните обязательные поля: ФИО, телефон, email, название работы и ссылку',
        });
      }

      const result = await submitApplicationWithMailer(appData);
      res.json(result);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Ошибка сохранения заявки в базу данных',
      });
    }
  });

  // Fetch all applications from Cloud SQL database
  app.get('/api/applications', async (req, res) => {
    try {
      const apps = await getAllApplications();
      res.json(apps);
    } catch (error: any) {
      console.error('Error fetching applications from DB:', error);
      res.status(500).json({ error: error?.message || 'Ошибка загрузки заявок из базы' });
    }
  });

  // Update application status in DB
  app.patch('/api/applications/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: 'Не указан ID или статус' });
      }
      const updated = await updateApplicationStatusInDb(id, status);
      res.json({ success: true, application: updated });
    } catch (error: any) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: error?.message || 'Ошибка обновления статуса' });
    }
  });

  // Delete application from DB
  app.delete('/api/applications/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) {
        return res.status(400).json({ error: 'Не указан ID заявки' });
      }
      const result = await deleteApplicationFromDb(id);
      res.json(result);
    } catch (error: any) {
      console.error('Error deleting application:', error);
      res.status(500).json({ error: error?.message || 'Ошибка удаления заявки' });
    }
  });

  // Resend email notification for an application
  app.post('/api/applications/:id/resend-email', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) {
        return res.status(400).json({ error: 'Не указан ID заявки' });
      }
      const result = await resendApplicationEmailById(id);
      res.json(result);
    } catch (error: any) {
      console.error('Error resending email:', error);
      res.status(500).json({ error: error?.message || 'Ошибка повторной отправки' });
    }
  });

  // ================= MAILER CONFIGURATION & TEST =================

  // Get mailer status
  app.get('/api/mailer/status', (req, res) => {
    res.json({
      targetEmail: TARGET_EMAIL,
      isConfigured: isSmtpConfigured(),
      host: process.env.SMTP_HOST || 'Не настроен (эмуляция доставки)',
      port: process.env.SMTP_PORT || '465',
      user: process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(3) : 'Не задан',
    });
  });

  // Send test email to TARGET_EMAIL
  app.post('/api/mailer/test', async (req, res) => {
    try {
      const result = await sendTestMailerEmail();
      res.json(result);
    } catch (error: any) {
      console.error('Error sending test email:', error);
      res.status(500).json({ error: error?.message || 'Ошибка тестовой отправки' });
    }
  });

  // Get recent email logs
  app.get('/api/mailer/logs', async (req, res) => {
    try {
      const logs = await getRecentEmailLogs(50);
      res.json(logs);
    } catch (error: any) {
      console.error('Error fetching email logs:', error);
      res.status(500).json({ error: error?.message || 'Ошибка получения логов почты' });
    }
  });

  // ================= REMOTE DATABASE MANAGEMENT & CONSOLE =================

  // Database statistics
  app.get('/api/database/stats', async (req, res) => {
    try {
      const pool = createPool();
      const appsCount = await pool.query('SELECT count(*) as count FROM applications');
      const logsCount = await pool.query('SELECT count(*) as count FROM email_logs');
      const auditCount = await pool.query('SELECT count(*) as count FROM admin_audit_logs');
      const usersCount = await pool.query('SELECT count(*) as count FROM users');

      res.json({
        success: true,
        database: process.env.SQL_DB_NAME || 'Cloud SQL',
        host: process.env.SQL_HOST ? 'Unix Domain Socket' : 'localhost',
        connected: true,
        counts: {
          applications: parseInt(appsCount.rows[0]?.count || '0', 10),
          emailLogs: parseInt(logsCount.rows[0]?.count || '0', 10),
          auditLogs: parseInt(auditCount.rows[0]?.count || '0', 10),
          users: parseInt(usersCount.rows[0]?.count || '0', 10),
        },
      });
    } catch (error: any) {
      console.error('Error fetching DB stats:', error);
      res.status(500).json({ success: false, error: error?.message || 'DB Stats failed' });
    }
  });

  // Execute safe query in admin SQL console
  app.post('/api/database/query', async (req, res) => {
    try {
      const { sql } = req.body;
      if (!sql || typeof sql !== 'string') {
        return res.status(400).json({ error: 'Строка SQL-запроса обязательна' });
      }

      const trimmed = sql.trim();
      const lower = trimmed.toLowerCase();

      // Prohibit destructive operations like drop table/database
      if (lower.startsWith('drop') || lower.includes('drop database') || lower.includes('drop table')) {
        return res.status(403).json({ error: 'Операции DROP заблокированы в целях безопасности' });
      }

      const pool = createPool();
      const start = Date.now();
      const result = await pool.query(trimmed);
      const duration = Date.now() - start;

      res.json({
        success: true,
        command: result.command,
        rowCount: result.rowCount,
        fields: result.fields?.map((f) => ({ name: f.name, dataTypeId: f.dataTypeID })),
        rows: result.rows || [],
        durationMs: duration,
      });
    } catch (error: any) {
      console.error('Error executing query:', error);
      res.status(400).json({
        success: false,
        error: error?.message || 'Ошибка выполнения SQL-запроса',
      });
    }
  });

  // Authenticated user API endpoint
  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.user?.uid && req.user?.email) {
        await getOrCreateUser(req.user.uid, req.user.email);
      }
      const allUsers = await getUsers();
      res.json(allUsers);
    } catch (error: any) {
      console.error('Failed to query users:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // ================= EXPORT & DEPLOYMENT BUNDLE =================

  // Download raw PostgreSQL schema.sql
  app.get('/api/export/schema.sql', (req, res) => {
    try {
      const schemaPath = path.join(process.cwd(), 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="schema.sql"');
        return res.sendFile(schemaPath);
      }
      res.status(404).json({ error: 'schema.sql not found' });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to read schema.sql' });
    }
  });

  // Download deployment instructions
  app.get('/api/export/readme', (req, res) => {
    try {
      const readmePath = path.join(process.cwd(), 'README_DEPLOY.md');
      if (fs.existsSync(readmePath)) {
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="README_DEPLOY.md"');
        return res.sendFile(readmePath);
      }
      res.status(404).json({ error: 'README_DEPLOY.md not found' });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to read README_DEPLOY.md' });
    }
  });

  // Download complete full-stack project deployment package as ZIP
  app.get('/api/export/full-bundle', async (req, res) => {
    try {
      const zip = new JSZip();
      const rootDir = process.cwd();

      // Recursive helper to pack project into zip
      function addDirectoryToZip(dirPath: string, zipFolder: JSZip) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          const relativeName = entry.name;

          // Exclude generated builds, modules, git, and pre-existing zip bundles
          if (
            relativeName === 'node_modules' ||
            relativeName === '.git' ||
            relativeName === 'dist' ||
            relativeName === 'bun.lock' ||
            relativeName.startsWith('.vite') ||
            relativeName.endsWith('.zip')
          ) {
            continue;
          }

          if (entry.isDirectory()) {
            const subFolder = zipFolder.folder(relativeName);
            if (subFolder) {
              addDirectoryToZip(fullPath, subFolder);
            }
          } else if (entry.isFile()) {
            const fileData = fs.readFileSync(fullPath);
            zipFolder.file(relativeName, fileData);
          }
        }
      }

      addDirectoryToZip(rootDir, zip);

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const filename = `festival-11-kadrov-server-${new Date().toISOString().slice(0, 10)}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', zipBuffer.length.toString());
      res.send(zipBuffer);
    } catch (err: any) {
      console.error('Error generating project zip bundle:', err);
      res.status(500).json({ error: err?.message || 'Failed to generate bundle' });
    }
  });

  // Direct downloads for site zip archives
  app.get(['/download-archive', '/festival-11-kadrov-full-site.zip', '/festival_11_kadrov_website.zip'], (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="festival-11-kadrov-full-site.zip"');
    const filePath = path.join(process.cwd(), 'public', 'festival-11-kadrov-full-site.zip');
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    res.redirect('/api/export/full-bundle');
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
