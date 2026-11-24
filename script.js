// karthickrajan.com — behaviour. No dependencies, no trackers.
(function () {
  'use strict';
  var root = document.documentElement;

  // ---------- Skin switch (persisted per browser) ----------
  var SKINS = { dial: 'Xeno-Dial', grimoire: 'Grimoire', nightfall: 'Nightfall' };
  var ORDER = ['dial', 'grimoire', 'nightfall'];
  var THEME = { dial: '#050805', grimoire: '#0c090d', nightfall: '#04050c' };
  var skinToggle = document.getElementById('skinToggle');
  var skinLabel = document.getElementById('skinLabel');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applySkin(skin) {
    if (!SKINS[skin]) skin = 'dial';
    root.setAttribute('data-skin', skin);
    if (skinLabel) skinLabel.textContent = SKINS[skin];
    if (themeMeta) themeMeta.setAttribute('content', THEME[skin]);
    if (skinToggle) skinToggle.setAttribute('aria-label', 'Theme: ' + SKINS[skin] + '. Switch theme');
  }
  applySkin(root.getAttribute('data-skin'));

  if (skinToggle) {
    skinToggle.addEventListener('click', function () {
      var i = ORDER.indexOf(root.getAttribute('data-skin'));
      var next = ORDER[(i + 1) % ORDER.length];
      applySkin(next);
      try { localStorage.setItem('skin', next); } catch (e) { /* storage unavailable */ }
    });
  }

  // ---------- Mobile menu ----------
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Footer year ----------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Field-note filters ----------
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var notes = Array.prototype.slice.call(document.querySelectorAll('.note'));
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      notes.forEach(function (n) {
        n.hidden = !(cat === 'all' || n.getAttribute('data-cat') === cat);
        if (!n.hidden) n.classList.add('visible');
      });
    });
  });

  // ---------- Skills selector ----------
  var wrap = document.getElementById('skillsWrap');
  var dial = document.getElementById('dial');
  var groups = Array.prototype.slice.call(document.querySelectorAll('.skill-group'));
  var dialTitle = document.getElementById('dialTitle');
  var dialCount = document.getElementById('dialCount');
  var current = 0;
  var buttons = [];

  function selectGroup(i) {
    current = (i + groups.length) % groups.length;
    groups.forEach(function (g, idx) { g.classList.toggle('is-on', idx === current); });
    buttons.forEach(function (b, idx) {
      b.classList.toggle('is-on', idx === current);
      b.setAttribute('aria-pressed', String(idx === current));
    });
    var g = groups[current];
    if (dialTitle) dialTitle.textContent = g.querySelector('h3').textContent;
    if (dialCount) dialCount.textContent = (current + 1) + ' / ' + groups.length;
  }

  if (wrap && dial && groups.length) {
    groups.forEach(function (g, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dial-btn';
      b.style.setProperty('--i', i * (12 / groups.length));
      b.textContent = g.getAttribute('data-code');
      b.setAttribute('aria-label', g.querySelector('h3').textContent);
      b.addEventListener('click', function () { selectGroup(i); });
      dial.appendChild(b);
      buttons.push(b);
    });
    dial.removeAttribute('aria-hidden');
    wrap.classList.add('has-dial');
    document.getElementById('dialPrev').addEventListener('click', function () { selectGroup(current - 1); });
    document.getElementById('dialNext').addEventListener('click', function () { selectGroup(current + 1); });
    dial.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { selectGroup(current + 1); buttons[current].focus(); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { selectGroup(current - 1); buttons[current].focus(); e.preventDefault(); }
    });
    selectGroup(0);
  }

  // ---------- Reveal on scroll + active nav link ----------
  if (!('IntersectionObserver' in window)) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    var targets = document.querySelectorAll('.section-head, .case, .brief, .ai-card, .now-card, .readout, .note, .paper, .ideas, .tl-item, .cred-col, .method, .contact-card, .skills-wrap');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
