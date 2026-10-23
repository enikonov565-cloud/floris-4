'use strict';

/* =====================================================
   1. ДАННЫЕ О ВАС — меняются здесь
   ===================================================== */
const SITE = {
  brand: 'Бриф',                                // текст в шапке слева
  owner: 'Ваше имя',                            // подпись на финальном экране
  photo: 'img/photo.jpg',                       // ваша фотография для финального экрана
  telegram: 'https://t.me/username',            // ссылка на ваш Telegram
  replyDays: '2 рабочих дней',                  // «Напишу вам в течение …»
  // юридические документы — ссылки с вашего основного сайта
  legal: [
    { title: 'Политика конфиденциальности', href: '#' },
    { title: 'Согласие на обработку персональных данных', href: '#' },
    { title: 'Публичная оферта', href: '#' }
  ],
  requisites: 'ИП Фамилия Имя Отчество · ИНН 000000000000 · ОГРНИП 000000000000000'
};

/* =====================================================
   2. ЭТАПЫ
   ===================================================== */
const STAGES = [
  { id: 'business', title: 'Бизнес-задача',            lead: 'Начнём с главного: зачем сайт и какое действие он должен приносить.' },
  { id: 'product',  title: 'Продукт и фокус',          lead: 'Что продаём и на чём хотим сделать акцент.' },
  { id: 'client',   title: 'Клиент · первая гипотеза', lead: 'Исследование не нужно — опишите, каким вы видите клиента сейчас. Это гипотеза, её проверим.' },
  { id: 'sales',    title: 'Путь продажи',             lead: 'Как человек становится клиентом — и где теряется по дороге.' },
  { id: 'value',    title: 'Ценность и доказательства', lead: 'Что делает вас вами — и чем это подтвердить без преувеличений.' },
  { id: 'files',    title: 'Материалы и доступы',      lead: 'Всё, что уже есть, экономит недели работы. Прикладывайте как есть — разберусь сама.' },
  { id: 'contacts', title: 'Контакты',                 lead: 'Последний шаг — как с вами связаться.' }
];

/* =====================================================
   3. ВОПРОСЫ
   id       — уникальное имя (латиница), по нему хранится ответ
   stage    — к какому этапу относится
   label    — сам вопрос
   hint     — подсказка под вопросом (можно '')
   required — обязательный ли вопрос
   key      — ключевой вопрос: плашка «важно» и выделение
   summary  — попадёт в первое сообщение-сводку в Telegram
   type     — textarea (по умолчанию) | text | links | files | consent
   ===================================================== */
