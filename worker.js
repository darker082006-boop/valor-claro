// Valor Claro · Worker de Cloudflare: sirve la web (assets) y expone dos endpoints.
//   POST /api/subscribe  guarda el email en MailerLite (clave en secreto, nunca en la web)
//   POST /api/license    comprueba una clave de licencia de Lemon Squeezy
// Variables: MAILERLITE_TOKEN (secreto), MAILERLITE_GROUP (opcional), LS_STORE_ID (opcional, recomendado)
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

async function subscribe(request, env) {
  let email = '', consent = '';
  try { const d = await request.formData(); email = String(d.get('email') || '').trim(); consent = String(d.get('consent') || ''); } catch (e) { return json({ error: 'bad request' }, 400); }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || consent !== 'yes') return json({ error: 'invalid' }, 400);
  if (!env.MAILERLITE_TOKEN) return json({ error: 'not configured' }, 500);
  const body = { email, ip_address: request.headers.get('CF-Connecting-IP') || undefined };
  if (env.MAILERLITE_GROUP) body.groups = [env.MAILERLITE_GROUP];
  const r = await fetch('https://connect.mailerlite.com/api/subscribers', { method: 'POST', headers: { 'Authorization': 'Bearer ' + env.MAILERLITE_TOKEN, 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) });
  return r.ok ? json({ ok: true }) : json({ error: 'upstream', status: r.status }, 502);
}

async function license(request, env) {
  let key = '';
  try { key = String((await request.formData()).get('key') || '').trim(); } catch (e) { return json({ error: 'bad request' }, 400); }
  if (!key || key.length > 100) return json({ valid: false });
  const r = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ license_key: key }) });
  if (r.status >= 500) return json({ error: 'upstream' }, 502);
  const j = await r.json().catch(() => ({}));
  const storeOk = !env.LS_STORE_ID || String(j && j.meta && j.meta.store_id) === String(env.LS_STORE_ID);
  const st = j && j.license_key && j.license_key.status;
  return json({ valid: !!(j && j.valid) && storeOk && st !== 'disabled' && st !== 'expired' });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (request.method === 'POST' && pathname === '/api/subscribe') return subscribe(request, env);
    if (request.method === 'POST' && pathname === '/api/license') return license(request, env);
    return env.ASSETS.fetch(request);
  }
};
