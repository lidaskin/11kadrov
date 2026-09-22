/**
 * Universal file downloader that works reliably inside iframes and sandboxed environments.
 */
export async function downloadFile(url: string, filename: string): Promise<boolean> {
  try {
    // 1. Try Blob download first
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = objectUrl;
    a.download = filename;
    a.setAttribute('target', '_blank'); // fallback for sandboxed iframes
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    }, 2000);
    return true;
  } catch (err) {
    console.warn('Blob download failed, trying direct link navigation:', err);
    // 2. Direct fallback
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    } catch (e2) {
      console.error('All download methods failed:', e2);
      return false;
    }
  }
}
