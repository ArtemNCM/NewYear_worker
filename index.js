export default {
  async fetch(request) {
    const COUNTDOWN_URL = "https://justalink.click/";
    const MAIN_URL = "https://happynewyear.best/";
    const SWITCH_AT = "20251224010000"; // YYYYMMDDHHMMSS (Kyiv)

    const now = kyivStamp(new Date());

    // якщо дата не зібралась — ведемо на відлік
    const target = (now && /^\d{14}$/.test(now) && now >= SWITCH_AT)
      ? MAIN_URL
      : COUNTDOWN_URL;

    // Редірект БЕЗ Response.redirect + БЕЗ headers.set (щоб не було immutable headers)
    return new Response(null, {
      status: 302,
      headers: {
        "Location": target,
        "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        "Pragma": "no-cache",
        // тимчасово для перевірки, що прод оновився:
        "X-Worker-Version": "v4",
      },
    });
  }
};

function kyivStamp(date) {
  const tzCandidates = ["Europe/Kyiv", "Europe/Kiev"]; // fallback
  for (const timeZone of tzCandidates) {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
      }).formatToParts(date);

      const m = Object.fromEntries(parts.map(p => [p.type, p.value]));
      return `${m.year}${m.month}${m.day}${m.hour}${m.minute}${m.second}`;
    } catch (_) {}
  }
  return null;
}
