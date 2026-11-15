(function () {
  var root = document.documentElement;

  function save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function motionOn() {
    return root.getAttribute('data-motion') !== 'off';
  }

  /* ---------- colorway ---------- */

  var swatches = document.querySelectorAll('[data-colorway-btn]');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function setColorway(name) {
    root.setAttribute('data-colorway', name);
    for (var i = 0; i < swatches.length; i++) {
      var match = swatches[i].getAttribute('data-colorway-btn') === name;
      swatches[i].setAttribute('aria-pressed', match ? 'true' : 'false');
    }
    if (themeMeta) {
      themeMeta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
    }
    if (window.Threads) window.Threads.refresh();
  }

  for (var i = 0; i < swatches.length; i++) {
    swatches[i].addEventListener('click', function () {
      var name = this.getAttribute('data-colorway-btn');
      setColorway(name);
      save('colorway', name);
    });
  }

  setColorway(root.getAttribute('data-colorway') || 'crimson');

  /* ---------- player video ---------- */

  var stage = document.getElementById('stage');
  var video = document.getElementById('player-video');

  var videoWanted = false; // true once the stage has been on screen

  function playVideo() {
    if (!video || !videoWanted || !motionOn()) return;
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () {});
  }

  // the video has preload="none", so nothing downloads until this runs
  function loadVideo() {
    if (videoWanted) return;
    videoWanted = true;

    if (!motionOn()) {
      // no autoplay, just get the first frame
      video.preload = 'metadata';
      video.load();
    } else {
      playVideo();
    }
  }

  if (video && stage) {
    video.addEventListener('loadeddata', function () {
      stage.classList.add('has-video');
    });

    if ('IntersectionObserver' in window) {
      var videoWatch = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          loadVideo();
          videoWatch.disconnect();
        }
      }, { rootMargin: '200px' });
      videoWatch.observe(stage);
    } else {
      loadVideo();
    }
  }

  /* ---------- pause / play motion ---------- */

  var motionBtn = document.getElementById('motion-toggle');

  function setMotion(on) {
    root.setAttribute('data-motion', on ? 'on' : 'off');
    if (motionBtn) motionBtn.setAttribute('aria-checked', on ? 'true' : 'false');
    if (window.Threads) window.Threads.setRunning(on);
    if (video) {
      if (on) playVideo();
      else video.pause();
    }
  }

  if (motionBtn) {
    motionBtn.addEventListener('click', function () {
      var on = !motionOn();
      setMotion(on);
      save('motion', on ? 'on' : 'off');
    });
  }

  setMotion(motionOn());

  /* ---------- settings popover ---------- */

  var settings = document.getElementById('settings');
  var settingsBtn = document.getElementById('settings-toggle');
  var settingsPanel = document.getElementById('settings-panel');

  function setSettingsOpen(open) {
    settingsPanel.hidden = !open;
    settingsBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (settings && settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', function () {
      setSettingsOpen(settingsPanel.hidden);
    });

    // click anywhere else closes it
    document.addEventListener('click', function (e) {
      if (!settings.contains(e.target)) setSettingsOpen(false);
    });

    // Esc closes it and puts focus back on the button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !settingsPanel.hidden) {
        setSettingsOpen(false);
        settingsBtn.focus();
      }
    });

    // tabbing out of the popover closes it too
    settings.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !settings.contains(e.relatedTarget)) setSettingsOpen(false);
    });
  }

  /* ---------- phone menu ---------- */

  var header = document.querySelector('.site-header');
  var navBtn = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  function setNavOpen(open) {
    header.classList.toggle('nav-open', open);
    navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (header && navBtn && nav) {
    navBtn.addEventListener('click', function () {
      setNavOpen(!header.classList.contains('nav-open'));
    });

    // picking a link or clicking anywhere else closes the menu
    document.addEventListener('click', function (e) {
      if (!navBtn.contains(e.target)) setNavOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        setNavOpen(false);
        navBtn.focus();
      }
    });
  }

  /* ---------- project cards (data is in projects.js) ---------- */

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function hidden(node) {
    node.setAttribute('aria-hidden', 'true');
    return node;
  }

  function stat(label, text) {
    var box = el('span', 'stat');
    box.appendChild(el('span', 'stat__label', label));
    box.appendChild(el('span', 'stat__text', text));
    return box;
  }

  // empty roster spot
  function buildBench(p) {
    var slot = el('div', 'slot');
    slot.appendChild(hidden(el('span', 'slot__num', p.number)));
    slot.appendChild(el('span', 'slot__label', '#' + p.number));
    slot.appendChild(el('span', 'slot__name', 'On the bench'));
    slot.appendChild(el('span', 'slot__text', p.note));
    return slot;
  }

  // flip card: front = name and status, back = stat sheet
  function buildCard(p) {
    var card = el('div', 'card');
    var btn = el('button', 'flip');
    var inner = el('span', 'flip__inner');
    var front = el('span', 'flip__face flip__front');
    var back = el('span', 'flip__face flip__back');

    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', p.title + ', ' + p.status.toLowerCase() + '. Flip card to read the stats');

    var top = el('span', 'flip__top');
    top.appendChild(el('span', 'hi', 'Rookie card'));
    top.appendChild(el('span', '', '#' + p.number));

    var shot = el('span', 'flip__shot');
    shot.appendChild(hidden(el('span', 'flip__shot-num', p.number)));

    var info = el('span', 'flip__info');
    info.appendChild(el('span', 'flip__name', p.title));
    info.appendChild(el('span', 'flip__meta', p.status + ' · Tap to flip'));

    front.appendChild(top);
    front.appendChild(shot);
    front.appendChild(info);

    back.appendChild(el('span', 'flip__back-title', 'Stat sheet'));
    if (p.problem) back.appendChild(stat('The problem', p.problem));
    if (p.plan) back.appendChild(stat('The plan', p.plan));
    if (p.solution) back.appendChild(stat('The play', p.solution));
    if (p.stack && p.stack.length) back.appendChild(stat('Stack', p.stack.join(' · ')));
    back.appendChild(stat('Status', p.status));
    back.appendChild(el('span', 'flip__meta', 'Tap to flip back'));

    inner.appendChild(front);
    inner.appendChild(back);
    btn.appendChild(inner);
    card.appendChild(btn);

    btn.addEventListener('click', function () {
      var flipped = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', flipped ? 'false' : 'true');
    });

    // links can't sit inside a button, so they go under the card
    if (p.links && p.links.length) {
      var links = el('div', 'card__links');
      for (var i = 0; i < p.links.length; i++) {
        var a = el('a', '', p.links[i].label);
        a.href = p.links[i].url;
        a.target = '_blank';
        a.rel = 'noopener';
        links.appendChild(a);
      }
      card.appendChild(links);
    }

    return card;
  }

  var cardsBox = document.getElementById('cards');
  var projects = window.PROJECTS || [];

  if (cardsBox) {
    for (var n = 0; n < projects.length; n++) {
      var p = projects[n];
      var node = p.status === 'On the bench' ? buildBench(p) : buildCard(p);

      // first card slides in from the left, last from the right
      var side = '';
      if (n === 0) {
        side = 'left';
        node.classList.add('is-featured');
      }
      else if (n === projects.length - 1) side = 'right';
      node.setAttribute('data-reveal', side);
      node.style.setProperty('--d', (n * 80) + 'ms');

      cardsBox.appendChild(node);
    }
  }

  /* ---------- scroll reveal ---------- */

  function revealOnScroll(items, options) {
    var i;

    if (!('IntersectionObserver' in window)) {
      for (i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add('is-in');
          observer.unobserve(entries[j].target);
        }
      }
    }, options);

    for (i = 0; i < items.length; i++) observer.observe(items[i]);
  }

  function startReveal() {
    revealOnScroll(document.querySelectorAll('[data-reveal]'),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    // sections can be taller than the screen, so no threshold here
    revealOnScroll(document.querySelectorAll('main > section'),
      { rootMargin: '0px 0px -10% 0px' });
  }

  /* ---------- opening ---------- */

  var intro = document.getElementById('intro');
  var introDone = false;

  function endIntro(instant) {
    if (introDone) return;
    introDone = true;

    if (!intro || instant) {
      if (intro) intro.classList.add('is-gone');
      startReveal();
      return;
    }

    intro.classList.add('is-leaving');
    setTimeout(startReveal, 250);
    setTimeout(function () {
      intro.classList.add('is-gone');
    }, 850);
  }

  if (!intro || !motionOn()) {
    endIntro(true);
  } else {
    setTimeout(function () { endIntro(false); }, 1700);
    intro.addEventListener('click', function () { endIntro(false); });
    window.addEventListener('keydown', function () { endIntro(false); }, { once: true });
  }

  /* ---------- footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
