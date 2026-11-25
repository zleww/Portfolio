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

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

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

  /* ---------- player video (only once a clip is added) ---------- */

  var stage = document.getElementById('stage');
  var video = document.getElementById('player-video');
  var hasClip = video && video.querySelector('source');
  var videoWanted = false;

  function playVideo() {
    if (!hasClip || !videoWanted || !motionOn()) return;
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () {});
  }

  if (hasClip && stage) {
    video.addEventListener('loadeddata', function () {
      stage.classList.add('has-video');
    });

    // preload="none", so nothing downloads until the stage is near the screen
    var videoWatch = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      videoWatch.disconnect();
      videoWanted = true;
      if (motionOn()) playVideo();
      else {
        video.preload = 'metadata';
        video.load();
      }
    }, { rootMargin: '200px' });
    videoWatch.observe(stage);
  }

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

  /* ---------- projects (data is in projects.js) ---------- */

  var projects = window.PROJECTS || [];

  var imageIcon = '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>';

  function plural(n, word) {
    return n + ' ' + word + (n === 1 ? '' : 's');
  }

  // one project = one case study: picture on one side, the story on the other
  function buildCase(p) {
    var item = el('article', 'case');
    item.setAttribute('data-reveal', '');

    // an image can be a path, or { src, alt } when it needs its own description
    var images = (p.images || (p.image ? [p.image] : [])).map(function (img) {
      return typeof img === 'string' ? { src: img, alt: p.imageAlt || p.title } : img;
    });

    var visual = el('div', 'case__visual');
    var media = el('div', 'case__media');
    var frame = el('div', 'case__frame');
    var mainImg = null;

    if (images.length) {
      mainImg = el('img');
      mainImg.src = images[0].src;
      mainImg.alt = images[0].alt;
      mainImg.loading = 'lazy';
      mainImg.decoding = 'async';
      frame.appendChild(mainImg);
    } else {
      // placeholder until I add real pictures
      var ph = el('div', 'case__ph');
      var icon = hidden(el('span', 'case__ph-icon'));
      icon.innerHTML = imageIcon;
      ph.appendChild(icon);
      ph.appendChild(el('span', 'case__ph-label', 'Project image'));
      ph.appendChild(el('span', 'case__ph-text', 'Coming soon'));
      frame.appendChild(ph);
    }
    media.appendChild(frame);
    media.appendChild(el('span', 'case__status' + (/^(Live|Finished)/.test(p.status) ? ' is-live' : ''), p.status));
    visual.appendChild(media);

    // small pictures under the big one. click one to show it big
    var thumbs = el('div', 'case__thumbs');
    if (images.length > 1) {
      images.forEach(function (img, n) {
        var t = el('button', 'case__thumb' + (n === 0 ? ' is-active' : ''));
        t.type = 'button';
        t.setAttribute('aria-label', 'Show image ' + (n + 1) + ' of ' + p.title);
        var small = el('img');
        small.src = img.src;
        small.alt = '';
        small.loading = 'lazy';
        t.appendChild(small);
        t.addEventListener('click', function () {
          mainImg.src = img.src;
          mainImg.alt = img.alt;
          var all = thumbs.querySelectorAll('.case__thumb');
          for (var a = 0; a < all.length; a++) all[a].classList.toggle('is-active', all[a] === t);
        });
        thumbs.appendChild(t);
      });
    } else if (!images.length) {
      for (var e = 0; e < 3; e++) {
        var empty = hidden(el('span', 'case__thumb case__thumb--empty'));
        empty.innerHTML = imageIcon;
        thumbs.appendChild(empty);
      }
    }
    for (var th = 0; th < thumbs.children.length; th++) thumbs.children[th].style.setProperty('--i', th);
    thumbs.style.setProperty('--n', Math.min(4, thumbs.children.length) || 3);
    if (thumbs.children.length) visual.appendChild(thumbs);

    var body = el('div', 'case__body');
    body.appendChild(el('p', 'case__num', ['#' + p.number, p.kind, p.status].filter(Boolean).join(' · ')));
    body.appendChild(el('h3', 'case__title', p.title));
    if (p.summary) body.appendChild(el('p', 'case__summary', p.summary));
    if (p.note) body.appendChild(el('p', 'case__note', p.note));

    var rows = el('dl', 'case__rows');
    function row(label, text) {
      if (!text) return;
      var box = el('div');
      box.appendChild(el('dt', '', label));
      box.appendChild(el('dd', '', text));
      rows.appendChild(box);
    }
    row('The problem', p.problem);
    row(p.solution ? 'The solution' : 'The plan', p.solution || p.plan);
    row('My role', p.role);
    // any extra rows, like { label: 'Security', text: '...' }
    (p.rows || []).forEach(function (r) { row(r.label, r.text); });
    if (rows.children.length) body.appendChild(rows);

    if (p.stack && p.stack.length) {
      var chips = el('ul', 'chips');
      for (var s = 0; s < p.stack.length; s++) chips.appendChild(el('li', '', p.stack[s]));
      body.appendChild(chips);
    }

    if (p.links && p.links.length) {
      var links = el('div', 'case__links');
      for (var k = 0; k < p.links.length; k++) {
        var a = el('a', 'btn btn--ghost');
        a.href = p.links[k].url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.appendChild(el('span', 'btn__label', p.links[k].label));
        links.appendChild(a);
      }
      body.appendChild(links);
    }

    // so the lines come in one after another
    for (var b = 0; b < body.children.length; b++) body.children[b].style.setProperty('--i', b);

    item.appendChild(visual);
    item.appendChild(body);
    return item;
  }

  function fillCases(box, list) {
    if (!box) return;
    if (!list.length) {
      box.appendChild(el('p', 'empty-note', 'Projects are on the way.'));
      return;
    }
    for (var n = 0; n < list.length; n++) box.appendChild(buildCase(list[n]));
  }

  // home page: the starters (featured ones, max 5)
  var starters = projects.filter(function (p) { return p.featured; });
  if (!starters.length) starters = projects;
  fillCases(document.getElementById('cards'), starters.slice(0, 5));

  // roster page: everyone
  fillCases(document.getElementById('roster'), projects);

  var rosterTotal = document.getElementById('roster-total');
  if (rosterTotal && projects.length) {
    rosterTotal.textContent = plural(projects.length, 'project') + ' on the roster, from planning to live.';
  }

  var rosterCount = document.getElementById('roster-count');
  if (rosterCount) rosterCount.textContent = plural(projects.length, 'project') + ', from planning to live.';

  /* ---------- certificates (data is in certificates.js) ---------- */

  var certsBox = document.getElementById('certs');
  var certs = window.CERTIFICATES || [];

  var trophyIcon = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v6a4 4 0 0 1-8 0V4zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 14v4M8 20h8"/></svg>';

  function buildCert(c) {
    var card = el('article', 'cert');
    card.setAttribute('data-reveal', '');
    var pic = el('div', 'cert__img');
    if (c.image) {
      var img = el('img');
      img.src = c.image;
      img.alt = c.title + ' certificate';
      img.loading = 'lazy';
      pic.appendChild(img);
    } else {
      pic.innerHTML = trophyIcon;
    }
    var body = el('div', 'cert__body');
    body.appendChild(el('h3', 'cert__title', c.title));
    var meta = [c.issuer, c.date].filter(Boolean).join(' · ');
    if (meta) body.appendChild(el('p', 'cert__meta', meta));
    if (c.link) {
      var a = el('a', 'cert__link', 'View certificate');
      a.href = c.link;
      a.target = '_blank';
      a.rel = 'noopener';
      body.appendChild(a);
    }
    card.appendChild(pic);
    card.appendChild(body);
    return card;
  }

  if (certsBox) {
    if (certs.length) {
      for (var c = 0; c < certs.length; c++) certsBox.appendChild(buildCert(certs[c]));
    } else {
      // empty trophy slots until I add mine
      for (var e = 0; e < 3; e++) {
        var slot = buildCert({ title: 'Trophy slot', issuer: 'Certificate coming soon' });
        slot.classList.add('cert--empty');
        certsBox.appendChild(slot);
      }
    }
    for (var d = 0; d < certsBox.children.length; d++) {
      certsBox.children[d].style.setProperty('--d', (d * 90) + 'ms');
    }
  }

  /* ---------- text effects ---------- */

  // titles: wrap every word so it can slide up out of a mask
  var splits = document.querySelectorAll('.split');
  for (var t = 0; t < splits.length; t++) {
    var words = splits[t].textContent.trim().split(/\s+/);
    splits[t].setAttribute('aria-label', words.join(' '));
    splits[t].textContent = '';
    for (var w = 0; w < words.length; w++) {
      var mask = hidden(el('span', 'w'));
      var inner = el('span', '', words[w]);
      inner.style.setProperty('--i', w);
      mask.appendChild(inner);
      splits[t].appendChild(mask);
      if (w < words.length - 1) splits[t].appendChild(document.createTextNode(' '));
    }
  }

  // statement: every word gets its own span so it can light up on scroll
  var litBlocks = [];
  var lits = document.querySelectorAll('.lit');
  for (var l = 0; l < lits.length; l++) {
    var hl = (lits[l].getAttribute('data-hl') || '').toLowerCase().split(' ');
    var parts = lits[l].textContent.trim().split(/\s+/);
    lits[l].textContent = '';
    var spans = [];
    for (var q = 0; q < parts.length; q++) {
      var word = el('span', 'lw', parts[q]);
      if (hl.indexOf(parts[q].toLowerCase().replace(/[^a-z-]/g, '')) > -1) word.classList.add('hl');
      lits[l].appendChild(word);
      lits[l].appendChild(document.createTextNode(' '));
      spans.push(word);
    }
    litBlocks.push({ box: lits[l], words: spans, shown: -1 });
  }

  // skill chips pop in one by one
  var chipLists = document.querySelectorAll('.stack__card .chips');
  for (var cl = 0; cl < chipLists.length; cl++) {
    for (var ci = 0; ci < chipLists[cl].children.length; ci++) {
      chipLists[cl].children[ci].style.setProperty('--i', ci);
    }
  }

  /* ---------- scroll reveal ---------- */

  function revealOnScroll(items, options) {
    var j;

    if (!('IntersectionObserver' in window)) {
      for (j = 0; j < items.length; j++) items[j].classList.add('is-in');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add('is-in');
          observer.unobserve(entries[k].target);
        }
      }
    }, options);

    for (j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  function startReveal() {
    revealOnScroll(document.querySelectorAll('[data-reveal]'),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    // sections can be taller than the screen, so no threshold here
    revealOnScroll(document.querySelectorAll('main > section'),
      { rootMargin: '0px 0px -10% 0px' });
  }

  /* ---------- sideways row (off the court) ---------- */

  var hs = document.getElementById('hscroll');
  var hsTrack = document.getElementById('hscroll-track');
  var hsMax = 0;

  // pinned only on wide screens with motion on. phones just swipe the row
  function setupHScroll() {
    if (!hs || !hsTrack) return;
    var pin = motionOn() && window.innerWidth >= 900;
    hs.classList.toggle('is-pinned', pin);
    if (pin) {
      var last = hsTrack.lastElementChild;
      var padLeft = parseFloat(getComputedStyle(hsTrack).paddingLeft) || 0;
      hsMax = Math.max(0, last.offsetLeft + last.offsetWidth + padLeft - window.innerWidth);
      hs.style.height = (hsMax + window.innerHeight) + 'px';
    } else {
      hsMax = 0;
      hs.style.height = '';
      hsTrack.style.transform = '';
    }
  }

  /* ---------- marquee bands ---------- */

  var marquees = [];
  var bands = document.querySelectorAll('.marquee');
  for (var m = 0; m < bands.length; m++) {
    var track = bands[m].querySelector('.marquee__track');
    var group = bands[m].querySelector('.marquee__group');
    if (!track || !group) continue;
    // copies so the band never runs out on wide screens
    var copies = Math.max(2, Math.ceil((window.innerWidth * 2) / (group.offsetWidth || 1)));
    for (var g = 1; g < copies; g++) track.appendChild(group.cloneNode(true));
    marquees.push({
      track: track,
      width: group.offsetWidth,
      dir: parseFloat(bands[m].getAttribute('data-dir')) || 1,
      x: 0
    });
  }

  /* ---------- scroll motion (one loop for everything) ---------- */

  var progressBar = document.querySelector('.progress span');
  var heroCopy = document.querySelector('.hero__copy');
  var stagePhoto = document.querySelector('.stage__photo');
  var ghosts = document.querySelectorAll('[data-parallax]');
  var services = document.querySelectorAll('.service');
  var frames = document.querySelectorAll('.case__frame');

  var lastY = window.scrollY;
  var velocity = 0;
  var loopId = 0;

  function updateProgress() {
    if (!progressBar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  }

  function tick() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var i;

    velocity = velocity * 0.85 + (y - lastY) * 0.15;
    lastY = y;

    // hero text drifts up and fades as you leave it, photo zooms a little
    var h = clamp(y / vh, 0, 1);
    if (heroCopy) {
      heroCopy.style.transform = 'translateY(' + (-h * 90) + 'px)';
      heroCopy.style.opacity = 1 - h * 0.9;
    }
    if (stagePhoto) stagePhoto.style.transform = 'scale(' + (1 + h * 0.12) + ')';

    // big section numbers move slower than the page
    for (i = 0; i < ghosts.length; i++) {
      var sec = ghosts[i].parentNode.getBoundingClientRect();
      if (sec.bottom < 0 || sec.top > vh) continue;
      var speed = parseFloat(ghosts[i].getAttribute('data-parallax')) || 0.15;
      ghosts[i].style.transform = 'translateY(' + ((sec.top - vh / 2) * -speed) + 'px)';
    }

    // project pictures drift inside their frame
    for (i = 0; i < frames.length; i++) {
      var box = frames[i].parentNode.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) continue;
      var off = (box.top + box.height / 2 - vh / 2) / vh;
      frames[i].style.transform = 'translateY(' + (off * -2.5) + '%)';
    }

    // statement lights up word by word
    for (i = 0; i < litBlocks.length; i++) {
      var lb = litBlocks[i];
      var r = lb.box.getBoundingClientRect();
      var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      var count = Math.round(p * lb.words.length);
      if (count !== lb.shown) {
        for (var wi = 0; wi < lb.words.length; wi++) lb.words[wi].classList.toggle('on', wi < count);
        lb.shown = count;
      }
    }

    // service cards shrink and dim as the next one slides over
    for (i = 0; i < services.length - 1; i++) {
      var cr = services[i].getBoundingClientRect();
      var nr = services[i + 1].getBoundingClientRect();
      var cover = clamp((vh - nr.top) / Math.max(1, vh - cr.top), 0, 1);
      services[i].style.setProperty('--s', 1 - cover * 0.06);
      services[i].style.setProperty('--dim', cover * 0.45);
    }

    // sideways row
    if (hsMax) {
      var hr = hs.getBoundingClientRect();
      var hp = clamp(-hr.top / Math.max(1, hs.offsetHeight - vh), 0, 1);
      hsTrack.style.transform = 'translateX(' + (-hp * hsMax) + 'px)';
    }

    // marquees: always moving, faster and tilted while you scroll
    var skew = clamp(velocity * -0.25, -10, 10);
    for (i = 0; i < marquees.length; i++) {
      var mq = marquees[i];
      mq.x -= (0.6 + Math.abs(velocity) * 0.12) * mq.dir;
      if (mq.x <= -mq.width) mq.x += mq.width;
      if (mq.x > 0) mq.x -= mq.width;
      mq.track.style.transform = 'translateX(' + mq.x + 'px) skewX(' + skew + 'deg)';
    }

    loopId = requestAnimationFrame(tick);
  }

  function clearMotion() {
    var i;
    if (heroCopy) {
      heroCopy.style.transform = '';
      heroCopy.style.opacity = '';
    }
    if (stagePhoto) stagePhoto.style.transform = '';
    for (i = 0; i < ghosts.length; i++) ghosts[i].style.transform = '';
    for (i = 0; i < frames.length; i++) frames[i].style.transform = '';
    for (i = 0; i < services.length; i++) {
      services[i].style.removeProperty('--s');
      services[i].style.removeProperty('--dim');
    }
    for (i = 0; i < marquees.length; i++) marquees[i].track.style.transform = '';
    for (i = 0; i < litBlocks.length; i++) litBlocks[i].shown = -1;
  }

  function startMotion() {
    if (loopId) return;
    lastY = window.scrollY;
    loopId = requestAnimationFrame(tick);
  }

  function stopMotion() {
    cancelAnimationFrame(loopId);
    loopId = 0;
    clearMotion();
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', function () {
    setupHScroll();
    updateProgress();
  });

  /* ---------- pause / play motion ---------- */

  var motionBtn = document.getElementById('motion-toggle');

  function setMotion(on) {
    root.setAttribute('data-motion', on ? 'on' : 'off');
    if (motionBtn) motionBtn.setAttribute('aria-checked', on ? 'true' : 'false');
    if (window.Threads) window.Threads.setRunning(on);
    if (hasClip) {
      if (on) playVideo();
      else video.pause();
    }
    setupHScroll();
    if (on) startMotion();
    else stopMotion();
  }

  if (motionBtn) {
    motionBtn.addEventListener('click', function () {
      var on = !motionOn();
      setMotion(on);
      save('motion', on ? 'on' : 'off');
    });
  }

  setMotion(motionOn());
  updateProgress();

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

  /* ---------- contact ---------- */

  var copyBtn = document.getElementById('copy-email');
  var copyStatus = document.getElementById('copy-status');

  function copied() {
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('is-done');
    if (copyStatus) copyStatus.textContent = 'Email address copied';
    setTimeout(function () {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('is-done');
    }, 2000);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(copied, function () {});
        return;
      }
      // older browsers: copy from a hidden textarea
      var area = el('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        if (document.execCommand('copy')) copied();
      } catch (err) {}
      document.body.removeChild(area);
    });
  }

  // no backend, so the form opens the visitor's email app with everything filled in
  var form = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.elements.name.value.trim();
      var need = form.elements.need.value;
      var message = form.elements.message.value.trim();
      var subject = 'Portfolio: ' + need + ' (from ' + name + ')';
      var body = message + '\n\n- ' + name;
      window.location.href = 'mailto:dellosaezekiel1@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      if (formStatus) formStatus.textContent = 'Opening your email app. If nothing opens, email me at dellosaezekiel1@gmail.com.';
    });
  }

  /* ---------- footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
