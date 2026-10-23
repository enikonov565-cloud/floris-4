/* =====================================================
   CLOUDFLARE WORKER — приёмник брифа → Telegram
   На сайте этот файл не нужен: он вставляется в Cloudflare
   (см. README.md, раздел «Подключение Telegram-бота»).

   Переменные окружения (Settings → Variables and Secrets):
     BOT_TOKEN        — токен бота от @BotFather (секрет)
     CHAT_ID          — куда слать: ваш id или id группы
     ALLOWED_ORIGINS  — необязательно: адреса сайта через запятую,
                        например https://username.github.io
                        (пусто — принимать с любого сайта)

   Маршруты:
     POST /       — JSON с ответами → сводка + сообщение на каждый этап
     POST /file   — один файл (multipart: file, caption) → документ
   ===================================================== */

const TG_LIMIT = 4096;         // лимит Telegram на сообщение
const SAFE_LIMIT = 3900;       // берём с запасом
const MAX_BODY = 300 * 1024;   // ответы брифа — это текст, больше не нужно
const MAX_FILE = 20 * 1024 * 1024;
const SUMMARY_CUT = 350;       // длина ответа в сводке

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ ok: false, error: 'Только POST' }, 405, cors);
    if (!originAllowed(origin, env)) return json({ ok: false, error: 'Сайт не разрешён' }, 403, cors);
    if (!env.BOT_TOKEN || !env.CHAT_ID) return json({ ok: false, error: 'Не заданы BOT_TOKEN / CHAT_ID' }, 500, cors);

    try {
      const path = new URL(request.url).pathname.replace(/\/+$/, '');
      if (path.endsWith('/file')) return await handleFile(request, env, cors);
      return await handleBrief(request, env, cors);
    } catch (e) {
      return json({ ok: false, error: String((e && e.message) || e) }, 500, cors);
    }
  }
};

/* ---------- приём ответов ---------- */
async function handleBrief(request, env, cors) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: 'Слишком большой бриф' }, 413, cors);
  const data = JSON.parse(raw);

  // ловушка для ботов заполнена — делаем вид, что всё хорошо
  if (data.website) return json({ ok: true }, 200, cors);

  const messages = [buildSummary(data)];
  for (const st of data.stages || []) {
    const items = (st.items || []).filter(it => clean(it.answer));
    if (!items.length) continue; // пустые этапы не засоряют ленту
    messages.push(...buildStage(st, items));
  }

  for (let i = 0; i < messages.length; i++) {
    await sendText(env, messages[i]);
    if (i < messages.length - 1) await sleep(350); // не упираемся в антиспам Telegram
  }
  return json({ ok: true, messages: messages.length }, 200, cors);
}

/* ---------- приём файла ---------- */
async function handleFile(request, env, cors) {
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ ok: false, error: 'Нет файла' }, 400, cors);
  if (file.size > MAX_FILE) return json({ ok: false, error: 'Файл больше 20 МБ' }, 413, cors);

  const fd = new FormData();
  fd.append('chat_id', env.CHAT_ID);
  fd.append('document', file, file.name || 'file');
  fd.append('caption', clean(form.get('caption')).slice(0, 1000));
  await tg(env, 'sendDocument', fd);
  return json({ ok: true }, 200, cors);
}

/* =====================================================
   СБОРКА СООБЩЕНИЙ
   ===================================================== */
function buildSummary(d) {
  const lines = ['🆕 <b>Новый бриф на сайт</b>', ''];
  if (clean(d.name)) lines.push('<b>Имя:</b> ' + esc(clean(d.name)));
  if (clean(d.company)) lines.push('<b>Компания:</b> ' + esc(clean(d.company)));
  if (clean(d.contact)) lines.push('<b>Контакт:</b> ' + esc(clean(d.contact)));

  const sum = (d.summary || []).filter(s => clean(s.answer));
  if (sum.length) {
    lines.push('', '<b>Главное по делу</b>');
    for (const s of sum) {
      lines.push('', '▪️ <b>' + esc(clean(s.label)) + '</b>', esc(cut(clean(s.answer), SUMMARY_CUT)));
    }
  }

  const meta = [];
  if (d.filledStages != null) meta.push('этапов заполнено: ' + d.filledStages + ' из ' + (d.totalStages || 7));
  if (d.files && d.files.length) meta.push('файлов: ' + d.files.length + ' (придут следом)');
  if (meta.length) lines.push('', '<i>' + esc(meta.join(' · ')) + '</i>');

  return lines.join('\n').slice(0, TG_LIMIT);
}

