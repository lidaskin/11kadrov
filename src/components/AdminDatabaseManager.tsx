import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import { downloadFile } from '../utils/downloader';
import {
  Database,
  Mail,
  Server,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Terminal,
  Send,
  Download,
  Check,
  HardDrive,
  Copy,
  FileText,
  Layers,
} from 'lucide-react';

interface DbStats {
  success: boolean;
  database: string;
  host: string;
  connected: boolean;
  counts: {
    applications: number;
    emailLogs: number;
    auditLogs: number;
    users: number;
  };
}

interface MailerStatus {
  targetEmail: string;
  isConfigured: boolean;
  host: string;
  port: string;
  user: string;
}

interface EmailLogItem {
  id: number;
  recipient: string;
  subject: string;
  status: string;
  error?: string;
  createdAt: string;
}

interface QueryResult {
  command?: string;
  rowCount?: number;
  fields?: { name: string }[];
  rows?: any[];
  durationMs?: number;
}

export const AdminDatabaseManager: React.FC = () => {
  const [stats, setStats] = useState<DbStats | null>(null);
  const [mailerStatus, setMailerStatus] = useState<MailerStatus | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; ms: number } | null>(null);

  // Mailer test state
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT id, author_name, work_title, phone, email, status, email_sent, created_at FROM applications ORDER BY id DESC LIMIT 20;'
  );
  const [executingQuery, setExecutingQuery] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [downloadingBundle, setDownloadingBundle] = useState(false);

  const handleDownloadServerBundle = async () => {
    setDownloadingBundle(true);
    const filename = `festival_11_kadrov_server_${new Date().toISOString().slice(0, 10)}.zip`;
    const success = await downloadFile('/festival-11-kadrov-full-site.zip', filename);
    if (!success) {
      window.open('/festival-11-kadrov-full-site.zip', '_blank');
    }
    setDownloadingBundle(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, mailerRes, logsRes] = await Promise.all([
        fetch('/api/database/stats'),
        fetch('/api/mailer/status'),
        fetch('/api/mailer/logs'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (mailerRes.ok) {
        const mailerData = await mailerRes.json();
        setMailerStatus(mailerData);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setEmailLogs(logsData);
      }
    } catch (e) {
      console.error('Failed to load DB & Mailer info:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePing = async () => {
    setPinging(true);
    setPingResult(null);
    const start = performance.now();
    try {
      const res = await fetch('/api/admin/status');
      const duration = Math.round(performance.now() - start);
      if (res.ok) {
        setPingResult({ success: true, ms: duration });
      } else {
        setPingResult({ success: false, ms: duration });
      }
    } catch {
      setPingResult({ success: false, ms: 0 });
    } finally {
      setPinging(false);
    }
  };

  const handleSendTestMail = async () => {
    setTestSending(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/mailer/test', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.simulated
            ? `Тестовое сообщение успешно сформировано и залогировано для ${data.target} (в режиме эмуляции)`
            : `Тестовое письмо успешно отправлено на ${data.target}!`,
        });
        // Refresh logs
        const logsRes = await fetch('/api/mailer/logs');
        if (logsRes.ok) setEmailLogs(await logsRes.json());
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Ошибка при отправке тестового сообщения',
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'Сетевая ошибка при обращении к почтовому сервису',
      });
    } finally {
      setTestSending(false);
    }
  };

  const handleExecuteSql = async (customSql?: string) => {
    const toRun = customSql || sqlQuery;
    if (!toRun.trim()) return;

    setExecutingQuery(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      const res = await fetch('/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: toRun }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setQueryResult(data);
      } else {
        setQueryError(data.error || 'Ошибка выполнения SQL');
      }
    } catch (e: any) {
      setQueryError(e?.message || 'Сетевая ошибка при запросе к базе');
    } finally {
      setExecutingQuery(false);
    }
  };

  const handleExportCsv = () => {
    if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) return;
    const headers = Object.keys(queryResult.rows[0]);
    const csvRows = [
      headers.join(';'),
      ...queryResult.rows.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            if (val === null || val === undefined) return '';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(';')
      ),
    ];
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sql_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0e163d] via-[#121c4e] to-[#0c1336] border border-[#2d3a7c] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] shadow-lg shadow-[#00F0FF]/20 flex-shrink-0">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Подключено онлайн
                </span>
                <span className="text-xs text-gray-400 font-mono">Cloud SQL / PostgreSQL</span>
              </div>
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                База данных & Почтовый шлюз (Mailer)
              </h2>
              <p className="text-xs text-gray-300 max-w-2xl mt-1 leading-relaxed">
                Интегрированная система приёма конкурсных заявок: каждая поступившая работа моментально записывается в
                реляционную базу данных и пересылается на почту{' '}
                <strong className="text-[#00F0FF] underline decoration-[#00F0FF]/40">
                  {mailerStatus?.targetEmail || 'chita11kadrov@mail.ru'}
                </strong>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePing}
              disabled={pinging}
              className="px-4 py-2.5 rounded-xl bg-[#1a2353] hover:bg-[#253275] border border-[#394994] text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00F0FF] ${pinging ? 'animate-spin' : ''}`} />
              <span>{pinging ? 'Проверка...' : 'Пинг БД'}</span>
              {pingResult && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    pingResult.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {pingResult.ms} мс
                </span>
              )}
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#141a3d] hover:bg-[#1f285c] border border-[#2b3874] text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Обновить состояние"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Production Server Export & Deployment Card */}
      <div className="bg-gradient-to-br from-[#12183e] via-[#101538] to-[#161c46] border-2 border-[#00F0FF]/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFD600]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#00F0FF] text-black">
                Production Release
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#1a2356] text-[#00F0FF] border border-[#2b3a82]">
                PostgreSQL 16 + Express API + Mailer + Nginx
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Полная выгрузка проекта для установки на сервер
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              Готовый самодостаточный архив со всеми файлами для развёртывания на любом VPS/VDS сервере.
              Включает запуск в <strong className="text-white">Docker Compose</strong> (одной командой),
              чистый DDL-скрипт <strong className="text-white">schema.sql</strong> для PostgreSQL,
              серверный почтовый транспорт для <strong className="text-[#FFD600]">chita11kadrov@mail.ru</strong>,
              конфигурации <strong className="text-white">Nginx</strong> и подробную пошаговую инструкцию.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="px-3 py-2 rounded-xl bg-[#0a0d24]/70 border border-[#212c63] flex items-center gap-2 text-gray-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Docker Compose</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0a0d24]/70 border border-[#212c63] flex items-center gap-2 text-gray-200">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                <span>PostgreSQL DDL</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0a0d24]/70 border border-[#212c63] flex items-center gap-2 text-gray-200">
                <span className="w-2 h-2 rounded-full bg-[#FFD600]" />
                <span>Mail.ru SMTP</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0a0d24]/70 border border-[#212c63] flex items-center gap-2 text-gray-200">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Админка (admin)</span>
              </div>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleDownloadServerBundle}
              disabled={downloadingBundle}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#00F0FF] to-[#00c8d6] hover:from-[#33f3ff] hover:to-[#00F0FF] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#00F0FF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-5 h-5 ${downloadingBundle ? 'animate-bounce' : ''}`} />
              <span>{downloadingBundle ? 'Формирование архива...' : 'Скачать серверный пакет (.ZIP)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href="/api/export/schema.sql"
                download="schema.sql"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#17204f] hover:bg-[#202b6b] border border-[#2e3e8f] text-xs font-bold text-white transition-all flex items-center justify-center gap-2 text-center"
                title="Скачать файл структуры базы данных schema.sql"
              >
                <Database className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>schema.sql</span>
              </a>

              <a
                href="/api/export/readme"
                download="README_DEPLOY.md"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#17204f] hover:bg-[#202b6b] border border-[#2e3e8f] text-xs font-bold text-white transition-all flex items-center justify-center gap-2 text-center"
                title="Скачать подробную инструкцию по развёртыванию"
              >
                <FileText className="w-3.5 h-3.5 text-[#FFD600]" />
                <span>README_DEPLOY.md</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 1. DB Stats + 2. Mailer Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: DB Connection Details */}
        <div className="bg-[#0e122e] border border-[#26336e] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f295c] pb-3">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-[#00F0FF]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Удалённая база данных (Cloud SQL)
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Активна
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#141a42] border border-[#283570] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Заявки в БД</div>
              <div className="text-2xl font-black text-[#FFD600] font-mono">
                {stats?.counts.applications ?? '—'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141a42] border border-[#283570] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Логи почты</div>
              <div className="text-2xl font-black text-[#00F0FF] font-mono">
                {stats?.counts.emailLogs ?? '—'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141a42] border border-[#283570] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Аудит входов</div>
              <div className="text-2xl font-black text-white font-mono">
                {stats?.counts.auditLogs ?? '—'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141a42] border border-[#283570] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Админы</div>
              <div className="text-2xl font-black text-purple-300 font-mono">
                {stats?.counts.users ? stats.counts.users + 1 : 1}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#13183b] border border-[#202b61] space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#1c2452]">
              <span className="text-gray-400">Тип базы данных:</span>
              <span className="text-white font-semibold">PostgreSQL Relational DB (Cloud SQL)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1c2452]">
              <span className="text-gray-400">Пул соединений:</span>
              <span className="text-emerald-400 font-mono font-bold">Активен (pg.Pool / auto-scale)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1c2452]">
              <span className="text-gray-400">Таблицы фестиваля:</span>
              <span className="text-gray-200 font-mono">applications, admin_credentials, email_logs</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-400">Шифрование паролей:</span>
              <span className="text-[#00F0FF] font-mono">SHA-256 + сессионные токены</span>
            </div>
          </div>
        </div>

        {/* Right: Mailer Service */}
        <div className="bg-[#0e122e] border border-[#26336e] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f295c] pb-3">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#FF007A]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Почтовый сервис (Mailer)
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]/30">
              Целевой адрес: {mailerStatus?.targetEmail || 'chita11kadrov@mail.ru'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#151c47] to-[#0f1436] border border-[#2c3975] space-y-3">
            <div className="text-xs text-gray-200 leading-relaxed">
              Все заявки, отправленные участниками через онлайн-форму, незамедлительно поступают на официальную почту:
            </div>
            <div className="flex items-center justify-between bg-[#0b0e24] px-3.5 py-2.5 rounded-xl border border-[#222b5e]">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#00F0FF]">
                <Mail className="w-4 h-4 text-[#00F0FF]" />
                <span>{mailerStatus?.targetEmail || 'chita11kadrov@mail.ru'}</span>
              </div>
              <button
                onClick={async () => {
                  await copyToClipboard(mailerStatus?.targetEmail || 'chita11kadrov@mail.ru');
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-[#151c4a] flex items-center gap-1"
                title="Скопировать email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400">Статус SMTP:</span>
              <span className="text-xs font-mono text-gray-300">
                {mailerStatus?.isConfigured ? 'Настроен (SMTP-транспорт)' : 'Активен (эмуляция & логирование в БД)'}
              </span>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <button
            onClick={handleSendTestMail}
            disabled={testSending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#FF7A00] text-white font-extrabold text-xs shadow-lg shadow-[#FF007A]/25 hover:shadow-[#FF007A]/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${testSending ? 'animate-bounce' : ''}`} />
            <span>
              {testSending
                ? 'Отправка сообщения...'
                : `Отправить тестовое письмо на ${mailerStatus?.targetEmail || 'chita11kadrov@mail.ru'}`}
            </span>
          </button>
        </div>
      </div>

      {/* SQL Studio / Remote Database Console */}
      <div className="bg-[#0e122e] border border-[#26336e] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f295c] pb-3">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-[#FFD600]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Удалённая интерактивная консоль базы данных (SQL Studio)
            </h3>
          </div>
          <span className="text-xs text-gray-400">Прямое удалённое выполнение запросов к Cloud SQL</span>
        </div>

        {/* Quick query buttons */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Быстрые запросы к базе данных:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const q =
                  'SELECT id, author_name, work_title, phone, email, status, email_sent, created_at FROM applications ORDER BY id DESC LIMIT 20;';
                setSqlQuery(q);
                handleExecuteSql(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161e49] hover:bg-[#202b66] border border-[#2a3779] text-xs text-gray-300 hover:text-white transition-all font-mono"
            >
              📋 Все заявки (applications)
            </button>

            <button
              onClick={() => {
                const q = 'SELECT id, recipient, subject, status, created_at FROM email_logs ORDER BY id DESC LIMIT 15;';
                setSqlQuery(q);
                handleExecuteSql(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161e49] hover:bg-[#202b66] border border-[#2a3779] text-xs text-gray-300 hover:text-white transition-all font-mono"
            >
              ✉️ Логи почты (email_logs)
            </button>

            <button
              onClick={() => {
                const q =
                  'SELECT id, username, action, ip_address, success, created_at FROM admin_audit_logs ORDER BY id DESC LIMIT 15;';
                setSqlQuery(q);
                handleExecuteSql(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161e49] hover:bg-[#202b66] border border-[#2a3779] text-xs text-gray-300 hover:text-white transition-all font-mono"
            >
              🛡️ Логи входа админа
            </button>

            <button
              onClick={() => {
                const q = 'SELECT id, username, role, is_active, last_login_at FROM admin_credentials;';
                setSqlQuery(q);
                handleExecuteSql(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161e49] hover:bg-[#202b66] border border-[#2a3779] text-xs text-gray-300 hover:text-white transition-all font-mono"
            >
              🔑 Учетная запись админа
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={3}
            className="w-full p-3.5 bg-[#080b1e] border border-[#232f6b] focus:border-[#00F0FF] rounded-2xl text-xs font-mono text-[#00F0FF] focus:outline-none transition-all resize-y"
            placeholder="Введите SQL запрос (например: SELECT * FROM applications LIMIT 10;)"
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-[11px] text-gray-400">
              * Поддерживаются команды выборки данных SELECT и системные запросы к базе.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await copyToClipboard(sqlQuery);
                  setCopiedQuery(true);
                  setTimeout(() => setCopiedQuery(false), 2000);
                }}
                className="px-3 py-2 rounded-xl bg-[#141b44] hover:bg-[#1f2963] text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQuery ? 'Скопировано' : 'Скопировать'}</span>
              </button>

              <button
                onClick={() => handleExecuteSql()}
                disabled={executingQuery}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-xs shadow-lg shadow-[#00F0FF]/25 hover:shadow-[#00F0FF]/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-black ${executingQuery ? 'animate-spin' : ''}`} />
                <span>{executingQuery ? 'Выполнение...' : 'Выполнить запрос'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error output */}
        {queryError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold mb-0.5">Ошибка выполнения запроса:</div>
              <div>{queryError}</div>
            </div>
          </div>
        )}

        {/* Results output */}
        {queryResult && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <span>
                  Строк: <strong className="text-white font-mono">{queryResult.rows?.length ?? 0}</strong>
                </span>
                <span>•</span>
                <span>
                  Время выполнения: <strong className="text-[#00F0FF] font-mono">{queryResult.durationMs} мс</strong>
                </span>
              </div>

              {queryResult.rows && queryResult.rows.length > 0 && (
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 rounded-xl bg-[#172152] hover:bg-[#223075] border border-[#2a3c8a] text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Экспорт в CSV</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#232f6b] max-h-96">
              {queryResult.rows && queryResult.rows.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-[#141b44] text-gray-300 border-b border-[#232f6b]">
                      {Object.keys(queryResult.rows[0]).map((col) => (
                        <th key={col} className="p-3 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18214f] bg-[#090d24]">
                    {queryResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#121942] transition-colors">
                        {Object.keys(queryResult.rows![0]).map((col) => {
                          const val = row[col];
                          const displayVal =
                            val === null || val === undefined
                              ? 'NULL'
                              : typeof val === 'object'
                              ? JSON.stringify(val)
                              : String(val);
                          const isNull = val === null || val === undefined;
                          return (
                            <td
                              key={col}
                              className={`p-3 whitespace-nowrap max-w-xs truncate ${
                                isNull ? 'text-gray-500 italic' : 'text-gray-200'
                              }`}
                              title={displayVal}
                            >
                              {displayVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-xs text-gray-400 font-mono bg-[#090d24]">
                  Запрос выполнен успешно, но строк не возвращено (0 rows).
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Email Logs in DB */}
      <div className="bg-[#0e122e] border border-[#26336e] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f295c] pb-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Журнал отправки писем Mailer (email_logs)
            </h3>
          </div>
          <span className="text-xs text-gray-400">Последние 50 записей</span>
        </div>

        {emailLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 bg-[#12163b] rounded-2xl border border-[#20295e]">
            Записей в журнале почты пока нет. Отправьте тестовое письмо или подайте заявку для проверки.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#232f6b]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#141b44] text-gray-300 border-b border-[#232f6b]">
                  <th className="p-3 font-bold">ID</th>
                  <th className="p-3 font-bold">Получатель</th>
                  <th className="p-3 font-bold">Тема сообщения</th>
                  <th className="p-3 font-bold">Статус доставки</th>
                  <th className="p-3 font-bold">Дата и время</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18214f] bg-[#090d24]">
                {emailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#121942] transition-colors">
                    <td className="p-3 font-mono text-gray-400">#{log.id}</td>
                    <td className="p-3 font-semibold text-white">{log.recipient}</td>
                    <td className="p-3 text-gray-200 max-w-sm truncate" title={log.subject}>
                      {log.subject}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'sent'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : log.status === 'simulated'
                            ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {log.status === 'sent' && '✓ Доставлено'}
                        {log.status === 'simulated' && 'ℹ В очереди / Эмуляция'}
                        {log.status === 'failed' && '✕ Ошибка'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-[11px] whitespace-nowrap">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString('ru-RU') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Direct remote connection instructions for external tools */}
      <div className="p-6 rounded-3xl bg-[#0b0e24] border border-[#1f2858] text-xs text-gray-400 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm">
          <HardDrive className="w-4 h-4 text-[#00F0FF]" />
          <span>Удалённое подключение внешними SQL-клиентами (DBeaver, DataGrip, pgAdmin)</span>
        </div>
        <p className="leading-relaxed">
          База данных Cloud SQL для фестиваля «11 кадров» настроена на защищённый доступ. Консоль выше позволяет
          управлять данными напрямую из браузера без установки дополнительного софта. При необходимости прямого
          подключения используйте учетные данные из переменных окружения Cloud SQL (
          <code className="text-[#00F0FF]">SQL_HOST</code>, <code className="text-[#00F0FF]">SQL_USER</code>,{' '}
          <code className="text-[#00F0FF]">SQL_DB_NAME</code>).
        </p>
      </div>
    </div>
  );
};
