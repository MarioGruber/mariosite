/* mariogruber.com - interaction layer (v3, 20 Nov 2026). No dependencies, CSP-safe. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* reveal: anything already on screen stays visible, the rest fades up on scroll */
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var vh = window.innerHeight || doc.clientHeight;
  items.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < vh * 0.95 && r.bottom > 0) el.classList.add('in');
  });
  doc.classList.add('js');
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* year */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* sticky nav, scroll progress, gentle drift of the hero shapes */
  var nav = document.getElementById('nav');
  var bar = document.querySelector('#progress span');
  var drift = reduce ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-drift]'));
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-stuck', y > 24);
    if (bar) {
      var h = doc.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (drift.length && y < window.innerHeight * 1.4) {
      drift.forEach(function (el) {
        var k = parseFloat(el.getAttribute('data-drift')) || 0;
        el.style.transform = 'translate3d(0,' + (y * k).toFixed(1) + 'px,0)';
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* mobile menu */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      menu.hidden = open;
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); menu.hidden = true; }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { burger.click(); burger.focus(); }
    });
  }

  /* animated counters */
  function run(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = pre + target + suf; return; }
    var t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
    setTimeout(function () { el.textContent = pre + target + suf; }, dur + 400);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (hasIO) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(run);
  }

  /* marquees: only animate while on screen */
  var marquees = document.querySelectorAll('[data-marquee]');
  if (hasIO && !reduce) {
    var mo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var t = en.target.querySelector('.marquee__track');
        if (t) t.style.animationPlayState = en.isIntersecting ? '' : 'paused';
      });
    });
    marquees.forEach(function (m) { mo.observe(m); });
  }

  /* FAQ: keep the opened answer in view on small screens */
  document.querySelectorAll('details.qa').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open || window.innerWidth > 720) return;
      var r = d.getBoundingClientRect();
      if (r.top < 80) window.scrollBy({ top: r.top - 96, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