const QUESTIONS = [
  // 01 · Бизнес-задача
  { id: 'biz_why', stage: 'business', required: true,
    label: 'Зачем бизнесу сайт именно сейчас?',
    hint: 'Что изменилось: запускаете новое направление, старый сайт не продаёт, растёт реклама? Пары предложений достаточно.' },
  { id: 'biz_action', stage: 'business', required: true, summary: true,
    label: 'Какое действие сайт должен приводить чаще всего?',
    hint: 'Запись, звонок, расчёт стоимости, покупка, сообщение в мессенджер — выберите одно главное.' },
  { id: 'biz_focus', stage: 'business',
    label: 'Какое направление, география или сегмент в приоритете?',
    hint: 'Например: «Москва и область, корпоративные клиенты» или «только премиум-линейка».' },

  // 02 · Продукт и фокус
  { id: 'prod_what', stage: 'product', required: true,
    label: 'Что именно продаёт бизнес?',
    hint: 'Своими словами — как объяснили бы другу.' },
  { id: 'prod_formats', stage: 'product',
    label: 'Какие продукты или форматы можно купить?',
    hint: 'Тарифы, пакеты, разовые услуги, абонементы — всё, что есть в прайсе.' },
  { id: 'prod_top', stage: 'product',
    label: 'Что покупают чаще всего?', hint: '' },
  { id: 'prod_grow', stage: 'product', summary: true,
    label: 'Что бизнес хочет продавать больше?',
    hint: 'Часто это не то, что покупают сейчас, — и это нормально. Сайт может сместить спрос.' },
  { id: 'prod_limits', stage: 'product',
    label: 'Что входит в продукт? Какие есть ограничения?',
    hint: 'Сроки, минимальный заказ, география, что точно не входит в стоимость.' },

  // 03 · Клиент
  { id: 'cl_who', stage: 'client', required: true,
    label: 'Кто обычно покупает?',
    hint: 'Возраст, роль, сфера, доход — то, что знаете или замечаете.' },
  { id: 'cl_trigger', stage: 'client',
    label: 'В какой ситуации он начинает искать решение?',
    hint: 'Что должно случиться, чтобы человек открыл поиск: переезд, сезон, проблема, дедлайн?' },
  { id: 'cl_criteria', stage: 'client',
    label: 'Что для него, предположительно, важно при выборе?',
    hint: 'Цена, скорость, гарантия, статус, отзывы, близость к дому…' },

  // 04 · Путь продажи
  { id: 'sale_first', stage: 'sales',
    label: 'Кто первым общается с человеком?',
    hint: 'Вы лично, менеджер, администратор, чат-бот?' },
  { id: 'sale_path', stage: 'sales',
    label: 'Как выглядит путь от первого обращения до покупки?',
    hint: 'Шаги по порядку: заявка → звонок → замер → договор → оплата…' },
  { id: 'sale_after', stage: 'sales',
    label: 'Что происходит сразу после заявки?',
    hint: 'Через сколько минут перезваниваете, что пишете, что отправляете.' },
  { id: 'sale_break', stage: 'sales', required: true, key: true, summary: true,
    label: 'Где сделки чаще всего рвутся?',
    hint: 'Самый важный вопрос брифа. На каком шаге люди пропадают и что говорят, уходя: «дорого», «подумаю», «нашли ближе»? От ответа зависит, какой блок окажется в первой трети сайта.' },

  // 05 · Ценность и доказательства
  { id: 'val_love', stage: 'value',
    label: 'За что клиенты особенно ценят компанию?', hint: '' },
  { id: 'val_diff', stage: 'value',
    label: 'Что компания делает иначе и чем это доказать?', hint: '' },
  { id: 'val_recommend', stage: 'value',
    label: 'За что компанию рекомендуют?',
    hint: 'Что пишут в отзывах, что говорят друзьям, когда советуют вас.' },
  { id: 'val_proof', stage: 'value', required: true, key: true,
    label: 'Чем доказываем — что реально есть на руках?',
    hint: 'Цифры, кейсы, сертификаты, награды, фото до/после, отзывы с именами. Только то, что можно показать.' },
  { id: 'val_no', stage: 'value', required: true, key: true, summary: true,
    label: 'Чего нет — что обещать нельзя?',
    hint: 'Гарантии, сроки и цифры, которых у бизнеса нет. Это защита: на сайте не появится ни одного обещания, которое вы не сможете выполнить.' },

  // 06 · Материалы и доступы
  { id: 'mat_access', stage: 'files',
    label: 'Есть ли доступ к CRM, звонкам, перепискам, причинам отказа?',
    hint: 'Достаточно написать, что есть и кто может дать доступ. Пароли сюда не пишите.' },
  { id: 'mat_existing', stage: 'files',
    label: 'Какие отзывы, FAQ, звонки или переписки уже есть?', hint: '' },
  { id: 'mat_assets', stage: 'files',
    label: 'Есть ли сайт, презентации, прайс, документы, фото, рендеры?', hint: '' },
  { id: 'mat_links', stage: 'files', type: 'links',
    label: 'Ссылки',
    hint: 'По одной на строку: сайт, соцсети, облако с файлами.',
    placeholder: 'https://…' },
  { id: 'mat_files', stage: 'files', type: 'files',
    label: 'Файлы',
    hint: 'Прайс, презентация, фото, документы — до 10 файлов, каждый до 18 МБ.' },

  // 07 · Контакты
  { id: 'name', stage: 'contacts', type: 'text', required: true,
    label: 'Как вас зовут?', hint: '', autocomplete: 'name' },
  { id: 'company', stage: 'contacts', type: 'text',
    label: 'Компания или проект', hint: '', autocomplete: 'organization' },
  { id: 'contact', stage: 'contacts', type: 'text', required: true,
    label: 'Телеграм, телефон или почта',
    hint: 'Удобнее всего Telegram — например, @username.' },
  { id: 'extra', stage: 'contacts',
    label: 'Что-то ещё, о чём я не спросила?', hint: '' },
  { id: 'consent', stage: 'contacts', type: 'consent', required: true,
    label: 'Я соглашаюсь на обработку персональных данных', hint: '' }
];

/* =====================================================
   4. ОГРАНИЧЕНИЯ И ТЕХНИЧЕСКИЕ КОНСТАНТЫ
   ===================================================== */
