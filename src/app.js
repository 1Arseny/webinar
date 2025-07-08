// ─────────── 🌐 Общий функционал: открытие модалки ───────────
function openIframe() {
  document.getElementById('iframeModal').classList.remove('hidden');
}
function closeIframe() {
  document.getElementById('iframeModal').classList.add('hidden');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeIframe();
});

// ─────────── 1. Анимация Bash-блока (OSINT сравнение) ───────────
const osintLines = [
  "┌─────────────────────────┬─────────────────────────────┐",
  "│ Вакансия:               │ Реальность:                 │",
  "│ \"Требуется              | Собес: найдите ИНН по       |", 
  "|    OSINT-специалист\"    │ номеру машины и TikTok\"     |",
  "│                         │                             │",
  "└─────────────────────────┴─────────────────────────────┘"
];


function typeBash(lines, targetId, lineDelay = 250, charDelay = 13) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.textContent = "";
  let line = 0, char = 0;

  function typeLine() {
    if (line >= lines.length) return;
    const currentLine = lines[line];
    let printed = "";

    function typeChar() {
      if (char < currentLine.length) {
        printed += currentLine[char];
        el.textContent = (el.textContent.split("\n").slice(0, line).join("\n") + (line > 0 ? "\n" : "") + printed);
        char++;
        setTimeout(typeChar, charDelay);
      } else {
        el.textContent += (line < lines.length - 1 ? "\n" : "");
        line++;
        char = 0;
        setTimeout(typeLine, lineDelay);
      }
    }
    typeChar();
  }
  typeLine();
}
const bashBlock = document.getElementById('osint-bash-block');
if (bashBlock) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeBash(osintLines, 'osint-bash-block');
        observer.unobserve(bashBlock);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(bashBlock);
}

// ─────────── 2. Анимация "Пробива" для фонового typing ───────────
const osintProbingLines = [
  "Поиск профиля: @name ...",
  "Имя: User U.",
  "VK: vk.com/name — найдено",
  "Telegram: @user — найден",
  "E-mail: u*******@mail.ru",
  "Авто: Lexus RX (А777АА77)",
  "ИНН: ************",
  "Скан открытых источников...",
  "TikTok: найден аккаунт",
  "Github: найдено 2 репозитория",
  "Публичные фото: найдено 14",
  "Пробив завершён. ✨"
];
function typeOsintProbe(lines, targetId, delay = 28, pause = 700) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.textContent = "";
  let lineIdx = 0, charIdx = 0;
  function nextChar() {
    if (lineIdx >= lines.length) {
      setTimeout(() => { el.textContent = ""; lineIdx = 0; charIdx = 0; nextChar(); }, 2400);
      return;
    }
    if (charIdx < lines[lineIdx].length) {
      el.textContent = el.textContent.replace(/\u2588/g, "") + lines[lineIdx][charIdx] + "\u2588";
      charIdx++;
      setTimeout(nextChar, delay);
    } else {
      el.textContent = el.textContent.replace(/\u2588/g, "") + "\n";
      charIdx = 0;
      lineIdx++;
      setTimeout(nextChar, pause + Math.random() * 400);
    }
  }
  nextChar();
}
document.addEventListener("DOMContentLoaded", () => {
  typeOsintProbe(osintProbingLines, "osint-typing", 28, 700);
});

// ─────────── 3. Matrix-анимация для OSINT-demand блока ───────────
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

// ─────────── 4. IntersectionObserver для плавных появлений ───────────
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
// ─────────── 6. автор───────────
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
      img.data[i] = val;   // R
      img.data[i + 1] = val; // G
      img.data[i + 2] = val; // B
      img.data[i + 3] = 26; // Alpha (0..255)
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(drawCRT);
  }
  window.addEventListener('resize', resize);
  resize();
  drawCRT();
});
//  ─────────── 7. для кого───────────
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
