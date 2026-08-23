/* ============================================================
   components.js — единый источник шапки и футера сайта «Флорис».
   Разметка хранится строками и инжектится в плейсхолдеры
   #site-header-mount и #site-footer-mount. БЕЗ fetch —
   работает и при открытии файла напрямую, и на любом хостинге.

   ВАЖНО: инжект выполняется СИНХРОННО в момент загрузки скрипта
   (не на DOMContentLoaded), чтобы .topbar-badge и прочие узлы
   шапки/футера существовали к моменту запуска инлайновых
   скриптов страниц (корзина, счётчики), которые идут ниже по DOM.
   Поэтому <script src="components.js"></script> должен стоять
   СРАЗУ после #site-footer-mount и ПЕРЕД скриптами корзины.
   ============================================================ */
(function () {
  'use strict';

  /* -------------------- РАЗМЕТКА ШАПКИ -------------------- */
  var HEADER_HTML = '' +
'<header class="site-header">' +
'  <div class="topbar">' +
'    <div class="topbar-left">' +
'      <button class="topbar-burger" aria-label="меню" data-menu-toggle="nav-menu"><span></span><span></span><span></span></button>' +
'      <a class="topbar-logo" href="index.html"><span class="topbar-logo-text"><span class="lg-cap">Ф</span><span class="lg-rest">лорис</span></span></a>' +
'' +
'      <div class="menu-panel" id="nav-menu">' +
'        <div class="menu-col">' +
'          <p class="menu-label">Навигация:</p>' +
'          <a href="категории.html">Каталог</a>' +
'          <a href="авторские.html">Авторские букеты</a>' +
'          <a href="свадебные.html">Свадебные букеты</a>' +
'          <a href="моно.html">Моно-букеты</a>' +
'          <a href="коробки.html">Букеты в коробках</a>' +
'        </div>' +
'        <div class="menu-col">' +
'          <a href="о-компании.html">О компании</a>' +
'          <a href="отзывы.html">Отзывы</a>' +
'          <a href="заказ.html">Доставка и оплата</a>' +
'          <a href="faq.html">Часто задаваемые вопросы</a>' +
'        </div>' +
'      </div>' +
'    </div>' +
'    <div class="topbar-right">' +
'      <button class="topbar-search" aria-label="поиск" data-menu-toggle="catalog-menu">' +
'        <svg class="glass" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
'      </button>' +
'      <a class="topbar-basket" href="корзина.html" aria-label="корзина">' +
'        <svg class="basket-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 8V6.5a4 4 0 0 1 8 0V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4.6 8h14.8l-1 11.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4.6 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>' +
'        <span class="topbar-badge">0</span>' +
'      </a>' +
'' +
'      <div class="menu-panel right search-panel" id="catalog-menu">' +
'        <div class="search-box">' +
'          <button type="button" class="search-box-icon" id="search-submit" aria-label="искать">' +
'            <img src="frames/поиск/zoom-icon.svg" alt="">' +
'          </button>' +
'          <input type="text" class="search-box-input" id="search-input" placeholder="Введите поисковый запрос" autocomplete="off">' +
'        </div>' +
'        <div class="search-popular">' +
'          <p class="search-popular-label">Популярные запросы:</p>' +
'          <div class="search-popular-grid">' +
'            <button type="button" class="search-chip" data-query="Букет невесты" data-target="свадебные.html"><span>Букет невесты</span><i class="chip-radio"></i></button>' +
'            <button type="button" class="search-chip" data-query="Розы" data-target="моно.html"><span>Розы</span><i class="chip-radio"></i></button>' +
'            <button type="button" class="search-chip" data-query="Хризантемы" data-target="моно.html"><span>Хризантемы</span><i class="chip-radio"></i></button>' +
'            <button type="button" class="search-chip" data-query="Цветы в коробке" data-target="коробки.html"><span>Цветы в коробке</span><i class="chip-radio"></i></button>' +
'            <button type="button" class="search-chip selected" data-query="Пионы" data-target="моно.html"><span>Пионы</span><i class="chip-radio"></i></button>' +
'            <button type="button" class="search-chip" data-query="Лилии" data-target="моно.html"><span>Лилии</span><i class="chip-radio"></i></button>' +
'          </div>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'</header>';

  /* -------------------- РАЗМЕТКА ФУТЕРА -------------------- */
  var FOOTER_HTML = '' +
'<footer class="page footer" id="контакты">' +
'  <div class="footer-wrap">' +
'' +
'    <div class="footer-cta">' +
'      <div class="footer-cta-copy">' +
'        <p class="footer-cta-eyebrow">Флорис · с 2016 года</p>' +
'        <p class="footer-cta-title">Соберём букет под ваш повод — свежий, за&nbsp;2&nbsp;часа по&nbsp;Москве.</p>' +
'      </div>' +
'      <a class="footer-cta-btn" href="категории.html" data-magnetic>' +
'        <span>Выбрать букет</span>' +
'        <span class="fcta-arrow"><svg viewBox="0 0 20 16" width="20" height="16" fill="none"><path d="M3 8h13.5M12 3.5 16.5 8 12 12.5" stroke="#BFCC2A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
'      </a>' +
'    </div>' +
'' +
'    <div class="footer-divider"></div>' +
'' +
'    <div class="footer-cols">' +
'      <div class="footer-brand">' +
'        <span class="footer-brand-logo">Флорис</span>' +
'        <div class="footer-brand-text">' +
'          <p>Цветочный магазин с&nbsp;доставкой по&nbsp;Москве.</p>' +
'          <p>Свежие букеты. Доставка в&nbsp;течение 2&nbsp;часов.</p>' +
'          <p>Служба поддержки 24/7.</p>' +
'        </div>' +
'      </div>' +
'      <div class="footer-col">' +
'        <h4>Навигация</h4>' +
'        <a href="категории.html">Каталог</a>' +
'        <a href="о-компании.html">О компании</a>' +
'        <a href="отзывы.html">Отзывы</a>' +
'        <a href="заказ.html">Доставка и оплата</a>' +
'        <a href="faq.html">Вопросы и ответы</a>' +
'      </div>' +
'      <div class="footer-col">' +
'        <h4>Информация</h4>' +
'        <a href="faq.html">Гарантия свежести</a>' +
'        <a href="faq.html">Правила возврата</a>' +
'        <a href="заказ.html">Способы оплаты</a>' +
'        <a href="faq.html">Корпоративные заказы</a>' +
'      </div>' +
'      <div class="footer-col footer-contacts-col">' +
'        <h4>Контакты</h4>' +
'        <div class="footer-contacts">' +
'          <div class="footer-contact">' +
'            <p class="footer-label">Телефон</p>' +
'            <a href="tel:+74951284090">+7 (495) 128-40-90</a>' +
'          </div>' +
'          <div class="footer-contact">' +
'            <p class="footer-label">E-mail</p>' +
'            <a href="mailto:order@flowershop.ru">order@flowershop.ru</a>' +
'          </div>' +
'          <div class="footer-contact">' +
'            <p class="footer-label">Адрес</p>' +
'            <p>Москва, ул. Большая Дмитровка, 9</p>' +
'          </div>' +
'        </div>' +
'      </div>' +
'    </div>' +
'' +
'    <div class="footer-signature" aria-hidden="true">' +
'      <p class="footer-wordmark"><span class="wm-rest">Флорис</span></p>' +
'    </div>' +
'' +
'    <div class="footer-bottom">' +
'      <p class="footer-copy">© 2016–2026 Флорис. Все права защищены.</p>' +
'      <div class="footer-socials">' +
'        <a href="#">Telegram</a>' +
'        <a href="#">VK</a>' +
'        <a href="#">WhatsApp</a>' +
'      </div>' +
'    </div>' +
'' +
'  </div>' +
'</footer>';

  /* -------------------- РАЗМЕТКА КАТАЛОГ-DOCK -------------------- */
  var CATALOG_HTML = '' +
'<section class="page home-catalog" id="каталог-превью">' +
'  <div class="home-catalog-head">' +
'    <h2 class="home-catalog-title"><span class="cap">Б</span>укеты для<br>любого повода</h2>' +
'    <a class="home-catalog-all" href="категории.html">' +
'      <span>Весь каталог</span>' +
'      <span class="ico-arrow"><svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="#BFCC2A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
'    </a>' +
'  </div>' +
'' +
'  <div class="dock" id="dock" role="list" aria-label="Категории букетов">' +
'    <a class="dock__card" href="авторские.html" role="listitem">' +
'      <video class="dock__video" src="frames/video/авторский-букет.mp4" muted loop playsinline preload="metadata" aria-hidden="true"></video>' +
'      <span class="dock__fade" aria-hidden="true"></span>' +
'      <span class="dock__price">от 4 500 ₽</span>' +
'      <span class="dock__body">' +
'        <span class="dock__label">Авторские букеты</span>' +
'        <span class="dock__note">Ручная сборка флориста</span>' +
'      </span>' +
'    </a>' +
'    <a class="dock__card" href="моно.html" role="listitem">' +
'      <video class="dock__video" src="frames/video/моно-букет.mp4" muted loop playsinline preload="metadata" aria-hidden="true"></video>' +
'      <span class="dock__fade" aria-hidden="true"></span>' +
'      <span class="dock__price">от 2 900 ₽</span>' +
'      <span class="dock__body">' +
'        <span class="dock__label">Моно-букеты</span>' +
'        <span class="dock__note">Один сорт — максимум красоты</span>' +
'      </span>' +
'    </a>' +
'    <a class="dock__card" href="свадебные.html" role="listitem">' +
'      <video class="dock__video" src="frames/video/свадебный-букет.mp4" muted loop playsinline preload="metadata" aria-hidden="true"></video>' +
'      <span class="dock__fade" aria-hidden="true"></span>' +
'      <span class="dock__price">от 6 300 ₽</span>' +
'      <span class="dock__body">' +
'        <span class="dock__label">Свадебные букеты</span>' +
'        <span class="dock__note">Для главного дня</span>' +
'      </span>' +
'    </a>' +
'    <a class="dock__card" href="коробки.html" role="listitem">' +
'      <video class="dock__video" src="frames/video/букет-в-коробке.mp4" muted loop playsinline preload="metadata" aria-hidden="true"></video>' +
'      <span class="dock__fade" aria-hidden="true"></span>' +
'      <span class="dock__price">от 4 500 ₽</span>' +
'      <span class="dock__body">' +
'        <span class="dock__label">Букеты в коробках</span>' +
'        <span class="dock__note">Готовы без хлопот с вазой</span>' +
'      </span>' +
'    </a>' +
'  </div>' +
'</section>';

  /* -------------------- РАЗМЕТКА FAQ -------------------- */
  var FAQ_HTML = '' +
'<section class="page home-faq" id="home-faq">' +
'  <div class="home-faq-inner">' +
'' +
'    <header class="home-faq-head">' +
'      <p class="home-faq-eyebrow">Вопросы и ответы</p>' +
'      <h2 class="home-faq-title"><span class="cap">О</span>тветы на<br>Ваши вопросы</h2>' +
'      <p class="home-faq-lead">Собрали то, о&nbsp;чём чаще всего спрашивают перед заказом. Не&nbsp;нашли свой вопрос — <a href="faq.html">смотрите полный список</a>.</p>' +
'    </header>' +
'' +
'    <div class="home-faq-list" id="home-faq-list">' +
'      <div class="home-faq-item">' +
'        <button class="home-faq-row" type="button" aria-expanded="false">' +
'          <span class="home-faq-q">Как долго стоят букеты?</span>' +
'          <span class="home-faq-plus" aria-hidden="true"></span>' +
'        </button>' +
'        <div class="home-faq-answer-wrap"><div class="home-faq-answer-inner">' +
'          <p class="home-faq-a">Мы всегда работаем только со&nbsp;свежесрезанными цветами, поэтому в&nbsp;среднем букет радует от&nbsp;5 до&nbsp;7&nbsp;дней — а&nbsp;хризантемы и&nbsp;гладиолусы при бережном уходе способны простоять и&nbsp;все 10. Держите букет подальше от&nbsp;батарей и&nbsp;прямого солнца и&nbsp;не&nbsp;забывайте менять воду.</p>' +
'        </div></div>' +
'      </div>' +
'' +
'      <div class="home-faq-item">' +
'        <button class="home-faq-row" type="button" aria-expanded="false">' +
'          <span class="home-faq-q">Как ухаживать за&nbsp;букетом, чтобы он&nbsp;стоял дольше?</span>' +
'          <span class="home-faq-plus" aria-hidden="true"></span>' +
'        </button>' +
'        <div class="home-faq-answer-wrap"><div class="home-faq-answer-inner">' +
'          <p class="home-faq-a">Секрет прост: сразу после&nbsp;доставки подрежьте стебли острым ножом под&nbsp;углом 45° — это откроет цветку доступ к&nbsp;воде. Уберите листья ниже уровня воды, меняйте воду каждые один-два дня и&nbsp;держите букет подальше от&nbsp;батарей и&nbsp;сквозняков.</p>' +
'        </div></div>' +
'      </div>' +
'' +
'      <div class="home-faq-item">' +
'        <button class="home-faq-row" type="button" aria-expanded="false">' +
'          <span class="home-faq-q">Какие правила возврата?</span>' +
'          <span class="home-faq-plus" aria-hidden="true"></span>' +
'        </button>' +
'        <div class="home-faq-answer-wrap"><div class="home-faq-answer-inner">' +
'          <p class="home-faq-a">Если букет пришёл не&nbsp;таким, каким вы&nbsp;увидели его на&nbsp;фото, или цветы оказались несвежими — напишите нам в&nbsp;течение 24&nbsp;часов и&nbsp;приложите пару фотографий. Мы во&nbsp;всём разберёмся и&nbsp;либо привезём новый букет, либо вернём деньги полностью, без лишних вопросов.</p>' +
'        </div></div>' +
'      </div>' +
'' +
'      <div class="home-faq-item">' +
'        <button class="home-faq-row" type="button" aria-expanded="false">' +
'          <span class="home-faq-q">Способы оплаты и&nbsp;рассрочка?</span>' +
'          <span class="home-faq-plus" aria-hidden="true"></span>' +
'        </button>' +
'        <div class="home-faq-answer-wrap"><div class="home-faq-answer-inner">' +
'          <p class="home-faq-a">Оплатить заказ можно любым удобным способом: банковской картой онлайн, через Систему быстрых платежей или наличными курьеру при&nbsp;получении. Рассрочку мы пока не&nbsp;подключили, но&nbsp;уже работаем над&nbsp;этим — скоро такая возможность появится для&nbsp;заказов от&nbsp;10&nbsp;000&nbsp;рублей.</p>' +
'        </div></div>' +
'      </div>' +
'' +
'      <div class="home-faq-item">' +
'        <button class="home-faq-row" type="button" aria-expanded="false">' +
'          <span class="home-faq-q">Как оформить корпоративный заказ?</span>' +
'          <span class="home-faq-plus" aria-hidden="true"></span>' +
'        </button>' +
'        <div class="home-faq-answer-wrap"><div class="home-faq-answer-inner">' +
'          <p class="home-faq-a">С&nbsp;радостью поможем и&nbsp;с&nbsp;разовым корпоративным подарком, и&nbsp;с&nbsp;регулярными поставками цветов в&nbsp;офис. Напишите на&nbsp;order@fiowershop.ru или позвоните — расскажите про&nbsp;повод и&nbsp;бюджет, а&nbsp;мы подберём букеты и&nbsp;составим удобный график доставки. По&nbsp;запросу оформим все закрывающие документы.</p>' +
'        </div></div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'</section>';

  /* -------------------- КОРЗИНА: счётчик в шапке, общий для всех страниц --------------------
     Раньше счётчик жил только в памяти инлайн-скрипта каждой страницы и сбрасывался
     на 0 при любом переходе — из-за этого в шапке «не всегда» было видно, что товар
     добавлен. Теперь значение хранится в localStorage и подтягивается на каждой странице. */
  var CART_COUNT_KEY = 'florisCartCount';
  function florisGetCartCount(){
    var v = parseInt(localStorage.getItem(CART_COUNT_KEY), 10);
    return (isNaN(v) || v < 0) ? 0 : v;
  }
  function florisSetCartCount(n){
    n = Math.max(0, parseInt(n, 10) || 0);
    try { localStorage.setItem(CART_COUNT_KEY, String(n)); } catch (e) {}
    document.querySelectorAll('.topbar-badge').forEach(function (b) { b.textContent = String(n); });
    return n;
  }
  window.florisCart = { get: florisGetCartCount, set: florisSetCartCount };

  /* -------------------- ИНЖЕКТ -------------------- */
  var headerMount = document.getElementById('site-header-mount');
  if (headerMount) headerMount.outerHTML = HEADER_HTML;
  florisSetCartCount(florisGetCartCount());

  var footerMount = document.getElementById('site-footer-mount');
  if (footerMount) footerMount.outerHTML = FOOTER_HTML;

  var catalogMount = document.getElementById('catalog-mount');
  if (catalogMount) catalogMount.outerHTML = CATALOG_HTML;

  var faqMount = document.getElementById('faq-mount');
  if (faqMount) faqMount.outerHTML = FAQ_HTML;

  /* -------------------- МЕНЮ / ПОИСК (бывший инлайн-скрипт шапки) -------------------- */
  function initMenu() {
    var toggles = document.querySelectorAll('[data-menu-toggle]');
    function closeAll(except) {
      document.querySelectorAll('.menu-panel.open').forEach(function (p) {
        if (p !== except) p.classList.remove('open');
      });
    }
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var panel = document.getElementById(btn.getAttribute('data-menu-toggle'));
        var willOpen = !panel.classList.contains('open');
        closeAll();
        if (willOpen) panel.classList.add('open');
      });
    });
    document.addEventListener('click', function () { closeAll(); });
    document.querySelectorAll('.menu-panel').forEach(function (p) {
      p.addEventListener('click', function (e) { e.stopPropagation(); });
    });
    document.querySelectorAll('.menu-panel a').forEach(function (a) {
      a.addEventListener('click', function () { closeAll(); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

    var searchMap = {
      'букет невесты': 'свадебные.html',
      'розы': 'моно.html',
      'хризантемы': 'моно.html',
      'цветы в коробке': 'коробки.html',
      'пионы': 'моно.html',
      'лилии': 'моно.html'
    };
    var searchInput = document.getElementById('search-input');
    var searchSubmit = document.getElementById('search-submit');
    document.querySelectorAll('.search-chip').forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.search-chip').forEach(function (c) { c.classList.remove('selected'); });
        chip.classList.add('selected');
        if (searchInput) { searchInput.value = chip.getAttribute('data-query'); searchInput.focus(); }
      });
    });
    function runSearch() {
      if (!searchInput) return;
      var q = searchInput.value.trim().toLowerCase();
      if (!q) return;
      var target = searchMap[q];
      if (!target) {
        for (var key in searchMap) {
          if (q.indexOf(key) !== -1 || key.indexOf(q) !== -1) { target = searchMap[key]; break; }
        }
      }
      window.location.href = target || 'категории.html';
    }
    if (searchSubmit) searchSubmit.addEventListener('click', function (e) { e.stopPropagation(); runSearch(); });
    if (searchInput) searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); runSearch(); } });
  }

  /* -------------------- ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ -------------------- */
  function initActiveLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var current = decodeURIComponent(path);
    document.querySelectorAll('.menu-panel a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (decodeURIComponent(href) === current) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* -------------------- МАГНИТНЫЕ КНОПКИ (бывший инлайн-скрипт футера) -------------------- */
  function initMagnetic() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = 0.28;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * strength;
        var y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.setProperty('--mx', x.toFixed(1) + 'px');
        el.style.setProperty('--my', y.toFixed(1) + 'px');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  /* -------------------- СТЕКЛЯННАЯ ПЛАШКА ПРИ СКРОЛЛЕ (is-scrolled) -------------------- */
  function initScrolled() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var hero = document.querySelector('.hero');
    function threshold() {
      if (hero) return Math.max(120, hero.offsetHeight - 120);
      return 40;
    }
    var footer = document.querySelector('.footer');
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > threshold());
        // у футера прячем закреплённую шапку — не мешает тёмному блоку
        if (footer) {
          var top = footer.getBoundingClientRect().top;
          header.classList.toggle('is-at-footer', top < 90);
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------- КАТАЛОГ-DOCK (hover-play видео) -------------------- */
  /* Портировано с index.html. Без magnetic-зума: карточки равные и ровные.
     На наведение — оживает видео этой карточки (плавный fade через CSS),
     на уход — пауза и сброс к первому кадру. На touch / узких экранах /
     reduced-motion — статичный список, видео тихим лупом (постер-эффект). */
  function initCatalog() {
    var dock = document.getElementById('dock');
    if (!dock) return;
    var cards = Array.prototype.slice.call(dock.querySelectorAll('.dock__card'));
    if (!cards.length) return;
    var videos = cards.map(function(c){ return c.querySelector('.dock__video'); });

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;
    var wideEnough = window.matchMedia('(min-width: 861px)').matches;

    if (!finePointer || !wideEnough || reduced) {
      if (!reduced) {
        videos.forEach(function(v){ if (v) { var p = v.play(); if (p && p.catch) p.catch(function(){}); } });
      }
      return;
    }

    cards.forEach(function(card, i){
      var v = videos[i];
      if (!v) return;
      card.addEventListener('mouseenter', function(){
        var p = v.play(); if (p && p.catch) p.catch(function(){});
      });
      card.addEventListener('mouseleave', function(){
        v.pause(); try { v.currentTime = 0; } catch(e){}
      });
    });
  }

  /* -------------------- FAQ-аккордеон (max-height) -------------------- */
  /* Портировано с index.html. Тихое раскрытие через max-height. */
  function initFAQ() {
    document.querySelectorAll('.home-faq-item').forEach(function(item){
      var row = item.querySelector('.home-faq-row');
      var wrap = item.querySelector('.home-faq-answer-wrap');
      var inner = item.querySelector('.home-faq-answer-inner');
      if (!row || !wrap || !inner) return;
      row.addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        item.classList.toggle('open', !isOpen);
        row.setAttribute('aria-expanded', String(!isOpen));
        wrap.style.maxHeight = isOpen ? '0px' : (inner.scrollHeight + 'px');
      });
    });
    window.addEventListener('resize', function(){
      document.querySelectorAll('.home-faq-item.open').forEach(function(item){
        var wrap = item.querySelector('.home-faq-answer-wrap');
        var inner = item.querySelector('.home-faq-answer-inner');
        if (wrap && inner) wrap.style.maxHeight = inner.scrollHeight + 'px';
      });
    });
  }

  /* Инициализация. Узлы шапки/футера уже в DOM (инжект выше — синхронный),
     поэтому обработчики можно вешать сразу. */
  initMenu();
  initActiveLink();
  initMagnetic();
  initScrolled();
  initCatalog();
  initFAQ();
})();