const LIMITS = { maxFiles: 10, maxFileSize: 18 * 1024 * 1024 };
const DRAFT_KEY = 'brief-draft-v1';
const TOTAL = STAGES.length;
const FINAL_STEP = TOTAL + 1;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================================================
   СОСТОЯНИЕ
   step: 0 — интро, 1…7 — этапы, 8 — финал
   ===================================================== */
const state = {
  step: 0,
  answers: {},
  files: [],          // { id, name, size, type, blob }
  consent: false,
  tried: new Set(),   // этапы, где уже нажимали «Далее» с пустыми полями
  sending: false,
  last: null          // копия ответов для «Скачать копию» после отправки
};

/* ---------- мелкие помощники ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = id => (state.answers[id] || '').trim();
const stageQs = stageId => QUESTIONS.filter(q => q.stage === stageId);
const isTextQ = q => q.type !== 'files' && q.type !== 'consent';

function formatSize(b) {
  if (b < 1024) return b + ' Б';
  if (b < 1024 * 1024) return Math.round(b / 1024) + ' КБ';
  return (b / 1024 / 1024).toFixed(1).replace('.', ',') + ' МБ';
}

/* =====================================================
   ЧЕРНОВИК: тексты — в localStorage, файлы — в IndexedDB.
   Любая ошибка хранилища не ломает форму.
   ===================================================== */
const Draft = {
  load() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { return null; }
  },
  save() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        v: 1, answers: state.answers, step: Math.min(state.step, TOTAL), savedAt: Date.now()
      }));
      return true;
    } catch (e) { return false; }
  },
  clear() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ничего */ }
  }
};

