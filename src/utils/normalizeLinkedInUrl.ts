export function normalizeLinkedInUrl(raw: string) {
  try {
    const u = new URL(raw.trim());
    if (!/^([a-z0-9-]+\.)*linkedin\.com$/i.test(u.hostname)) throw new Error();
    const m = u.pathname.match(/^\/in\/([A-Za-z0-9-_%]+)\/?$/);
    if (!m) throw new Error();
    u.search = "";
    u.hash = "";
    return `https://www.linkedin.com/in/${decodeURIComponent(m[1])}`;
  } catch {
    return null;
  }
}
