import JSZip from 'jszip';

/**
 * Downloads the full-stack server deployment bundle.
 * First tries the server-side export endpoint /api/export/full-bundle (which packs everything on the server),
 * and falls back to client-side JSZip assembly if the API is offline.
 */
export async function generateProjectZip(customFestivalData?: any): Promise<Blob> {
  // 1. Primary: Server-side bundle generator
  try {
    const resp = await fetch('/api/export/full-bundle');
    if (resp.ok) {
      const blob = await resp.blob();
      if (blob && blob.size > 5000) {
        return blob;
      }
    }
  } catch (err) {
    console.warn('Server export unavailable, falling back to client-side packaging:', err);
  }

  // 2. Fallback: Client-side ZIP generation
  const zip = new JSZip();

  // Root configuration files
  const rootFiles = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'index.html',
    'server.ts',
    'schema.sql',
    'docker-compose.yml',
    'Dockerfile',
    '.env.production.example',
    'ecosystem.config.cjs',
    'nginx.conf',
    'deploy.sh',
    'README_DEPLOY.md',
  ];

  for (const file of rootFiles) {
    try {
      const resp = await fetch(`/${file}`);
      if (resp.ok) {
        const content = await resp.text();
        zip.file(file, content);
      }
    } catch {
      // ignore
    }
  }

  // Source tree files
  const src = zip.folder('src')!;
  const srcFiles = [
    'main.tsx',
    'App.tsx',
    'index.css',
    'types.ts',
    'festivalData.ts',
    'context/FestivalContext.tsx',
    'utils/clipboard.ts',
    'utils/sourceDownloader.ts',
    'components/Navbar.tsx',
    'components/HeroSection.tsx',
    'components/InteractiveSchedule.tsx',
    'components/NominationsGrid.tsx',
    'components/JurySection.tsx',
    'components/FlipbookMiniStudio.tsx',
    'components/GallerySection.tsx',
    'components/ShkiAboutSection.tsx',
    'components/FaqSection.tsx',
    'components/Footer.tsx',
    'components/FestivalLogo.tsx',
    'components/MilashAnimash.tsx',
    'components/ApplicationModal.tsx',
    'components/TicketPassModal.tsx',
    'components/FavoritesDrawer.tsx',
    'components/RegulationModal.tsx',
    'components/AdminLoginModal.tsx',
    'components/AdminDashboardModal.tsx',
    'components/AdminFloatingBar.tsx',
    'components/AdminDatabaseManager.tsx',
    'db/index.ts',
    'db/schema.ts',
    'db/admin.ts',
    'db/applications.ts',
    'db/users.ts',
    'db/drizzle.config.ts',
    'lib/mailer.ts',
    'lib/firebase.ts',
    'lib/firebase-admin.ts',
    'middleware/auth.ts',
  ];

  for (const relativePath of srcFiles) {
    try {
      const resp = await fetch(`/src/${relativePath}`);
      if (resp.ok) {
        const text = await resp.text();
        src.file(relativePath, text);
      }
    } catch {
      // ignore
    }
  }

  // If custom data was modified in the admin panel, override festivalData.ts with current state
  if (customFestivalData) {
    try {
      src.file('customFestivalExport.json', JSON.stringify(customFestivalData, null, 2));
    } catch {
      // ignore
    }
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Triggers browser download of a file from a URL or Blob
 */
export function triggerBrowserDownload(blobOrUrl: Blob | string, filename: string) {
  const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof blobOrUrl !== 'string') {
    URL.revokeObjectURL(url);
  }
}

/**
 * Download raw PostgreSQL schema.sql
 */
export async function downloadSqlSchema() {
  triggerBrowserDownload('/api/export/schema.sql', 'schema.sql');
}

/**
 * Download deployment guide README_DEPLOY.md
 */
export async function downloadDeployGuide() {
  triggerBrowserDownload('/api/export/readme', 'README_DEPLOY.md');
}