const FileStore = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise(resolve => {
      try {
        const req = indexedDB.open('brief-files', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('files', { keyPath: 'id' });
        req.onsuccess = () => { this.db = req.result; resolve(this.db); };
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  },
  async run(mode, fn) {
    const db = await this.open();
    if (!db) return null;
    return new Promise(resolve => {
      try {
        const tx = db.transaction('files', mode);
        const req = fn(tx.objectStore('files'));
        tx.oncomplete = () => resolve(req ? req.result : true);
        tx.onerror = tx.onabort = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  },
  put(rec) { return this.run('readwrite', s => s.put(rec)); },
  del(id) { return this.run('readwrite', s => s.delete(id)); },
  all() { return this.run('readonly', s => s.getAll()); },
  clear() { return this.run('readwrite', s => s.clear()); }
};

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (Draft.save()) flashSaved();
  }, 400);
}

let savedTimer = null;
function flashSaved() {
  const n = $('#savedNote');
  n.textContent = 'Черновик сохранён';
  n.classList.add('is-on');
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => n.classList.remove('is-on'), 1600);
}

/* =====================================================
   ОТРИСОВКА ЭТАПОВ ИЗ МАССИВА
   ===================================================== */
function renderStages() {
  const root = $('#stages');
  STAGES.forEach((st, i) => {
    const sec = document.createElement('section');
    sec.className = 'screen stage';
    sec.id = 'stage-' + st.id;
    sec.dataset.step = i + 1;
    sec.setAttribute('aria-labelledby', 'st-title-' + st.id);
    sec.innerHTML =
      '<header class="stage-head">' +
        '<p class="stage-num"><span class="stage-num-big">' + pad(i + 1) + '</span><span class="stage-num-total">/ ' + pad(TOTAL) + '</span></p>' +
        '<h2 class="stage-title" id="st-title-' + st.id + '" tabindex="-1">' + esc(st.title) + '</h2>' +
        '<p class="stage-lead">' + esc(st.lead) + '</p>' +
      '</header>' +
      '<div class="fields"></div>';
    const fields = $('.fields', sec);
    stageQs(st.id).forEach(q => fields.appendChild(renderQuestion(q)));
    root.appendChild(sec);
  });

  // список этапов на интро
  $('#introStages').innerHTML = STAGES.map((st, i) =>
    '<li><span>' + pad(i + 1) + '</span>' + esc(st.title) + '</li>').join('');

  // точки-навигация
  $('#dots').innerHTML = STAGES.map((st, i) =>
    '<button class="dot" type="button" data-go="' + (i + 1) + '" aria-label="Этап ' + (i + 1) + ': ' + esc(st.title) + '"></button>').join('');
}

function labelHtml(q, forId) {
  return '<label class="q-label" for="' + forId + '">' +
    '<span class="q-text">' + esc(q.label) +
      (q.required ? '<span class="q-req" aria-hidden="true">&nbsp;*</span>' : '') +
    '</span>' +
    (q.key ? '<span class="badge">важно</span>' : '') +
  '</label>' +
  (q.hint ? '<p class="q-hint" id="' + forId + '-hint">' + esc(q.hint) + '</p>' : '');
}

function renderQuestion(q) {
  const wrap = document.createElement('div');
  const fid = 'f-' + q.id;
  wrap.className = 'q' + (q.key ? ' is-key' : '') + ' q-' + (q.type || 'textarea');
  wrap.dataset.q = q.id;
  const err = '<p class="q-error" id="' + fid + '-err">' +
    (q.type === 'consent' ? 'Без согласия отправить бриф не получится' : 'Ответьте, пожалуйста, — это обязательный вопрос') + '</p>';
  const describedBy = (q.hint ? fid + '-hint ' : '') + fid + '-err';

  if (q.type === 'consent') {
    const docs = SITE.legal.slice(0, 2).map(d =>
      '<a href="' + esc(d.href) + '" target="_blank" rel="noopener">' + esc(d.title.toLowerCase()) + '</a>').join(' и ');
    wrap.innerHTML =
      '<label class="check">' +
        '<input type="checkbox" id="' + fid + '" data-id="consent" aria-describedby="' + fid + '-err">' +
        '<span class="check-box" aria-hidden="true"></span>' +
        '<span class="check-text">Я соглашаюсь на обработку персональных данных в&nbsp;соответствии с&nbsp;152-ФЗ и&nbsp;принимаю ' + docs + '.</span>' +
      '</label>' + err;
    return wrap;
  }

  if (q.type === 'files') {
    wrap.innerHTML =
      '<p class="q-label"><span class="q-text">' + esc(q.label) + '</span></p>' +
      (q.hint ? '<p class="q-hint">' + esc(q.hint) + '</p>' : '') +
      '<div class="drop" id="drop" role="button" tabindex="0" aria-label="Загрузить файлы">' +
        '<input type="file" id="fileInput" multiple hidden>' +
        '<span class="drop-icon" aria-hidden="true">+</span>' +
        '<span class="drop-title">Перетащите файлы сюда</span>' +
        '<span class="drop-sub">или нажмите, чтобы выбрать</span>' +
      '</div>' +
      '<p class="drop-msg" id="dropMsg" aria-live="polite"></p>' +
      '<ul class="file-list" id="fileList"></ul>';
    return wrap;
  }

  const isInput = q.type === 'text';
  const ph = q.placeholder ? ' placeholder="' + esc(q.placeholder) + '"' : '';
  const ac = q.autocomplete ? ' autocomplete="' + q.autocomplete + '"' : '';
  const control = isInput
    ? '<input class="input" type="text" id="' + fid + '" data-id="' + q.id + '"' + ph + ac + ' aria-describedby="' + describedBy + '">'
    : '<textarea class="input" id="' + fid + '" data-id="' + q.id + '" rows="3"' + ph +
      (q.type === 'links' ? ' spellcheck="false"' : '') + ' aria-describedby="' + describedBy + '"></textarea>';
  wrap.innerHTML = labelHtml(q, fid) + control + err;
  return wrap;
}

/* ---------- поле растёт вместе с текстом ---------- */
function autosize(t) {
  if (t.tagName !== 'TEXTAREA' || !t.offsetParent) return;
  const border = t.offsetHeight - t.clientHeight;
  t.style.height = 'auto';
  t.style.height = (t.scrollHeight + border) + 'px';
}
function autosizeIn(root) { $$('textarea', root).forEach(autosize); }

/* =====================================================
   ПРОВЕРКА ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ
   ===================================================== */
function isFilled(q) {
  if (q.type === 'consent') return state.consent;
  if (q.type === 'files') return state.files.length > 0;
  return val(q.id) !== '';
}

function missingIn(stageIndex) {
  return stageQs(STAGES[stageIndex].id).filter(q => q.required && !isFilled(q));
}

function markStage(stageIndex) {
  stageQs(STAGES[stageIndex].id).forEach(q => setInvalid(q.id, q.required && !isFilled(q)));
}

function setInvalid(id, on) {
  const box = $('.q[data-q="' + id + '"]');
  if (!box) return;
  box.classList.toggle('is-invalid', on);
  const ctrl = $('[data-id]', box);
  if (ctrl) {
    if (on) ctrl.setAttribute('aria-invalid', 'true'); else ctrl.removeAttribute('aria-invalid');
  }
}

function focusFirstInvalid(stageIndex) {
  const q = missingIn(stageIndex)[0];
  if (!q) return;
  const box = $('.q[data-q="' + q.id + '"]');
  box.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
  const ctrl = $('[data-id]', box);
  if (ctrl) setTimeout(() => ctrl.focus({ preventScroll: true }), REDUCED ? 0 : 350);
}

/* =====================================================
   НАВИГАЦИЯ
   ===================================================== */
function goTo(step, opts = {}) {
  hideToast();
  state.step = step;
  $$('.screen').forEach(s => s.classList.remove('is-active'));
  let screen;
  if (step === 0) screen = $('#screenIntro');
  else if (step === FINAL_STEP) screen = $('#screenFinal');
  else screen = $('.stage[data-step="' + step + '"]');
  screen.classList.add('is-active');
  autosizeIn(screen);

  const onStage = step >= 1 && step <= TOTAL;
  $('#stepnav').hidden = !onStage;
  document.body.classList.toggle('has-nav', onStage);
  document.body.dataset.screen = step === 0 ? 'intro' : step === FINAL_STEP ? 'final' : 'stage';

  updateChrome();
  // интро не перезаписывает этап, на котором человек остановился
  if (onStage) Draft.save();

  if (!opts.noScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  if (onStage && !opts.noFocus) {
    const h = $('.stage-title', screen);
    if (h) h.focus({ preventScroll: true });
  }
}

function updateChrome() {
  const s = state.step;
  const cur = s === FINAL_STEP ? TOTAL : s;
  $('#counterCur').textContent = pad(cur);
  $('#counterTotal').textContent = pad(TOTAL);
  $('#progressFill').style.transform = 'scaleX(' + (s === FINAL_STEP ? 1 : cur / TOTAL) + ')';

  $$('.dot').forEach((d, i) => {
    const n = i + 1;
    const stage = STAGES[i];
    const any = stageQs(stage.id).some(q => q.type !== 'consent' && isFilled(q));
    const missing = missingIn(i).length > 0;
    d.classList.toggle('is-current', n === s);
    d.classList.toggle('is-done', any && !missing && n !== s);
    d.classList.toggle('has-error', state.tried.has(i) && missing && n !== s);
    if (n === s) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
  });

  $('#backBtn').disabled = false;
  const last = s === TOTAL;
  $('.btn-text', $('#nextBtn')).textContent = state.sending ? 'Отправляю…' : last ? 'Отправить' : 'Далее';
  $('#nextBtn').classList.toggle('is-send', last);
  $('#nextBtn').disabled = state.sending;
}

function next() {
  const i = state.step - 1;
  if (missingIn(i).length) {
    state.tried.add(i);
    markStage(i);
    focusFirstInvalid(i);
    updateChrome();
    return;
  }
  if (state.step === TOTAL) submit();
  else goTo(state.step + 1);
}

function back() {
  goTo(Math.max(0, state.step - 1));
}

/* =====================================================
   ФАЙЛЫ
   ===================================================== */
function addFiles(list) {
  const msgs = [];
  for (const f of Array.from(list)) {
    if (state.files.length >= LIMITS.maxFiles) { msgs.push('Можно приложить не больше ' + LIMITS.maxFiles + ' файлов.'); break; }
    if (f.size > LIMITS.maxFileSize) { msgs.push('«' + f.name + '» больше 18 МБ — пришлите его ссылкой.'); continue; }
    if (state.files.some(x => x.name === f.name && x.size === f.size)) continue;
    const rec = { id: Date.now() + '-' + Math.random().toString(36).slice(2, 8), name: f.name, size: f.size, type: f.type, blob: f };
    state.files.push(rec);
    FileStore.put(rec);
  }
  $('#dropMsg').textContent = msgs.join(' ');
  renderFiles();
}

function removeFile(id) {
  state.files = state.files.filter(f => f.id !== id);
  FileStore.del(id);
  $('#dropMsg').textContent = '';
  renderFiles();
}

function renderFiles() {
  const ul = $('#fileList');
  if (!ul) return;
  ul.innerHTML = state.files.map(f =>
    '<li>' +
      '<span class="file-name">' + esc(f.name) + '</span>' +
      '<span class="file-size">' + formatSize(f.size) + '</span>' +
      '<button type="button" class="file-del" data-del="' + f.id + '" aria-label="Удалить ' + esc(f.name) + '">×</button>' +
    '</li>').join('');
  const drop = $('#drop');
  drop.classList.toggle('is-full', state.files.length >= LIMITS.maxFiles);
  $('.drop-sub', drop).textContent = state.files.length
    ? 'Загружено ' + state.files.length + ' из ' + LIMITS.maxFiles
    : 'или нажмите, чтобы выбрать';
  updateChrome();
}

function bindDrop() {
  const drop = $('#drop');
  const input = $('#fileInput');
  drop.addEventListener('click', () => input.click());
  drop.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
  ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'dragend', 'drop'].forEach(t => drop.addEventListener(t, () => drop.classList.remove('is-over')));
  drop.addEventListener('drop', e => { e.preventDefault(); if (e.dataTransfer) addFiles(e.dataTransfer.files); });
  // файл, брошенный мимо зоны, не должен открываться в браузере вместо брифа
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => e.preventDefault());
  $('#fileList').addEventListener('click', e => {
    const b = e.target.closest('[data-del]');
    if (b) removeFile(b.dataset.del);
  });
}

