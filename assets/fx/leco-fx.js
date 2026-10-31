/* L'École des Coachs : vibrations sur les appels à l'action. v2 */
(function () {
  'use strict';
  if (window.__lecoFx) return; window.__lecoFx = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sélecteur des appels à l'action ---------- */
  var CTA = [
    '.btn', '.btn-white', '.btn-outline', '.btn-whatsapp', '.nav-btn', '.mobile-menu-cta',
    '.swipe-confirm-handle', '.swipe-confirm', '.elig-nextbtn', '.doc-btn', '.bam-quick-cta',
    'a[href*="dossier-preinscription"]', 'a[href*="reservation-tep"]', 'a[href*="buy.stripe.com"]',
    'a[href*="wa.me"]', 'a[href^="tel:"]', 'a[href*="orus.eu"]', 'a[href*="indy.fr"]',
    'button[type="submit"]', 'input[type="submit"]'
  ].join(',');
  var NO_HAPTIC = '.leco-cb-btn,.mobile-theme-btn,.theme-toggle,.sp-notif-close,.gr-badge-close';

  /* ---------- Vibrations ---------- */
  var iosSwitch = null;
  function iosHaptic() {
    try {
      if (!iosSwitch) {
        var l = document.createElement('label');
        l.setAttribute('aria-hidden', 'true');
        l.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
        var i = document.createElement('input');
        i.type = 'checkbox'; i.setAttribute('switch', ''); i.tabIndex = -1;
        l.appendChild(i); document.body.appendChild(l); iosSwitch = l;
      }
      iosSwitch.click();
    } catch (e) {}
  }
  function haptic(pattern) {
    if (reduce) return;
    try {
      if (navigator.vibrate) { navigator.vibrate(pattern || 12); }
      else if (/iPhone|iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) { iosHaptic(); }
    } catch (e) {}
  }
  window.lecoHaptic = haptic;
  document.addEventListener('pointerdown', function (e) {
    var t = e.target && e.target.closest ? e.target.closest(CTA) : null;
    if (!t || t.closest(NO_HAPTIC)) return;
    haptic(14);
  }, { passive: true, capture: true });
  /* fin de glissement du swipe-confirm : vibration plus marquée */
  document.addEventListener('pointerup', function (e) {
    var sw = e.target && e.target.closest ? e.target.closest('.swipe-confirm') : null;
    if (sw) setTimeout(function () { if (sw.querySelector('.sc-filled')) haptic([18, 40, 28]); }, 60);
  }, { passive: true, capture: true });
})();

