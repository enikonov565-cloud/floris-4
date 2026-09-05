/* ============================================================
   webgl-carousel.js — порт Originkit «WebGL Carousel» на чистый JS
   (без React/JSX/TypeScript, вместо three.js-хуков — обычный класс).

   Колода карточек тянется в сторону мышью/колесом, складывается
   пирамидой вокруг центральной, по клику раскрывается в карточку
   покрупнее (это САМ механизм «попапа» — отдельное всплывающее окно
   поверх страницы не нужно). Требует three.js (см. <script> перед
   этим файлом).

   Использование:
     var inst = FlorisWebGLCarousel(containerEl, {
       images: [{src:'...', name:'...', price: 1234, focusY:50}, ...],
       cardWidth, cardHeight, cardGap, openedWidth, openedHeight,
       onActiveChange: function(index){ ... }
     });
     inst.dispose();
   ============================================================ */
(function(){
  'use strict';
  if (typeof THREE === 'undefined') { console.warn('webgl-carousel: three.js не найден'); return; }

  var FOV = 75;
  var CAM_Z = 5;

  var DEFAULTS = {
    images: [],
    cardWidth: 220,
    cardHeight: 280,
    cardGap: 46,
    openedWidth: 480,
    openedHeight: 480,
    imageFit: 'cover',
    imageFocusY: 50,
    deckSag: 10,
    hoverZoom: 10,
    dragSensitivity: 10,
    refraction: 1,
    openTransition: { duration: 1.1, ease: [0.165, 0.84, 0.44, 1] },
    onActiveChange: null
  };

  var NAMED_EASES = {
    linear: [0,0,1,1], ease:[0.25,0.1,0.25,1], easeIn:[0.42,0,1,1], easeOut:[0,0,0.58,1],
    easeInOut:[0.42,0,0.58,1], circIn:[0.55,0,1,0.45], circOut:[0,0.55,0.45,1],
    circInOut:[0.85,0,0.15,1], backIn:[0.36,0,0.66,-0.56], backOut:[0.34,1.56,0.64,1],
    backInOut:[0.68,-0.6,0.32,1.6], anticipate:[0.36,0,0.66,-0.56]
  };

  function makeEaseFn(transition){
    var pts = [0.165, 0.84, 0.44, 1];
    var ease = transition && transition.ease;
    if (Array.isArray(ease) && ease.length === 4) pts = ease;
    else if (typeof ease === 'string' && NAMED_EASES[ease]) pts = NAMED_EASES[ease];
    var x1 = pts[0], y1 = pts[1], x2 = pts[2], y2 = pts[3];
    if (x1 === y1 && x2 === y2) return function(t){ return t; };
    function bez(a, b, t){ var u = 1 - t; return 3*u*u*t*a + 3*u*t*t*b + t*t*t; }
    return function(t){
      var x = Math.max(0, Math.min(1, t));
      var s = x;
      for (var i = 0; i < 8; i++){
        var cx = bez(x1, x2, s) - x;
        var u = 1 - s;
        var dx = 3*u*u*x1 + 6*u*s*(x2-x1) + 3*s*s*(1-x2);
        if (Math.abs(dx) < 1e-6) break;
        s -= cx / dx;
        s = Math.max(0, Math.min(1, s));
      }
      return bez(y1, y2, s);
    };
  }

  function clamp(v, lo, hi, fallback){
    var n = (typeof v === 'number' && isFinite(v)) ? v : fallback;
    return Math.max(lo, Math.min(hi, n));
  }

  function settingsFor(cfg){
    var duration = Math.max(0.05, (cfg.openTransition && cfg.openTransition.duration) || 1.1);
    return {
      cardWidth: clamp(cfg.cardWidth, 20, 1200, DEFAULTS.cardWidth),
      cardHeight: clamp(cfg.cardHeight, 20, 1600, DEFAULTS.cardHeight),
      cardGap: clamp(cfg.cardGap, 0, 200, DEFAULTS.cardGap),
      openedWidth: clamp(cfg.openedWidth, 40, 3000, DEFAULTS.openedWidth),
      openedHeight: clamp(cfg.openedHeight, 40, 3000, DEFAULTS.openedHeight),
      deckSag: (clamp(cfg.deckSag, 0, 20, DEFAULTS.deckSag) / 10) * 0.1,
      hoverScale: 1 + clamp(cfg.hoverZoom, 0, 20, DEFAULTS.hoverZoom) * 0.01,
      speedWheel: clamp(cfg.dragSensitivity, 1, 20, DEFAULTS.dragSensitivity) * 0.002,
      speedDrag: -clamp(cfg.dragSensitivity, 1, 20, DEFAULTS.dragSensitivity) * 0.03,
      refraction: 0.05 + ((clamp(cfg.refraction, 1, 10, DEFAULTS.refraction) - 1) / 9) * 0.95,
      duration: duration,
      followRate: 5 / duration
    };
  }

  function srcOf(item){
    if (typeof item === 'string') return item;
    var image = item && item.image;
    if (typeof image === 'string') return image;
    return (image && image.src) || (item && item.src) || '';
  }
  function focusOf(item){
    var value = (typeof item === 'string') ? undefined : (item && item.focusY);
    var n = clamp(value, 0, 100, DEFAULTS.imageFocusY);
    return 1 - n / 100;
  }
  function itemsOf(cfg){
    var list = Array.isArray(cfg.images) ? cfg.images : [];
    return list.filter(function(item){ return srcOf(item) !== ''; });
  }
  function sourcesOf(cfg){ return itemsOf(cfg).map(srcOf).join('|'); }

  var textureCache = new Map();
  var texturePending = new Map();
  function loadTexture(url){
    var cached = textureCache.get(url);
    if (cached) return Promise.resolve(cached);
    var pending = texturePending.get(url);
    if (pending) return pending;
    var p = new Promise(function(resolve){
      var loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(url, function(texture){
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        textureCache.set(url, texture);
        resolve(texture);
      }, undefined, function(){ resolve(null); });
    });
    texturePending.set(url, p);
    return p;
  }

  var PLANE_VERTEX = [
    'varying vec2 vUv;',
    'uniform float uProgress;',
    'uniform vec2 uZoomScale;',
    'void main() {',
    '    vUv = uv;',
    '    vec3 pos = position;',
    '    float angle = uProgress * 3.14159265 / 2.;',
    '    float wave = cos(angle);',
    '    float c = sin(length(uv - .5) * 15. + uProgress * 12.) * .5 + .5;',
    '    pos.x *= mix(1., uZoomScale.x + wave * c, uProgress);',
    '    pos.y *= mix(1., uZoomScale.y + wave * c, uProgress);',
    '    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
    '}'
  ].join('\n');

  var PLANE_FRAGMENT = [
    'uniform sampler2D uTex;',
    'uniform vec2 uRes;',
    'uniform vec2 uZoomScale;',
    'uniform vec2 uImageRes;',
    'uniform float uFocusY;',
    'varying vec2 vUv;',
    'vec2 CoverUV(vec2 u, vec2 s, vec2 i, float f) {',
    '    float rs = s.x / s.y;',
    '    float ri = i.x / i.y;',
    '    vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);',
    '    vec2 o = (rs < ri ? vec2((st.x - s.x) * 0.5, 0.0) : vec2(0.0, (st.y - s.y) * f)) / st;',
    '    return u * s / st + o;',
    '}',
    'void main() {',
    '    vec2 uv = CoverUV(vUv, uRes, uImageRes, uFocusY);',
    '    vec3 tex = texture2D(uTex, uv).rgb;',
    '    gl_FragColor = vec4(tex, 1.0);',
    '}'
  ].join('\n');

  var POST_VERTEX = [
    'varying vec2 vUv;',
    'void main() {',
    '    vUv = uv;',
    '    gl_Position = vec4(position.xy, 0.0, 1.0);',
    '}'
  ].join('\n');

  var POST_FRAGMENT = [
    'uniform sampler2D uScene;',
    'uniform float uThickness;',
    'varying vec2 vUv;',
    'void main() {',
    '    vec2 dir = vUv - 0.5;',
    '    float k = uThickness;',
    '    vec4 r = texture2D(uScene, vUv + dir * k * 0.06);',
    '    vec4 g = texture2D(uScene, vUv + dir * k * 0.02);',
    '    vec4 b = texture2D(uScene, vUv - dir * k * 0.06);',
    '    gl_FragColor = vec4(r.r, g.g, b.b, max(r.a, max(g.a, b.a)));',
    '}'
  ].join('\n');

  function CarouselScene(container, cfg){
    this.container = container;
    this.cfg = cfg;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 1000);
    this.geometry = new THREE.PlaneGeometry(1, 1, 30, 30);
    this.cards = [];

    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.Camera();
    this.postGeometry = new THREE.PlaneGeometry(2, 2);

    this.items = [];
    this.textures = [];
    this.sources = [];

    this.progress = 0;
    this.oldProgress = 0;
    this.speed = 0;
    this.active = null;
    this.hovered = -1;
    this.lastReportedActive = null;

    this.isDown = false;
    this.startX = 0;
    this.downX = 0;
    this.downY = 0;

    this.ease = makeEaseFn(cfg.openTransition);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.width = 1;
    this.height = 1;
    this.frameId = 0;
    this.lastT = 0;
    this.disposed = false;
    this.closedBox = new THREE.Vector2();
    this.openedBox = new THREE.Vector2();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    var el = this.renderer.domElement;
    el.style.position = 'absolute';
    el.style.inset = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.cursor = 'grab';
    el.style.touchAction = 'pan-y';
    container.appendChild(el);

    this.camera.position.z = CAM_Z;

    this.target = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true });
    this.postMaterial = new THREE.ShaderMaterial({
      vertexShader: POST_VERTEX, fragmentShader: POST_FRAGMENT,
      transparent: true, depthTest: false, depthWrite: false,
      uniforms: { uScene: { value: this.target.texture }, uThickness: { value: 0 } }
    });
    var quad = new THREE.Mesh(this.postGeometry, this.postMaterial);
    quad.frustumCulled = false;
    this.postScene.add(quad);

    var self = this;
    this.onWheel = function(e){ self._onWheel(e); };
    this.onPointerDown = function(e){ self._onPointerDown(e); };
    this.onPointerMove = function(e){ self._onPointerMove(e); };
    this.onPointerUp = function(e){ self._onPointerUp(e); };
    this.onPointerLeave = function(){ self._onPointerLeave(); };

    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointerleave', this.onPointerLeave);
    el.addEventListener('pointercancel', this.onPointerUp);

    this.loadAll();
  }

  CarouselScene.prototype._viewportHeight = function(){
    return 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z;
  };
  CarouselScene.prototype._worldPerPx = function(){
    return this._viewportHeight() / Math.max(1, this.height);
  };
  CarouselScene.prototype._setPointer = function(e){
    var rect = this.renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    );
  };
  CarouselScene.prototype._onWheel = function(e){
    if (this.active !== null) return;
    e.preventDefault();
    var S = settingsFor(this.cfg);
    var vertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
    this.progress += (vertical ? e.deltaY : e.deltaX) * S.speedWheel;
  };
  CarouselScene.prototype._onPointerDown = function(e){
    this.downX = e.clientX; this.downY = e.clientY;
    if (this.active !== null) return;
    this.isDown = true;
    this.startX = e.clientX;
    this.renderer.domElement.style.cursor = 'grabbing';
  };
  CarouselScene.prototype._onPointerMove = function(e){
    this._setPointer(e);
    if (this.active !== null || !this.isDown) return;
    var S = settingsFor(this.cfg);
    this.progress += (e.clientX - this.startX) * S.speedDrag;
    this.startX = e.clientX;
  };
  CarouselScene.prototype._onPointerUp = function(e){
    this.isDown = false;
    this.renderer.domElement.style.cursor = 'grab';
    var travel = Math.hypot(e.clientX - this.downX, e.clientY - this.downY);
    if (travel > 5) return;
    if (this.active !== null){ this.setActive(null); return; }
    this._setPointer(e);
    var hit = this._pick();
    if (hit >= 0) this.setActive(hit);
  };
  CarouselScene.prototype._onPointerLeave = function(){
    this.isDown = false;
    this.hovered = -1;
    this.renderer.domElement.style.cursor = 'grab';
  };
  CarouselScene.prototype._pick = function(){
    if (!this.cards.length) return -1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    var meshes = this.cards.map(function(c){ return c.mesh; });
    var hits = this.raycaster.intersectObjects(meshes, false);
    if (!hits.length) return -1;
    var mesh = hits[0].object;
    for (var i = 0; i < this.cards.length; i++) if (this.cards[i].mesh === mesh) return i;
    return -1;
  };
  CarouselScene.prototype.setActive = function(index){
    this.active = index;
    if (index !== null && this.cards.length > 1){
      this.progress = (index / (this.cards.length - 1)) * 100;
    }
    var S = settingsFor(this.cfg);
    for (var i = 0; i < this.cards.length; i++){
      var card = this.cards[i];
      var wanted = card.index === index ? 1 : 0;
      if (wanted !== card.openTarget){
        card.openTarget = wanted;
        card.openT = 0;
        card.zDelay = wanted === 1 ? 0 : S.duration;
      }
    }
  };
  CarouselScene.prototype.loadAll = function(){
    var self = this;
    this.items = itemsOf(this.cfg);
    this.sources = this.items.map(srcOf);
    this.textures = this.sources.map(function(){ return null; });
    this._build();
    this.sources.forEach(function(src, i){
      loadTexture(src).then(function(tex){
        if (self.disposed || self.sources[i] !== src) return;
        self.textures[i] = tex;
        var card = self.cards[i];
        if (!card || !tex) return;
        card.material.uniforms.uTex.value = tex;
        var img = tex.image || {};
        var iw = img.width || 1, ih = img.height || 1;
        card.material.uniforms.uImageRes.value.set(iw, ih);
        card.imageAspect = iw / ih;
      });
    });
  };
  CarouselScene.prototype._build = function(){
    this._clearCards();
    for (var i = 0; i < this.sources.length; i++){
      var material = new THREE.ShaderMaterial({
        vertexShader: PLANE_VERTEX, fragmentShader: PLANE_FRAGMENT,
        uniforms: {
          uProgress: { value: 0 },
          uZoomScale: { value: new THREE.Vector2(1, 1) },
          uTex: { value: this.textures[i] || null },
          uRes: { value: new THREE.Vector2(1, 1) },
          uImageRes: { value: new THREE.Vector2(1, 1) },
          uFocusY: { value: focusOf(this.items[i]) }
        }
      });
      var mesh = new THREE.Mesh(this.geometry, material);
      mesh.position.set(0, 0, -0.01);
      this.cards.push({
        mesh: mesh, material: material, index: i, imageAspect: 1,
        hover: 1, open: 0, openTarget: 0, openT: 1, zDelay: 0
      });
      this.scene.add(mesh);
    }
  };
  CarouselScene.prototype._boxFor = function(card, widthPx, heightPx, out){
    var perPx = this._worldPerPx();
    var w = widthPx * perPx, h = heightPx * perPx;
    if (this.cfg.imageFit !== 'contain') return out.set(w, h);
    var ia = card.imageAspect > 0 ? card.imageAspect : 1;
    var fitted = Math.min(w / ia, h);
    return out.set(fitted * ia, fitted);
  };
  CarouselScene.prototype.setSize = function(width, height){
    if (this.disposed) return;
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.renderer.setSize(this.width, this.height, false);
    var dpr = this.renderer.getPixelRatio();
    this.target.setSize(this.width * dpr, this.height * dpr);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  };
  CarouselScene.prototype.updateConfig = function(cfg){
    if (this.disposed) return;
    var prev = this.cfg;
    this.cfg = cfg;
    this.ease = makeEaseFn(cfg.openTransition);
    if (sourcesOf(cfg) !== sourcesOf(prev)){ this.loadAll(); return; }
    this.items = itemsOf(cfg);
    for (var i = 0; i < this.cards.length; i++){
      this.cards[i].material.uniforms.uFocusY.value = focusOf(this.items[this.cards[i].index]);
    }
  };
  CarouselScene.prototype.start = function(){
    var self = this;
    this.lastT = performance.now();
    function loop(){
      self.frameId = requestAnimationFrame(loop);
      self._step();
    }
    this.frameId = requestAnimationFrame(loop);
  };
  CarouselScene.prototype._step = function(){
    if (this.disposed) return;
    var now = performance.now();
    var dt = (now - this.lastT) / 1000;
    this.lastT = now;
    if (!isFinite(dt) || dt < 0) dt = 0;
    if (dt > 0.05) dt = 0.05;

    var S = settingsFor(this.cfg);
    var n = this.cards.length;
    if (!n) return;

    this.progress = Math.max(0, Math.min(100, this.progress));
    var active = Math.floor((this.progress / 100) * Math.max(1, n - 1));

    if (active !== this.lastReportedActive){
      this.lastReportedActive = active;
      if (typeof this.cfg.onActiveChange === 'function') this.cfg.onActiveChange(active);
    }

    var perPx = this._worldPerPx();
    var step = S.cardWidth * perPx + S.cardGap * perPx;
    var follow = 1 - Math.exp(-dt * S.followRate);
    var hoverRate = 1 - Math.exp(-dt * 6);

    if (this.active === null && !this.isDown) this.hovered = this._pick();
    this.renderer.domElement.style.cursor = this.active !== null ? 'zoom-out' : (this.isDown ? 'grabbing' : (this.hovered >= 0 ? 'pointer' : 'grab'));

    for (var idx = 0; idx < this.cards.length; idx++){
      var card = this.cards[idx];
      var i = card.index;
      var pyramidal = i === active ? n : n - Math.abs(active - i);
      var targetX = (i - active) * step;
      var targetY = n * -S.deckSag + pyramidal * S.deckSag;

      var mesh = card.mesh;
      mesh.position.x += (targetX - mesh.position.x) * follow;
      mesh.position.y += (targetY - mesh.position.y) * follow;

      var wantHover = (this.active === null && this.hovered === i) ? S.hoverScale : 1;
      card.hover += (wantHover - card.hover) * hoverRate;

      if (card.openT < 1){
        card.openT = Math.min(1, card.openT + dt / S.duration);
        var eased = this.ease(card.openT);
        card.open = card.openTarget === 1 ? eased : 1 - eased;
      } else {
        card.open = card.openTarget;
      }

      this._boxFor(card, S.cardWidth, S.cardHeight, this.closedBox);
      this._boxFor(card, S.openedWidth, S.openedHeight, this.openedBox);
      var t = card.open;

      var u = card.material.uniforms;
      u.uProgress.value = t;
      u.uZoomScale.value.set(
        this.openedBox.x / Math.max(1e-5, this.closedBox.x),
        this.openedBox.y / Math.max(1e-5, this.closedBox.y)
      );
      u.uRes.value.set(
        this.closedBox.x + (this.openedBox.x - this.closedBox.x) * t,
        this.closedBox.y + (this.openedBox.y - this.closedBox.y) * t
      );

      mesh.scale.set(this.closedBox.x * card.hover, this.closedBox.y * card.hover, 1);

      if (card.zDelay > 0) card.zDelay -= dt;
      mesh.position.z = (card.openTarget === 1 || card.zDelay > 0) ? 0 : -0.01;
      mesh.renderOrder = card.openTarget === 1 ? 1 : 0;
    }

    if (typeof this.cfg.onCardsLayout === 'function'){
      var infos = [];
      var pv = this._layoutVec || (this._layoutVec = new THREE.Vector3());
      for (var li = 0; li < this.cards.length; li++){
        var lc = this.cards[li];
        var hWorld = this.closedBox.y + (this.openedBox.y - this.closedBox.y) * lc.open;
        pv.set(lc.mesh.position.x, lc.mesh.position.y - hWorld * lc.hover / 2, lc.mesh.position.z);
        pv.project(this.camera);
        infos.push({
          index: lc.index,
          x: (pv.x * 0.5 + 0.5) * this.width,
          y: (-pv.y * 0.5 + 0.5) * this.height,
          open: lc.open
        });
      }
      this.cfg.onCardsLayout(infos);
    }

    var settle = 1 - Math.exp(-dt * 6);
    this.speed += (Math.abs(this.oldProgress - this.progress) - this.speed) * settle;
    this.oldProgress += (this.progress - this.oldProgress) * settle;
    this.postMaterial.uniforms.uThickness.value = Math.min(this.speed, 20) * S.refraction;

    this.renderer.setRenderTarget(this.target);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);
  };
  CarouselScene.prototype._clearCards = function(){
    for (var i = 0; i < this.cards.length; i++){
      this.scene.remove(this.cards[i].mesh);
      this.cards[i].material.dispose();
    }
    this.cards = [];
  };
  CarouselScene.prototype.dispose = function(){
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    var el = this.renderer.domElement;
    el.removeEventListener('wheel', this.onWheel);
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointerleave', this.onPointerLeave);
    el.removeEventListener('pointercancel', this.onPointerUp);
    this._clearCards();
    this.geometry.dispose();
    this.postGeometry.dispose();
    this.postMaterial.dispose();
    this.target.dispose();
    this.renderer.dispose();
    if (el.parentNode === this.container) this.container.removeChild(el);
  };

  function FlorisWebGLCarousel(container, config){
    if (!container) return null;
    var cfg = {};
    for (var k in DEFAULTS) cfg[k] = DEFAULTS[k];
    for (var k2 in config) cfg[k2] = config[k2];

    var scene;
    try { scene = new CarouselScene(container, cfg); }
    catch (e) { console.warn('FlorisWebGLCarousel: WebGL недоступен', e); return null; }

    scene.setSize(container.clientWidth, container.clientHeight);
    scene.start();

    var ro = new ResizeObserver(function(){ scene.setSize(container.clientWidth, container.clientHeight); });
    ro.observe(container);

    return {
      dispose: function(){ ro.disconnect(); scene.dispose(); },
      updateConfig: function(newCfg){
        for (var k3 in newCfg) cfg[k3] = newCfg[k3];
        scene.updateConfig(cfg);
      },
      setActive: function(i){ scene.setActive(i); },
      _scene: scene
    };
  }

  window.FlorisWebGLCarousel = FlorisWebGLCarousel;
})();