/* =====================================================
   СБОРКА ОТВЕТОВ
   ===================================================== */
function snapshot() {
  return {
    name: val('name'),
    company: val('company'),
    contact: val('contact'),
    submittedAt: new Date().toISOString(),
    page: location.href,
    summary: QUESTIONS.filter(q => q.summary && val(q.id)).map(q => ({ label: q.label, answer: val(q.id) })),
    stages: STAGES.map((st, i) => ({
      num: pad(i + 1),
      title: st.title,
      items: stageQs(st.id).filter(q => isTextQ(q) && val(q.id)).map(q => ({ id: q.id, label: q.label, answer: val(q.id) }))
    })),
    files: state.files.map(f => ({ name: f.name, size: f.size })),
    filledStages: STAGES.filter(st => stageQs(st.id).some(q => isTextQ(q) && val(q.id))).length,
    totalStages: TOTAL
  };
}

function snapshotToText(s) {
  const d = new Date(s.submittedAt);
  const lines = [
    'БРИФ НА САЙТ',
    'Дата: ' + d.toLocaleString('ru-RU'),
    'Имя: ' + (s.name || '—'),
    'Компания: ' + (s.company || '—'),
    'Контакт: ' + (s.contact || '—'),
    ''
  ];
  s.stages.forEach(st => {
    if (!st.items.length) return;
    lines.push('', '=== ' + st.num + ' · ' + st.title.toUpperCase() + ' ===', '');
    st.items.forEach(it => lines.push(it.label, it.answer, ''));
  });
  if (s.files.length) {
    lines.push('', '=== ФАЙЛЫ (пришлите их отдельно) ===');
    s.files.forEach(f => lines.push('— ' + f.name + ' (' + formatSize(f.size) + ')'));
  }
  return lines.join('\n');
}

