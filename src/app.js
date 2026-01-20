function openIframe() {
  document.getElementById('iframeModal').classList.remove('hidden');
}
function closeIframe() {
  document.getElementById('iframeModal').classList.add('hidden');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeIframe();
});

const waptLines = [
      "┌──────────────────────────────┬──────────────────────────────────────────────┐",
      "│ Маркетинг / ожидания         │ Практика WAPT (black-box)                    │",
      "├──────────────────────────────┼──────────────────────────────────────────────┤",
      "│ «Запусти сканер и готово»    │ Где сканер молчит — включается логика        │",
      "│ «Подбери payload по списку»  │ Анализ флоу, ролей, валидаций, бизнес-правил │",
      "│ «Это всё про XSS»            │ Серверные баги: логика, доступ, интеграции   │",
      "│ «Достаточно Burp»            │ Burp + мышление + методология + заметки      │",
      "└──────────────────────────────┴──────────────────────────────────────────────┘"
    ];

    function typeBash(lines, targetId, lineDelay = 220, charDelay = 10) {
      const el = document.getElementById(targetId);
      if (!el) return;

      el.textContent = "";
      let line = 0;
      let char = 0;

      function typeLine() {
        if (line >= lines.length) return;

        const currentLine = lines[line];
        let printed = "";

        function typeChar() {
          if (char < currentLine.length) {
            printed += currentLine[char];
            el.textContent =
              el.textContent.split("\n").slice(0, line).join("\n") +
              (line > 0 ? "\n" : "") +
              printed;

            char++;
            setTimeout(typeChar, charDelay);
          } else {
            el.textContent += line < lines.length - 1 ? "\n" : "";
            line++;
            char = 0;
            setTimeout(typeLine, lineDelay);
          }
        }

        typeChar();
      }

      typeLine();
    }

    const waptBlock = document.getElementById("wapt-bash-block");
    if (waptBlock) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              typeBash(waptLines, "wapt-bash-block");
              observer.unobserve(waptBlock);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(waptBlock);
    }
    const waptTypingLines = [
      "$ recon: map attack surface ...",
      "→ endpoints: /auth /api /billing /admin",
      "→ roles: guest / user / manager",
      "→ stateful flow detected: checkout -> confirm -> pay",
      "",
      "$ scanner: signatures matched ...",
      "→ 0 critical found (⚠️ not a guarantee)",
      "",
      "$ manual: test business logic ...",
      "→ IDOR candidate in /api/orders/{id}",
      "→ auth bypass hypothesis: token reuse in refresh flow",
      "→ rate limits: inconsistent between routes",
      "",
      "done: prioritize by impact, not by payload list."
    ];

    function typeLoop(lines, targetId, charDelay = 18, linePause = 520) {
      const el = document.getElementById(targetId);
      if (!el) return;

      let lineIdx = 0;
      let charIdx = 0;


      function tick() {
        if (lineIdx >= lines.length) {
          setTimeout(() => {
            el.textContent = "";
            lineIdx = 0;
            charIdx = 0;
            tick();
          }, 2000);
          return;
        }

        const current = lines[lineIdx];

        if (charIdx < current.length) {
          el.textContent = el.textContent.replace(/\u2588/g, "") + current[charIdx] + cursor();
          charIdx++;
          setTimeout(tick, charDelay);
        } else {
          el.textContent = el.textContent.replace(/\u2588/g, "") + "\n";
          charIdx = 0;
          lineIdx++;
          setTimeout(tick, linePause + Math.random() * 240);
        }
      }

      tick();
    }

    document.addEventListener("DOMContentLoaded", () => {
      typeLoop(waptTypingLines, "wapt-typing", 18, 520);
    });

(function(){
  const canvas = document.getElementById("matrix-bg-osint");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const letters = "01⎋⌘⚠$@#%&≡░▓█";
  const fontSize = 18;
  let columns, drops;

  function setup() {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  }
  setup();
  window.addEventListener('resize', setup);

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.07)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";
    ctx.fillStyle = "#ffa600";
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.96) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

const globalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('animate');
    globalObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.observe').forEach(el => {
  globalObserver.observe(el);
});
document.addEventListener('DOMContentLoaded', () => {
  const crtCanvas = document.getElementById('crt-noise-author');
  if (!crtCanvas) return;
  const ctx = crtCanvas.getContext('2d');
  function resize() {
    crtCanvas.width = crtCanvas.offsetWidth || crtCanvas.clientWidth || window.innerWidth;
    crtCanvas.height = crtCanvas.offsetHeight || crtCanvas.clientHeight || window.innerHeight;
  }
  function drawCRT() {
    const w = crtCanvas.width, h = crtCanvas.height;
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const val = Math.random() * 255;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(drawCRT);
  }
  window.addEventListener('resize', resize);
  resize();
  drawCRT();
});
document.addEventListener('DOMContentLoaded', () => {
  const crtCanvas = document.getElementById('crt-noise-forwhom');
  if (!crtCanvas) return;
  const ctx = crtCanvas.getContext('2d');
  function resize() {
    crtCanvas.width = crtCanvas.offsetWidth || crtCanvas.clientWidth || window.innerWidth;
    crtCanvas.height = crtCanvas.offsetHeight || crtCanvas.clientHeight || window.innerHeight;
  }
  function drawCRT() {
    const w = crtCanvas.width, h = crtCanvas.height;
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const val = Math.random() * 255;
      img.data[i] = val;
      img.data[i + 1] = val;
      img.data[i + 2] = val;
      img.data[i + 3] = 18;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(drawCRT);
  }
  window.addEventListener('resize', resize);
  resize();
  drawCRT();
});

