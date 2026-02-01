(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function rafLoop(draw) {
    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      draw();
    };
    tick();
    return () => cancelAnimationFrame(rafId);
  }

  function initIframeModal() {
    const modal = $("#iframeModal");
    if (!modal) return;

    const open = () => modal.classList.remove("hidden");
    const close = () => modal.classList.add("hidden");

    window.openIframe = open;
    window.closeIframe = close;

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function initObservers() {
    const observed = $$(".observe");
    if (!observed.length) return;

    if (!("IntersectionObserver" in window)) {
      observed.forEach((el) => el.classList.add("animate"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("animate");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    observed.forEach((el) => io.observe(el));
  }

  function initMatrixCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const letters = "01⎋⌘⚠$@#%&≡░▓█";
    const fontSize = 18;

    let columns = 0;
    let drops = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.floor(window.innerWidth / fontSize);
      drops = Array(columns).fill(1);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    rafLoop(() => {
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#ffa600";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[(Math.random() * letters.length) | 0];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.96) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    });
  }

  function initCrtNoise(canvasId, alpha = 18) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      const w = canvas.offsetWidth || canvas.clientWidth || window.innerWidth;
      const h = canvas.offsetHeight || canvas.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    rafLoop(() => {
      const w = canvas.width;
      const h = canvas.height;
      const img = ctx.createImageData(w, h);

      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = alpha;
      }

      ctx.putImageData(img, 0, 0);
    });
  }

  function initAfterPracticumBg(canvasId, sectionId) {
    const canvas = document.getElementById(canvasId);
    const section = document.getElementById(sectionId);
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let dpr = 1;

    const rand = (a, b) => a + Math.random() * (b - a);

    const state = {
      dots: [],
      glowPulse: 0
    };

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = section.getBoundingClientRect();

      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      state.dots = Array.from({ length: state.dotCount }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-state.speed, state.speed),
        vy: rand(-state.speed, state.speed),
        r: rand(1.0, 2.4),
      }));
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => resize());
      ro.observe(section);
    }

    rafLoop(() => {
      ctx.clearRect(0, 0, w, h);

      state.glowPulse += 0.01;
      const glow = 0.08 + Math.sin(state.glowPulse) * 0.02;

      ctx.fillStyle = `rgba(255, 166, 0, ${glow})`;
      ctx.beginPath();
      ctx.ellipse(w * 0.25, h * 0.35, w * 0.22, h * 0.18, 0.2, 0, Math.PI * 2);
      ctx.ellipse(w * 0.75, h * 0.55, w * 0.26, h * 0.20, -0.2, 0, Math.PI * 2);
      ctx.fill();

      for (const p of state.dots) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= w) p.vx *= -1;
        if (p.y <= 0 || p.y >= h) p.vy *= -1;

        ctx.fillStyle = "rgba(255,166,0,0.75)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < state.dots.length; i++) {
        const a = state.dots[i];
        for (let j = i + 1; j < state.dots.length; j++) {
          const b = state.dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist > state.maxLinkDist) continue;

          const alpha = 0.22 * (1 - dist / state.maxLinkDist);
          ctx.strokeStyle = `rgba(255,166,0,${alpha})`;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    });
  }

  onReady(() => {
    initIframeModal();
    initObservers();

    initMatrixCanvas("matrix-bg-osint");
    initCrtNoise("crt-noise-author", 18);
    initCrtNoise("crt-noise-forwhom", 18);

    initAfterPracticumBg("after-practicum-bg", "after-practicum");
  });
})();