function downloadAnswers(s) {
  try {
    const blob = new Blob(['﻿' + snapshotToText(s)], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'brief-' + s.submittedAt.slice(0, 10) + '.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  } catch (e) {
    toast('Не получилось скачать файл. Ответы сохранены в этом браузере.');
  }
}

/* =====================================================
   ОТПРАВКА
   Порядок: сначала текст (самое ценное), потом файлы по одному.
   При любой ошибке — файл с ответами и черновик остаются.
   ===================================================== */
function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, Object.assign({}, opts, { signal: ctrl.signal })).finally(() => clearTimeout(t));
}

async function submit() {
  // финальная проверка всех этапов
  for (let i = 0; i < TOTAL; i++) {
    if (missingIn(i).length) {
      state.tried.add(i);
      goTo(i + 1, { noFocus: true });
      markStage(i);
      focusFirstInvalid(i);
      toast('Остались незаполненные обязательные вопросы');
      return;
    }
  }
  if (state.sending) return;

  const snap = snapshot();
  state.last = snap;
  const endpoint = ((window.BRIEF_CONFIG && window.BRIEF_CONFIG.endpoint) || '').trim().replace(/\/+$/, '');

  // приёмник ещё не подключён — сразу отдаём файл
  if (!endpoint) {
    downloadAnswers(snap);
    showFinal('manual', { reason: 'noendpoint' });
    return;
  }

  state.sending = true;
  updateChrome();
  try {
    const res = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ website: $('#hpField').value }, snap))
    }, 25000);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || ('HTTP ' + res.status));

    const failed = [];
    for (const f of state.files) {
      try {
        const fd = new FormData();
        fd.append('file', f.blob, f.name);
        fd.append('caption', '📎 ' + snap.name + ' · ' + snap.contact);
        const r = await fetchWithTimeout(endpoint + '/file', { method: 'POST', body: fd }, 120000);
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || ('HTTP ' + r.status));
      } catch (e) { failed.push(f.name); }
    }

    state.sending = false;
    Draft.clear();
    FileStore.clear();
    showFinal('sent', { failed });
  } catch (e) {
    state.sending = false;
    console.error('Бриф не отправлен:', e);
    downloadAnswers(snap);
    showFinal('manual', { reason: 'error' });
  }
}