/* Pas de mots orphelins : on lie les deux derniers mots de chaque texte par une espace insécable. */
(function () {
  var SEL = 'p,li,dd,dt,h1,h2,h3,h4,figcaption,blockquote,td,.section-desc,.faq-answer-inner';
  /* mémorise les textes déjà traités sans toucher au HTML : évite de recalculer le style de toute la page */
  var done = window.WeakSet ? new WeakSet() : null;
  function fix(el) {
    if (el.getAttribute('data-no-orph')) return;
    if (done) { if (done.has(el)) return; done.add(el); } else { el.setAttribute('data-no-orph', '1'); }
    if (el.querySelector('input,textarea,select')) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), last = null, n;
    while ((n = w.nextNode())) { if (n.nodeValue.replace(/[\s\u00a0]+/g, '')) last = n; }
    if (!last) return;
    var p = last.parentNode && last.parentNode.nodeName;
    if (p === 'SCRIPT' || p === 'STYLE' || p === 'TEXTAREA') return;
    var v = last.nodeValue, t = v.replace(/\s+$/, ''), trail = v.slice(t.length);
    var i = t.lastIndexOf(' ');
    if (i < 1) return;
    var tail = t.slice(i + 1), head = t.slice(0, i);
    if (tail.length > 18 || /\u00a0$/.test(head)) return;
    last.nodeValue = head + '\u00a0' + tail + trail;
  }
  function run() {
    var els = document.querySelectorAll(SEL);
    for (var k = 0; k < els.length; k++) fix(els[k]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', function () { setTimeout(run, 1200); });
})();

/* Apparition au défilement de toutes les sections, sur toutes les pages. v1
   Chaque bloc (titre, paragraphe, carte, liste, image, tableau) apparaît en fondu quand il arrive à l'écran.
   Les blocs déjà animés par une autre règle (.reveal, effets des pages villes, accueil, Prépa TEP) sont laissés tels quels.
   Le haut de page visible au chargement n'est jamais masqué.
   Sans JavaScript, avec « réduire les animations » ou sur un navigateur ancien : tout reste visible, sans mouvement. */
(function () {
  'use strict';
  if (window.__lecoLx) return; window.__lecoLx = true;
  var W = window, D = document;
  var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in W) || !W.CSS || !CSS.supports || !CSS.supports('translate', '0 1px')) return;

  var SKIP = 'body>nav,nav[aria-label],.mobile-menu,.mobile-menu-backdrop,#leco-cookie-banner,.wa-float,.gr-badge,.scroll-bar,'
    + '.tally-modal-overlay,.bam-launcher,.bam-panel,.faq-answer,.lm-progress,.pm-progress,.dir-card,script,style,noscript,template,'
    + 'svg,iframe,canvas,video,input,select,textarea,option,dialog,[hidden],[aria-hidden="true"],[data-no-ax]';
  var STRUCT = /^(MAIN|SECTION|ARTICLE|ASIDE|HEADER|FOOTER|DIV|FORM|FIELDSET|NAV)$/;
  var LEAF = /^(H1|H2|H3|H4|H5|H6|P|DL|TABLE|FIGURE|IMG|PICTURE|BLOCKQUOTE|PRE|DETAILS|HR|A|BUTTON|LI|DT|DD|FIGCAPTION|LABEL)$/;
  var MEDIA = /^(IMG|PICTURE|FIGURE)$/;
  var MAX = 700, vh = 0, units = [], tallReveal = [], stats = { units: 0, motion: 0, visible: 0 };

  function ownMotion(el, cs) {
    if (el.classList.contains('reveal') || el.classList.contains('section-line')) return true;
    if (+cs.opacity < 0.98) return true;
    if (cs.animationName && cs.animationName !== 'none') return true;
    if (cs.transform && cs.transform !== 'none') return true;
    if (cs.translate && cs.translate !== 'none') return true;
    if (cs.scale && cs.scale !== 'none') return true;
    return false;
  }
  function boxed(cs) {
    var bg = cs.backgroundColor;
    return (bg && bg !== 'transparent' && !/rgba\(\d+, \d+, \d+, 0\)/.test(bg)) || parseFloat(cs.borderTopWidth) > 0
      || parseFloat(cs.borderLeftWidth) > 0 || (cs.boxShadow && cs.boxShadow !== 'none') || (cs.backgroundImage && cs.backgroundImage !== 'none');
  }
  function blockKids(el) {
    var out = [], c = el.children;
    for (var i = 0; i < c.length; i++) {
      if (c[i].matches(SKIP)) continue;
      var d = getComputedStyle(c[i]).display;
      if (d === 'none') continue;
      if (d === 'contents') { out = out.concat(blockKids(c[i])); continue; }
      if (d.indexOf('inline') === 0 && d !== 'inline-block' && d !== 'inline-flex' && d !== 'inline-grid') return [];
      out.push(c[i]);
    }
    return out;
  }
  function sideBySide(kids) {
    if (kids.length < 2) return false;
    var t = kids[0].getBoundingClientRect().top;
    for (var i = 1; i < Math.min(kids.length, 6); i++) if (Math.abs(kids[i].getBoundingClientRect().top - t) < 4) return true;
    return false;
  }
  function visit(el) {
    if (units.length >= MAX || el.matches(SKIP)) return;
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    if (cs.display === 'contents') { kids(el); return; }
    if (cs.position === 'fixed' || cs.position === 'sticky' || cs.position === 'absolute') return;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    var tall = r.height > vh * 0.9;
    if (ownMotion(el, cs)) {
      if (el.classList.contains('reveal') && r.height > vh * 1.25) { tallReveal.push(el); kids(el); } else stats.motion++;
      return;
    }
    if (r.bottom <= 0 || r.top < vh * 0.92) { if (tall || r.bottom > 0 && r.top < vh * 0.92 && r.bottom > vh * 0.92) kids(el); else if (r.top < vh * 0.92 && r.bottom > 0) stats.visible++; return; }
    var tag = el.tagName, k;
    if ((tag === 'UL' || tag === 'OL') && el.children.length >= 3 && r.height > 200 && !el.closest('footer')) { kids(el); return; }
    if (LEAF.test(tag) || tag === 'UL' || tag === 'OL') { if (!tall) unit(el, cs); else if (tag === 'LI' || tag === 'DETAILS') kids(el); return; }
    k = blockKids(el);
    if (tall) { if (k.length) kids(el); return; }
    if (k.length >= 2 && (cs.display.indexOf('grid') > -1 || cs.display.indexOf('flex') > -1) && sideBySide(k)) { kids(el); return; }
    if (!STRUCT.test(tag) || (boxed(cs) && tag !== 'SECTION' && tag !== 'MAIN' && tag !== 'FOOTER' && r.width < (el.parentElement ? el.parentElement.getBoundingClientRect().width - 2 : 1e9))) { unit(el, cs); return; }
    if (boxed(cs) && tag === 'DIV' && k.length < 6) { unit(el, cs); return; }
    if (k.length >= 2) { kids(el); return; }
    unit(el, cs);
  }
  function kids(el) { var c = el.children; for (var i = 0; i < c.length; i++) visit(c[i]); }
  function unit(el, cs) {
    if (cs.display === 'inline') return;
    units.push(el);
  }
  function show(el, delay) {
    if (delay) el.style.animationDelay = delay + 'ms';
    el.classList.remove('lx-w'); el.classList.add('lx-in');
    var t;
    function done(ev) {
      if (ev && (ev.target !== el || (ev.animationName !== 'lxIn' && ev.animationName !== 'lxInM'))) return;
      clearTimeout(t); el.classList.remove('lx-in', 'lx-m'); el.style.animationDelay = '';
      el.removeEventListener('animationend', done); el.removeEventListener('animationcancel', done);
    }
    el.addEventListener('animationend', done); el.addEventListener('animationcancel', done);
    t = setTimeout(done, delay + 1600);
  }
  function init() {
    vh = W.innerHeight || D.documentElement.clientHeight;
    if (!vh) return;
    var root = D.querySelector('main') || D.body;
    if (root === D.body) kids(D.body); else { kids(root); var f = D.querySelector('body>footer'); if (f) visit(f); }
    tallReveal.forEach(function (el) { el.classList.add('visible'); });
    if (!units.length) return;
    var io = new IntersectionObserver(function (entries) {
      var list = [];
      entries.forEach(function (en) { if (en.isIntersecting) { list.push(en.target); io.unobserve(en.target); } });
      list.sort(function (a, b) { var x = a.getBoundingClientRect(), y = b.getBoundingClientRect(); return (x.top - y.top) || (x.left - y.left); });
      list.forEach(function (el, i) { show(el, Math.min(i, 6) * 70); });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    units.forEach(function (el) { el.classList.add('lx-w'); if (MEDIA.test(el.tagName)) el.classList.add('lx-m'); io.observe(el); });
    /* filet de sécurité : à l'arrêt du défilement, tout bloc encore masqué mais déjà dans l'écran apparaît */
    var tmr;
    W.addEventListener('scroll', function () {
      clearTimeout(tmr);
      tmr = setTimeout(function () {
        var h = W.innerHeight;
        units.forEach(function (el) {
          if (!el.classList.contains('lx-w')) return;
          var r = el.getBoundingClientRect();
          if (r.top < h && r.bottom > 0) { io.unobserve(el); show(el, 0); }
        });
      }, 220);
    }, { passive: true });
    stats.units = units.length; W.__lecoLxStats = stats;
    W.addEventListener('beforeprint', function () { units.forEach(function (el) { el.classList.remove('lx-w'); }); });
  }
  /* démarre après tous les scripts différés de la page, pour voir les blocs qu'ils animent déjà */
  var booted = false;
  function boot() { if (booted) return; booted = true; init(); }
  if (D.readyState === 'complete') boot(); else { D.addEventListener('DOMContentLoaded', boot); W.addEventListener('load', boot); }
})();