/* Этап → одно или несколько сообщений.
   Каждый «блок» — законченный кусок HTML, поэтому резка между
   блоками никогда не ломает теги. Вопрос всегда идёт вместе
   с началом своего ответа. */
function buildStage(st, items) {
  const head = '<b>' + esc(clean(st.num) + ' · ' + clean(st.title).toUpperCase()) + '</b>';
  const contHead = '<i>' + esc(clean(st.num) + ' · ' + clean(st.title)) + ' — продолжение</i>';
  const blocks = [];

  for (const it of items) {
    const q = '<b>' + esc(clean(it.label)) + '</b>';
    const room = SAFE_LIMIT - q.length - 1 - contHead.length - 2;
    const pieces = [];
    for (const para of clean(it.answer).split(/\n\s*\n/)) {
      if (para.trim()) pieces.push(...splitLong(para.trim(), room));
    }
    pieces.forEach((p, i) => blocks.push(i === 0 ? q + '\n' + esc(p) : esc(p)));
  }

  const out = [];
  let cur = head;
  for (const b of blocks) {
    if (cur.length + 2 + b.length > SAFE_LIMIT) {
      out.push(cur);
      cur = contHead + '\n\n' + b;
    } else {
      cur += '\n\n' + b;
    }
  }
  out.push(cur);
  return out;
}

/* Длинный абзац режем по предложениям, затем по словам.
   Длину считаем уже после экранирования (& → &amp; и т.п.). */
function splitLong(text, max) {
  if (esc(text).length <= max) return [text];
  const units = text.split(/(?<=[.!?…])\s+/);
  const res = [];
  let cur = '';
  const push = () => { if (cur) { res.push(cur); cur = ''; } };

  for (const u of units) {
    if (esc(u).length > max) {
      push();
      for (const w of u.split(/\s+/)) {
        if (esc(w).length > max) {           // одно гигантское «слово» — режем жёстко
          push();
          for (let i = 0; i < w.length; i += Math.floor(max / 6)) res.push(w.slice(i, i + Math.floor(max / 6)));
          continue;
        }
        const next = cur ? cur + ' ' + w : w;
        if (esc(next).length > max) { push(); cur = w; } else cur = next;
      }
      push();
      continue;
    }
    const next = cur ? cur + ' ' + u : u;
    if (esc(next).length > max) { push(); cur = u; } else cur = next;
  }
  push();
  return res;
}

/* =====================================================
   TELEGRAM
   ===================================================== */
async function sendText(env, html) {
  try {
    await tg(env, 'sendMessage', {
      chat_id: env.CHAT_ID, text: html, parse_mode: 'HTML', disable_web_page_preview: true
    });
  } catch (e) {
    // если Telegram не принял разметку — отправляем тем же текстом без неё
    if (/parse|entit/i.test(String(e.message))) {
      await tg(env, 'sendMessage', { chat_id: env.CHAT_ID, text: unhtml(html).slice(0, TG_LIMIT), disable_web_page_preview: true });
    } else {
      throw e;
    }
  }
}

async function tg(env, method, body) {
  const isForm = body instanceof FormData;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/' + method, {
      method: 'POST',
      headers: isForm ? undefined : { 'Content-Type': 'application/json' },
      body: isForm ? body : JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok) return data;
    if (data.error_code === 429) {           // слишком часто — ждём, сколько просит Telegram
      const wait = ((data.parameters && data.parameters.retry_after) || 1) * 1000;
      await sleep(Math.min(wait, 10000));
      continue;
    }
    throw new Error('Telegram: ' + (data.description || res.status));
  }
  throw new Error('Telegram: превышено число попыток');
}

/* =====================================================
   ПОМОЩНИКИ
   ===================================================== */
function corsHeaders(origin, env) {
  const list = allowedList(env);
  return {
    'Access-Control-Allow-Origin': list.length ? (list.includes(origin) ? origin : list[0]) : '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function allowedList(env) {
  return String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean);
}
function originAllowed(origin, env) {
  const list = allowedList(env);
  return !list.length || list.includes(origin);
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, headers)
  });
}
function clean(s) { return s == null ? '' : String(s).replace(/\r\n?/g, '\n').trim(); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function unhtml(s) { return s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); }
function cut(s, n) {
  if (s.length <= n) return s;
  const part = s.slice(0, n);
  const sp = part.lastIndexOf(' ');
  return (sp > n * 0.6 ? part.slice(0, sp) : part) + '…';
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
