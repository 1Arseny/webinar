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

  function typeLoop(lines, targetId, charDelay = 18, linePause = 520) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const cursorChar = "█";
    const cursor = () => cursorChar;

    let lineIdx = 0;
    let charIdx = 0;
    let stopped = false;
    let timeoutId = 0;

    const schedule = (fn, ms) => {
      timeoutId = window.setTimeout(fn, ms);
    };

    const tick = () => {
      if (stopped) return;

      if (lineIdx >= lines.length) {
        schedule(() => {
          el.textContent = "";
          lineIdx = 0;
          charIdx = 0;
          tick();
        }, 2000);
        return;
      }

      const current = lines[lineIdx] ?? "";

      if (charIdx < current.length) {
        el.textContent = el.textContent.replace(/\u2588/g, "") + current[charIdx] + cursor();
        charIdx++;
        schedule(tick, charDelay);
      } else {
        el.textContent = el.textContent.replace(/\u2588/g, "") + "\n";
        charIdx = 0;
        lineIdx++;
        schedule(tick, linePause + Math.random() * 240);
      }
    };

    tick();

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  }

  const waptLines = [
    "┌──────────────────────────────┬──────────────────────────────────────────────┐",
    "│ Маркетинг / ожидания         │ Практика WAPT (black-box)                    │",
    "├──────────────────────────────┼──────────────────────────────────────────────┤",
    "│ «Запусти сканер и готово»    │ Где сканер молчит — включается логика        │",
    "│ «Подбери payload по списку»  │ Анализ флоу, ролей, валидаций, бизнес-правил │",
    "│ «Это всё про XSS»            │ Серверные баги: логика, доступ, интеграции   │",
    "│ «Достаточно Burp»            │ Burp + мышление + методология + заметки      │",
    "└──────────────────────────────┴──────────────────────────────────────────────┘",
  ];

  function typeBash(lines, targetId, lineDelay = 220, charDelay = 10) {
    const el = document.getElementById(targetId);
    if (!el) return;

    el.textContent = "";
    let line = 0;
    let char = 0;
    let printed = "";

    const typeChar = () => {
      if (line >= lines.length) return;

      const currentLine = lines[line];

      if (char < currentLine.length) {
        printed += currentLine[char];
        const prev = el.textContent.split("\n").slice(0, line).join("\n");
        el.textContent = prev + (line > 0 ? "\n" : "") + printed;
        char++;
        setTimeout(typeChar, charDelay);
      } else {
        el.textContent += line < lines.length - 1 ? "\n" : "";
        line++;
        char = 0;
        printed = "";
        setTimeout(typeChar, lineDelay);
      }
    };

    typeChar();
  }

  function initTypingEffects() {
   const waptTypingLines = [
      "$ osint: start investigation ...",
      "→ subject: company / individual",
      "",
      "$ collect: open sources",
      "→ registries: ЕГРЮЛ / ФНС / суды",
      "→ media: news / leaks / publications",
      "→ digital: domains / WHOIS / соцсети",
      "",
      "$ analyze: build connections",
      "→ shared founders / directors",
      "→ affiliates / proxies / nominees",
      "→ timeline inconsistencies detected",
      "",
      "$ verify: cross-check facts",
      "→ conflicting data found",
      "→ confidence level: medium → high",
      "",
      "done: identify real decision-makers."
    ];


    typeLoop(waptTypingLines, "wapt-typing", 18, 520);

    const bashTarget = document.getElementById("wapt-bash-block");
    if (!bashTarget) return;

    if (!("IntersectionObserver" in window)) {
      typeBash(waptLines, "wapt-bash-block");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            typeBash(waptLines, "wapt-bash-block");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(bashTarget);
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

  onReady(() => {
    initIframeModal();
    initTypingEffects();
    initMatrixCanvas("matrix-bg-osint");
    initObservers();

    initCrtNoise("crt-noise-author", 18);
    initCrtNoise("crt-noise-forwhom", 18);
  });
})();