/* =====================================================
   ФИНАЛЬНЫЙ ЭКРАН
   ===================================================== */
function showFinal(mode, info = {}) {
  const sent = mode === 'sent';
  let title, text, extra = '';
  if (sent) {
    title = 'Спасибо!';
    text = 'Я получила ваш бриф и&nbsp;скоро с&nbsp;вами свяжусь.';
    if (info.failed && info.failed.length) {
      extra = '<p class="final-note">Не загрузились файлы: ' + info.failed.map(esc).join(', ') +
        '. Пришлите их, пожалуйста, мне в&nbsp;Telegram — ответы при этом дошли.</p>';
    }
  } else if (info.reason === 'noendpoint') {
    title = 'Спасибо!';
    text = 'Ответы сохранены в&nbsp;файл — он уже скачался. Пришлите его мне в&nbsp;Telegram, и&nbsp;я&nbsp;возьму бриф в&nbsp;работу.';
    if (state.files.length) extra = '<p class="final-note">Приложенные файлы отправьте тем же сообщением.</p>';
  } else {
    title = 'Почти готово';
    text = 'Не получилось отправить бриф — похоже, проблема со&nbsp;связью. Ответы не&nbsp;потерялись: они скачались файлом и&nbsp;сохранены в&nbsp;этом браузере.';
    extra = '<p class="final-note">Попробуйте отправить ещё раз или пришлите файл мне в&nbsp;Telegram.</p>';
  }

  const steps = [
    ['Изучу ответы и&nbsp;материалы', 'Прочитаю бриф целиком, посмотрю файлы и&nbsp;ссылки.'],
    ['Напишу вам в&nbsp;течение ' + esc(SITE.replyDays), 'Задам уточняющие вопросы, если что-то будет непонятно.'],
    ['Предложу структуру сайта', 'Покажу, какие блоки и&nbsp;в&nbsp;каком порядке будут продавать.']
  ];

  $('#screenFinal').innerHTML =
    '<figure class="final-photo">' +
      '<img src="' + esc(SITE.photo) + '" alt="' + esc(SITE.owner) + '" onerror="this.parentNode.classList.add(\'is-empty\');this.remove()">' +
      '<span class="final-photo-fallback" aria-hidden="true">' + esc((SITE.owner || '?').trim().charAt(0)) + '</span>' +
    '</figure>' +
    '<div class="final-body">' +
      '<h1 class="display final-title" tabindex="-1">' + title + '</h1>' +
      '<p class="lead">' + text + '</p>' + extra +
      '<div class="final-actions">' +
        '<a class="btn btn-primary" href="' + esc(SITE.telegram) + '" target="_blank" rel="noopener">Написать в&nbsp;Telegram</a>' +
        (info.reason === 'error' ? '<button class="btn btn-ghost" type="button" data-act="retry">Отправить ещё раз</button>' : '') +
        '<button class="btn btn-ghost" type="button" data-act="download">Скачать копию ответов</button>' +
      '</div>' +
      '<div class="final-next">' +
        '<p class="eyebrow">Что дальше</p>' +
        '<ol>' + steps.map((s, i) => '<li><span class="final-next-num">' + pad(i + 1) + '</span><div><b>' + s[0] + '</b><p>' + s[1] + '</p></div></li>').join('') + '</ol>' +
      '</div>' +
      (sent ? '' : '<button class="link-btn" type="button" data-act="edit">← Вернуться к ответам</button>') +
    '</div>';

  goTo(FINAL_STEP);
  const h = $('.final-title');
  if (h) h.focus({ preventScroll: true });
}

/* =====================================================
   УВЕДОМЛЕНИЯ
   ===================================================== */
