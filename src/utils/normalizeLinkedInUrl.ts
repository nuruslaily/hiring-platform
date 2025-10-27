export function normalizeLinkedInUrl(raw: string) {
  try {
    const u = new URL(raw.trim());
    // Hanya izinkan domain LinkedIn
    if (!/^([a-z0-9-]+\.)*linkedin\.com$/i.test(u.hostname)) throw new Error();
    // Hanya jalur profil personal: /in/<vanity> (boleh ada slash di akhir)
    const m = u.pathname.match(/^\/in\/([A-Za-z0-9-_%]+)\/?$/);
    if (!m) throw new Error();
    // Hilangkan query/hash
    u.search = "";
    u.hash = "";
    // Kembalikan format kanonik
    return `https://www.linkedin.com/in/${decodeURIComponent(m[1])}`;
  } catch {
    return null;
  }
}
