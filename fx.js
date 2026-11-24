/* Sotorko visual effects: 3D wireframe shield (canvas, no libraries) + card tilt. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 3D shield ----------
  var cv = document.getElementById('shield');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var outline = [[0, -1.05], [0.86, -0.76], [0.86, 0.02], [0.72, 0.5], [0.36, 0.86], [0, 1.1], [-0.36, 0.86], [-0.72, 0.5], [-0.86, 0.02], [-0.86, -0.76]];
    function densify(poly, n) {
      var out = [];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length];
        for (var k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      return out;
    }
    var ring = densify(outline, 8);
    var inner = ring.map(function (p) { return [p[0] * 0.8, p[1] * 0.8 + 0.02]; });
    var check = [[-0.36, 0.05], [-0.1, 0.34], [0.42, -0.3]];
    var D = 0.22; // half depth
    var parts = [];
    var rnd = Math.random;
    for (var i = 0; i < 70; i++) parts.push(spawn(true));
    function spawn(init) {
      var a = rnd() * Math.PI * 2, el = (rnd() - .5) * 1.2, r = init ? 1.7 + rnd() * 2.4 : 3.2 + rnd();
      return { a: a, el: el, r: r, v: .004 + rnd() * .012, s: .6 + rnd() * 1.4, hit: 0 };
    }
    var mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; });
    function resize() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize); resize();

    function rot(p, yaw, pitch) {
      var x = p[0], y = p[1], z = p[2];
      var cx = Math.cos(yaw), sx = Math.sin(yaw);
      var x1 = x * cx + z * sx, z1 = -x * sx + z * cx;
      var cy = Math.cos(pitch), sy = Math.sin(pitch);
      var y1 = y * cy - z1 * sy, z2 = y * sy + z1 * cy;
      return [x1, y1, z2];
    }
    function proj(p, scale) {
      var f = 4.2, k = f / (f + p[2]);
      return [W / 2 + p[0] * scale * k, H / 2 + p[1] * scale * k, k];
    }
    function line(pts, close, color, width, glow) {
      ctx.beginPath();
      pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
      if (close) ctx.closePath();
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.shadowColor = color; ctx.shadowBlur = glow; ctx.stroke();
    }
    var t0 = performance.now();
    function frame(now) {
      var t = (now - t0) / 1000;
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      ctx.clearRect(0, 0, W, H);
      var scale = Math.min(W, H) * 0.3;
      var yaw = Math.sin(t * .6) * .55 + mx * .7, pitch = my * .35 - .08;
      var front = ring.map(function (p) { return proj(rot([p[0], p[1], -D], yaw, pitch), scale); });
      var back = ring.map(function (p) { return proj(rot([p[0], p[1], D], yaw, pitch), scale); });
      var inn = inner.map(function (p) { return proj(rot([p[0], p[1], -D - .04], yaw, pitch), scale); });

      // back particles (behind shield)
      drawParticles(t, yaw, pitch, scale, false);

      // translucent body
      ctx.shadowBlur = 0;
      ctx.beginPath(); front.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath();
      var g = ctx.createLinearGradient(0, H * .2, 0, H * .85); g.addColorStop(0, 'rgba(52,211,153,.20)'); g.addColorStop(1, 'rgba(34,211,238,.05)');
      ctx.fillStyle = g; ctx.fill();

      line(back, true, 'rgba(34,211,238,.45)', 1.2, 8);
      for (var i = 0; i < ring.length; i += 4) { line([back[i], front[i]], false, 'rgba(94,234,177,.35)', 1, 4); }
      line(front, true, 'rgba(110,231,183,1)', 2.4, 18);
      line(inn, true, 'rgba(34,211,238,.55)', 1.2, 10);
      // cross lines
      for (var j = 0; j < inn.length; j += 8) line([inn[j], front[(j + 4) % front.length]], false, 'rgba(94,234,177,.12)', 1, 0);

      // check mark (pulsing)
      var pulse = .75 + .25 * Math.sin(t * 3);
      var ck = check.map(function (p) { return proj(rot([p[0], p[1], -D - .08], yaw, pitch), scale); });
      line(ck, false, 'rgba(236,255,247,' + pulse + ')', 7, 26);

      // sweeping scan ring
      var sy = ((t * .5) % 1) * 2.2 - 1.1;
      var sw = [];
      for (var a = 0; a < 40; a++) { var an = a / 40 * Math.PI * 2; sw.push(proj(rot([Math.cos(an) * 1.15, sy, Math.sin(an) * .6], yaw, pitch), scale)); }
      line(sw, true, 'rgba(34,211,238,.28)', 1.4, 12);

      drawParticles(t, yaw, pitch, scale, true);
      if (!reduce) requestAnimationFrame(frame);
    }
    function drawParticles(t, yaw, pitch, scale, frontPass) {
      parts.forEach(function (p, idx) {
        if (frontPass === false) { // advance once per frame in back pass
          p.a += p.v; p.r -= .006 * p.s; if (p.hit > 0) p.hit -= .04;
          if (p.r < 1.35) { p.hit = 1; if (p.r < 1.2) { Object.assign(p, spawn(false)); } }
        }
        var x = Math.cos(p.a) * p.r, z = Math.sin(p.a) * p.r, y = p.el * p.r * .8;
        var q = rot([x, y, z], yaw, pitch), isFront = q[2] < 0;
        if (isFront !== frontPass) return;
        var s = proj(q, scale), hit = p.hit > 0;
        ctx.beginPath(); ctx.arc(s[0], s[1], (hit ? 3.4 : 1.8) * s[2] * dprSize(), 0, 7);
        ctx.fillStyle = hit ? 'rgba(52,211,153,1)' : 'rgba(251,77,109,.9)';
        ctx.shadowColor = hit ? '#34d399' : '#fb4d6d'; ctx.shadowBlur = hit ? 22 : 10; ctx.fill();
      });
    }
    function dprSize() { return 1.1; }
    if (reduce) { frame(performance.now()); } else requestAnimationFrame(frame);
  }

  // ---------- tilt cards ----------
  if (matchMedia && matchMedia('(hover:hover)').matches && !reduce) {
    document.addEventListener('mousemove', function (e) {
      var el = e.target.closest && e.target.closest('.tilt');
      document.querySelectorAll('.tilt.on').forEach(function (n) { if (n !== el) { n.classList.remove('on'); n.style.transform = ''; } });
      if (!el || el.matches('textarea')) return;
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      var max = r.height > 260 ? 1.2 : 5;
      el.classList.add('on');
      el.style.transform = 'perspective(900px) rotateY(' + (px * max).toFixed(2) + 'deg) rotateX(' + (-py * max).toFixed(2) + 'deg) translateZ(0)';
    });
    document.addEventListener('mouseleave', function () { document.querySelectorAll('.tilt.on').forEach(function (n) { n.style.transform = ''; }); });
  }
})();
