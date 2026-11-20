/**
 * 24/7 Keep-Alive Background Service for Render & Cloud Hosts
 *
 * Render free web services spin down after 15 minutes of inactivity.
 * This background worker periodically pings the public healthcheck endpoint
 * every 10 minutes, resetting the idle countdown timer so the server runs 24/7.
 */

export function initKeepAlive() {
  const targetUrl = (
    process.env.RENDER_EXTERNAL_URL ||
    process.env.SERVER_URL ||
    process.env.KEEP_ALIVE_URL ||
    ''
  ).replace(/\/+$/, '');

  if (!targetUrl) {
    console.log(
      'ℹ️ [Keep-Alive] RENDER_EXTERNAL_URL is not set (local development mode). Keep-alive will activate automatically once deployed to Render.'
    );
    return;
  }

  const healthUrl = `${targetUrl}/api/health`;
  const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes (safely below Render's 15-minute sleep threshold)

  console.log(`🚀 [Keep-Alive] Initialized 24/7 keep-alive monitor targeting: ${healthUrl}`);

  const pingServer = async () => {
    try {
      const response = await fetch(healthUrl, {
        headers: { 'User-Agent': 'Kabun-Roastery-KeepAlive/1.0' },
      });
      if (response.ok) {
        console.log(`🟢 [Keep-Alive] Health ping successful (${response.status} OK) - Server active 24/7`);
      } else {
        console.warn(`🟡 [Keep-Alive] Health ping returned status ${response.status}`);
      }
    } catch (err: any) {
      console.warn(`⚠️ [Keep-Alive] Ping attempt notice: ${err?.message || err}`);
    }
  };

  // Initial ping 45 seconds after startup to verify connectivity
  setTimeout(pingServer, 45 * 1000);

  // Periodic ping every 10 minutes
  const intervalId = setInterval(pingServer, PING_INTERVAL_MS);

  return () => clearInterval(intervalId);
}
