// Glowing threads background.
// A few sine waves that meet at one pinch point, light up near the
// cursor and send a pulse of light along the lines on click / tap.

(function () {
  var canvas = document.getElementById('threads');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var root = document.documentElement;

  var PINCH_X = 0.5;     // where the threads meet (0 - 1 across the screen)
  var STEP = 8;          // px between points on each line
  var PULSE_LIFE = 1.6;  // seconds

  var threads = [
    { amp: 0.34, freq: 1.0, phase: 0.0, speed: 0.22, width: 2.4, alpha: 1.0 },
    { amp: 0.22, freq: 1.6, phase: 1.3, speed: 0.17, width: 1.1, alpha: 0.6 },
    { amp: 0.16, freq: 0.7, phase: 2.6, speed: 0.26, width: 1.1, alpha: 0.6 },
    { amp: 0.27, freq: 1.3, phase: 3.9, speed: 0.14, width: 1.1, alpha: 0.5 },
    { amp: 0.11, freq: 2.1, phase: 5.2, speed: 0.19, width: 1.0, alpha: 0.55 },
    { amp: 0.07, freq: 0.5, phase: 0.8, speed: 0.30, width: 1.0, alpha: 0.5 }
  ];

  var w = 0;
  var h = 0;
  var time = 0;
  var last = 0;
  var frame = 0;
  var running = false;
  var color = '220, 20, 60';
  var core = '255, 214, 222';
  var pointer = { x: 0, y: 0, active: false };
  var pulses = [];

  function readColors() {
    var styles = getComputedStyle(root);
    color = styles.getPropertyValue('--thread').trim() || color;
    core = styles.getPropertyValue('--thread-core').trim() || core;
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function yAt(thread, index, x) {
    var u = x / w;
    var spread = Math.min(1, Math.pow(Math.abs(u - PINCH_X) * 2, 0.9));
    var breathe = 0.85 + 0.15 * Math.sin(time * 0.3 + index);
    var wave = Math.sin(thread.freq * Math.PI * 2 * u + thread.phase + time * thread.speed);
    var y = h * 0.5 + thread.amp * h * spread * breathe * wave;

    if (pointer.active) {
      var dx = x - pointer.x;
      var dy = pointer.y - y;
      var pull = Math.exp(-(dx * dx) / 51200) * Math.exp(-(dy * dy) / 96800);
      y += dy * 0.22 * pull;
    }
    return y;
  }

  function trace(thread, index) {
    ctx.beginPath();
    for (var x = -STEP; x <= w + STEP; x += STEP) {
      var y = yAt(thread, index, x);
      if (x === -STEP) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }

  function draw() {
    if (!w || !h) return;
    var i, thread;

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // glow at the pinch point
    var px = PINCH_X * w;
    var py = h * 0.5;
    var radius = Math.min(w, h) * 0.24;
    var pinch = ctx.createRadialGradient(px, py, 0, px, py, radius);
    pinch.addColorStop(0, 'rgba(' + color + ', 0.32)');
    pinch.addColorStop(1, 'rgba(' + color + ', 0)');
    ctx.fillStyle = pinch;
    ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);

    // the threads: two soft strokes for the glow, one thin bright core
    for (i = 0; i < threads.length; i++) {
      thread = threads[i];
      trace(thread, i);

      ctx.lineWidth = thread.width * 9;
      ctx.strokeStyle = 'rgba(' + color + ', ' + (0.05 * thread.alpha) + ')';
      ctx.stroke();

      ctx.lineWidth = thread.width * 3.5;
      ctx.strokeStyle = 'rgba(' + color + ', ' + (0.16 * thread.alpha) + ')';
      ctx.stroke();

      ctx.lineWidth = thread.width;
      ctx.strokeStyle = 'rgba(' + core + ', ' + (0.7 * thread.alpha) + ')';
      ctx.stroke();
    }

    // light under the cursor
    if (pointer.active) {
      var light = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 200);
      light.addColorStop(0, 'rgba(' + core + ', 0.95)');
      light.addColorStop(1, 'rgba(' + core + ', 0)');
      ctx.strokeStyle = light;
      for (i = 0; i < threads.length; i++) {
        trace(threads[i], i);
        ctx.lineWidth = threads[i].width * 2.4;
        ctx.stroke();
      }
    }

    // pulses travelling out from a click
    var now = performance.now();
    for (i = pulses.length - 1; i >= 0; i--) {
      var age = (now - pulses[i].born) / 1000;
      if (age > PULSE_LIFE) {
        pulses.splice(i, 1);
        continue;
      }
      var fade = 1 - age / PULSE_LIFE;
      var travel = age * Math.max(w, 600) * 0.5;

      for (var dir = -1; dir <= 1; dir += 2) {
        var cx = pulses[i].x + dir * travel;
        var beam = ctx.createLinearGradient(cx - 130, 0, cx + 130, 0);
        beam.addColorStop(0, 'rgba(' + core + ', 0)');
        beam.addColorStop(0.5, 'rgba(' + core + ', ' + fade + ')');
        beam.addColorStop(1, 'rgba(' + core + ', 0)');
        ctx.strokeStyle = beam;
        for (var j = 0; j < threads.length; j++) {
          trace(threads[j], j);
          ctx.lineWidth = threads[j].width * 2.6;
          ctx.stroke();
        }
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function loop(now) {
    if (!running) return;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    draw();
    frame = requestAnimationFrame(loop);
  }

  function start() {
    if (running || document.hidden) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  function motionAllowed() {
    return root.getAttribute('data-motion') !== 'off';
  }

  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    if (!running) draw();
  }, { passive: true });

  window.addEventListener('pointerdown', function (e) {
    if (!running) return;
    pulses.push({ x: e.clientX, born: performance.now() });
    if (pulses.length > 4) pulses.shift();
  }, { passive: true });

  function pointerGone() {
    pointer.active = false;
    if (!running) draw();
  }

  window.addEventListener('pointercancel', pointerGone);
  window.addEventListener('blur', pointerGone);
  document.addEventListener('mouseleave', pointerGone);
  window.addEventListener('pointerup', function (e) {
    if (e.pointerType !== 'mouse') pointerGone();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (motionAllowed()) start();
  });

  // used by main.js
  window.Threads = {
    setRunning: function (on) {
      if (on) start();
      else stop();
    },
    refresh: function () {
      readColors();
      if (!running) draw();
    }
  };

  readColors();
  resize();
  if (motionAllowed()) start();
})();