let toastTimer = null;
function toast(text, action) {
  const t = $('#toast');
  t.innerHTML = '<span>' + esc(text) + '</span>' +
    (action ? '<button type="button" class="toast-btn">' + esc(action.label) + '</button>' : '');
  if (action) $('.toast-btn', t).addEventListener('click', () => { hideToast(); action.fn(); });
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add('is-on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, action ? 6000 : 3500);
}
function hideToast() {
  const t = $('#toast');
  t.classList.remove('is-on');
  setTimeout(() => { if (!t.classList.contains('is-on')) t.hidden = true; }, 300);
}

/* =====================================================
   ЗАПУСК
   ===================================================== */
function fillSite() {
  $$('[data-site="brand"]').forEach(n => { n.textContent = SITE.brand; });
  $('#footerContact').href = SITE.telegram;
  $('#footerLinks').innerHTML = SITE.legal.map(d =>
    '<a href="' + esc(d.href) + '" target="_blank" rel="noopener">' + esc(d.title) + '</a>').join('');
  $('#footerReq').textContent = SITE.requisites;
}

function applyAnswers() {
  $$('[data-id]').forEach(c => {
    const id = c.dataset.id;
    if (id === 'consent') { c.checked = state.consent; return; }
    c.value = state.answers[id] || '';
  });
}

function hasAnyAnswer() {
  return Object.keys(state.answers).some(k => (state.answers[k] || '').trim());
}

function resetAll() {
  if (!confirm('Стереть все ответы и начать заново?')) return;
  state.answers = {};
  state.files = [];
  state.consent = false;
  state.tried.clear();
  Draft.clear();
  FileStore.clear();
  applyAnswers();
  $$('.q.is-invalid').forEach(b => b.classList.remove('is-invalid'));
  renderFiles();
  updateIntro();
  goTo(0);
}

function updateIntro() {
  const has = hasAnyAnswer() || state.files.length > 0;
  $('#startBtn').firstChild.textContent = has ? 'Продолжить' : 'Начать';
  $('#resetBtn').hidden = !has;
}

function bindEvents() {
  const form = $('#briefForm');
  form.addEventListener('submit', e => e.preventDefault());

  form.addEventListener('input', e => {
    const c = e.target.closest('[data-id]');
    if (!c) return;
    const id = c.dataset.id;
    if (id === 'consent') state.consent = c.checked;
    else state.answers[id] = c.value;
    autosize(c);
    const q = QUESTIONS.find(x => x.id === id);
    if (q && q.required && isFilled(q)) setInvalid(id, false);
    scheduleSave();
    updateChrome();
  });
  form.addEventListener('change', e => {
    if (e.target.dataset.id === 'consent') {
      state.consent = e.target.checked;
      if (state.consent) setInvalid('consent', false);
      updateChrome();
    }
  });

  // Enter в однострочном поле — к следующему полю, а не отправка формы
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('input.input')) {
      e.preventDefault();
      const all = $$('.stage.is-active [data-id]');
      const nextCtrl = all[all.indexOf(e.target) + 1];
      if (nextCtrl) nextCtrl.focus(); else next();
    }
    // Ctrl/Cmd + Enter — «Далее»
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); next(); }
  });

  $('#startBtn').addEventListener('click', () => {
    const d = Draft.load();
    goTo(d && d.step >= 1 && d.step <= TOTAL ? d.step : 1);
  });
  $('#resetBtn').addEventListener('click', resetAll);
  $('#nextBtn').addEventListener('click', next);
  $('#backBtn').addEventListener('click', back);
  $('#dots').addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (b) goTo(Number(b.dataset.go));
  });

  $('#screenFinal').addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'download') downloadAnswers(state.last || snapshot());
    if (b.dataset.act === 'retry') { goTo(TOTAL, { noFocus: true }); submit(); }
    if (b.dataset.act === 'edit') goTo(TOTAL);
  });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => autosizeIn($('.screen.is-active')), 150);
  }, { passive: true });

  // на всякий случай сохраняем при закрытии вкладки
  window.addEventListener('pagehide', () => Draft.save());
  document.addEventListener('visibilitychange', () => { if (document.hidden) Draft.save(); });
}

async function init() {
  fillSite();
  renderStages();
  bindDrop();
  bindEvents();

  const d = Draft.load();
  if (d && d.answers) state.answers = d.answers;
  applyAnswers();

  const stored = await FileStore.all();
  if (stored && stored.length) state.files = stored.slice(0, LIMITS.maxFiles);
  renderFiles();

  const restored = hasAnyAnswer() || state.files.length > 0;
  updateIntro();
  goTo(0, { noFocus: true });

  if (restored) {
    toast('Черновик восстановлен', { label: 'Продолжить', fn: () => $('#startBtn').click() });
  }
}

init();
