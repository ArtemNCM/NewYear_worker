export default {
    async fetch(request) {
      const COUNTDOWN_URL = "https://justalink.click/";
      const MAIN_URL = "https://happynewyear.best/";
      const SWITCH_AT = "20251224004000"; // YYYYMMDDHHMMSS (Europe/Kyiv)
  
      try {
        const now = kyivStamp(new Date());
        
        // Validate format: must be exactly 14 digits (YYYYMMDDHHMMSS)
        if (!now || now.length !== 14 || !/^\d{14}$/.test(now)) {
          // If date formatting fails, default to countdown URL
          return Response.redirect(COUNTDOWN_URL, 302);
        }
        
        const target = (now < SWITCH_AT) ? COUNTDOWN_URL : MAIN_URL;
        const resp = Response.redirect(target, 302);
        resp.headers.set("Cache-Control", "no-store");
        return resp;
      } catch (error) {
        // On any error, default to countdown URL
        return Response.redirect(COUNTDOWN_URL, 302);
      }
    }
  };
  
  function kyivStamp(date) {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Kyiv",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false
      }).formatToParts(date);
  
      const m = Object.fromEntries(parts.map(p => [p.type, p.value]));
      
      // Validate all required parts are present
      const required = ['year', 'month', 'day', 'hour', 'minute', 'second'];
      for (const key of required) {
        if (!m[key]) {
          throw new Error(`Missing date part: ${key}`);
        }
      }
      
      return `${m.year}${m.month}${m.day}${m.hour}${m.minute}${m.second}`;
    } catch (error) {
      // Return null if formatting fails (will be caught by validation)
      return null;
    }
  }
  