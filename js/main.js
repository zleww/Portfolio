(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function playVideo() {
    if (!video || reduced || !motionOn()) return;
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () {});
  }

  if (video && stage) {
    var showVideo = function () {
      stage.classList.add('has-video');
      playVideo();
    };
    if (video.readyState >= 2) showVideo();
    else video.addEventListener('loadeddata', showVideo);
  }

  /* ---------- pause / play motion ---------- */

  var motionBtn = document.getElementById('motion-toggle');

  function setMotion(on) {
    root.setAttribute('data-motion', on ? 'on' : 'off');
    if (motionBtn) {
      motionBtn.setAttribute('aria-pressed', on ? 'false' : 'true');
      motionBtn.setAttribute('aria-label', on ? 'Pause motion' : 'Play motion');
    }
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

  /* ---------- scroll reveal ---------- */

  function startReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    var i;

    if (!('IntersectionObserver' in window) || reduced) {
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
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    for (i = 0; i < items.length; i++) observer.observe(items[i]);
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

  if (!intro || reduced || !motionOn()) {
    endIntro(true);
  } else {
    setTimeout(function () { endIntro(false); }, 1700);
    intro.addEventListener('click', function () { endIntro(false); });
    window.addEventListener('keydown', function () { endIntro(false); }, { once: true });
  }

  /* ---------- project card ---------- */

  var card = document.getElementById('flip-card');
  if (card) {
    card.addEventListener('click', function () {
      var flipped = card.getAttribute('aria-pressed') === 'true';
      card.setAttribute('aria-pressed', flipped ? 'false' : 'true');
    });
  }

  /* ---------- footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
