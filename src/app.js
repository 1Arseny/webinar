// ──────────────── 🌐 Общий функционал ────────────────
function openIframe() {
  document.getElementById('iframeModal').classList.remove('hidden');
}
function closeIframe() {
  document.getElementById('iframeModal').classList.add('hidden');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeIframe();
});

// ──────────────── 🧪 Лабораторная среда (SQLMap) ────────────────
const terminalLines = [
  'sqlmap -u "http://site.com/product?id=1"',
  '[INFO] Testing connection to the target URL...',
  '[INFO] The back-end DBMS is: MySQL',
  '[INFO] Available databases:',
  '- users',
  '- admin'
];
function typeLines(lines, delay = 400) {
  let i = 0;
  const output = document.getElementById('terminal-output');
  if (!output) return;
  function next() {
    if (i < lines.length) {
      const line = document.createElement('div');
      line.textContent = lines[i];
      output.appendChild(line);
      i++;
      setTimeout(next, delay);
    }
  }
  next();
}

// ──────────────── 🧪 Лабораторная среда (XSS-алерт) ────────────────
function showFakeAlert() {
  const alertBox = document.getElementById('fake-alert');
  const xssPanel = document.getElementById('xss-panel');
  if (!alertBox || !xssPanel) return;
  alertBox.classList.remove('hidden');
  xssPanel.classList.add('ring-2', 'ring-yellow-400', 'shadow-lg');
  setTimeout(() => {
    xssPanel.classList.remove('ring-2', 'ring-yellow-400', 'shadow-lg');
  }, 3000);
}
function closeFakeAlert() {
  const alertBox = document.getElementById('fake-alert');
  if (alertBox) alertBox.classList.add('hidden');
}

// ──────────────── 👁️ IntersectionObserver для анимаций ────────────────
const globalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('animate');

    if (entry.target.id === 'terminal-output') {
      typeLines(terminalLines);
      setTimeout(showFakeAlert, 2500);
    }

    globalObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.observe, #terminal-output').forEach(el => {
  globalObserver.observe(el);
});

// ──────────────── 💻 Секция Codeby-подход (GLOW эффект + пакеты) ────────────────
const glow = document.getElementById('codeby-glow');
const block = document.getElementById('codeby-interactive');

block.addEventListener('mousemove', (e) => {
  const rect = block.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,165,0,0.4), transparent 80%)`;
});

// PACKETS внутри блока
function spawnPacket() {
  const packet = document.createElement('div');
  packet.className = 'absolute w-2 h-2 bg-orange-400 rounded-full opacity-70 blur-sm pointer-events-none z-0';
  document.getElementById('codeby-interactive').appendChild(packet);

  const startX = Math.random() * 100;
  const duration = 3000 + Math.random() * 2000;

  packet.style.left = `${startX}%`;
  packet.style.top = `100%`;
  packet.style.transition = `top ${duration}ms linear, opacity 1s`;

  setTimeout(() => {
    packet.style.top = '-10%';
    packet.style.opacity = '0';
  }, 50);

  setTimeout(() => packet.remove(), duration + 1000);
}
setInterval(spawnPacket, 1500);

// ──────────────── 💚 Matrix Canvas ────────────────
const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrixRain() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff66";
  ctx.font = `${fontSize}px monospace`;
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrixRain, 33);

// ──────────────── 💬 Всплывающие консоль-команды (COMPARE) ────────────────
const messages = [
  "$ whoami", "$ sqlmap -u site.com?id=1 --dbs", "$ nmap -p 22,80,443", "$ sudo -l", "$ echo \"exploit launched\""
];
const consoleBox = document.getElementById("console-messages");

function showConsoleLine() {
  const line = document.createElement("div");
  line.textContent = messages[Math.floor(Math.random() * messages.length)];
  consoleBox.appendChild(line);
  setTimeout(() => line.remove(), 5000);
}
setInterval(showConsoleLine, 3000);

// ──────────────── 🔵 Пульсирующие кольца (COMPARE) ────────────────
const rainMessages = [
  "$ whoami",
  "$ sqlmap -u site.com?id=1",
  "$ curl http://target",
  "$ sudo -l",
  "$ ping 127.0.0.1",
  "$ exploit --launch",
  "$ ssh root@target",
  "$ nmap -p 80,443,22",
  "$ cat /etc/passwd"
];

function spawnCommandDrop() {
  const drop = document.createElement('div');
  drop.className = 'command-drop';
  drop.textContent = rainMessages[Math.floor(Math.random() * rainMessages.length)];

  // Позиция слева
  drop.style.left = `${Math.random() * 90}%`;

  // Стартовая позиция и стиль
  drop.style.top = '-30px';
  drop.style.position = 'absolute';
  drop.style.whiteSpace = 'nowrap';
  drop.style.fontFamily = 'monospace';
  drop.style.fontSize = '12px';
  drop.style.color = '#00ff88';
  drop.style.opacity = '0.6';
  drop.style.transition = 'transform 5s linear, opacity 5s';

  document.getElementById('command-rain').appendChild(drop);

  // Анимация вниз
  setTimeout(() => {
    drop.style.transform = `translateY(${window.innerHeight + 60}px)`;
    drop.style.opacity = '0';
  }, 10);

  // Удаление после падения
  setTimeout(() => drop.remove(), 5600);
}

// Интервал появления команд
setInterval(spawnCommandDrop, 450);
// норм текст
const typingLines = [
  ">> Уязвимость найдена в /admin/upload.php",
  ">> Payload: <script>alert(1)</script>",
  ">> Подключение к удалённой базе данных...",
  ">> Получен доступ: root@target:/#",
  ">> Ошибка конфигурации: SSH key exposure",
  ">> Эксплойт успешно выполнен."
];

function typeEffect(lines, targetId, delay = 40) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = '';
  let line = 0, char = 0;

  function type() {
    if (line >= lines.length) return;
    el.innerHTML += lines[line].charAt(char);
    char++;
    if (char < lines[line].length) {
      setTimeout(type, delay);
    } else {
      el.innerHTML += '\n';
      line++;
      char = 0;
      setTimeout(type, 500);
    }
  }
  type();
}

// Запуск только при появлении
const descriptionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      typeEffect(typingLines, 'typed-output');
      descriptionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

descriptionObserver.observe(document.getElementById('description-block'));
// 
// 8
// 
// ==== ШУМ НА CANVAS ====
const crtCanvas = document.getElementById('crt-noise-author');
if (crtCanvas) {
  const crtCtx = crtCanvas.getContext('2d');

  function resizeCRTFill() {
    crtCanvas.width = crtCanvas.offsetWidth || window.innerWidth;
    crtCanvas.height = crtCanvas.offsetHeight || window.innerHeight;
  }

  function generateCRTNoise() {
    const imageData = crtCtx.createImageData(crtCanvas.width, crtCanvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const val = Math.random() * 255;
      imageData.data[i] = val;
      imageData.data[i + 1] = val;
      imageData.data[i + 2] = val;
      imageData.data[i + 3] = 35; // Прозрачность шума
    }
    crtCtx.putImageData(imageData, 0, 0);
  }

  function loopCRTNoise() {
    generateCRTNoise();
    requestAnimationFrame(loopCRTNoise);
  }

  window.addEventListener('resize', resizeCRTFill);
  resizeCRTFill();
  loopCRTNoise();
}

// ==== СИМВОЛЫ ====
let direction = 'down';

function generateRandomColumn(length = 20) {
  const chars = '01⎋⌘⚠$#@%&≡░▓█';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length)) + '\n';
  }
  return str;
}

function spawnDataColumns(count = 30) {
  const container = document.getElementById('data-leak-animation');
  if (!container) return;

  // Удаляем сразу все колонки — вручную, принудительно
  const old = container.querySelectorAll('.data-column');
  old.forEach(el => el.remove());

  for (let i = 0; i < count; i++) {
    const span = document.createElement('div');
    span.className = 'data-column';
    span.style.left = `${Math.random() * 100}%`;
    span.style.animation = `${direction === 'down' ? 'data-fall-down' : 'data-fall-up'} 3s linear infinite`;
    
    // ❌ Больше не используем animationDelay — иначе старые колонки залипают
    // span.style.animationDelay = `${Math.random() * 2}s`;

    span.textContent = generateRandomColumn(20 + Math.floor(Math.random() * 10));
    container.appendChild(span);
  }
}


// ==== БЛИК НА ШУМЕ ====
function flashNoiseOverlay() {
  const noiseCanvas = document.getElementById('crt-noise-author');
  if (!noiseCanvas) return;

  noiseCanvas.classList.add('noise-flash');
  setTimeout(() => noiseCanvas.classList.remove('noise-flash'), 150); // быстрая вспышка
}

// ==== ЦИКЛ ====
function startAlternatingStreams() {
  spawnDataColumns();
  setInterval(() => {
    direction = direction === 'down' ? 'up' : 'down';
    flashNoiseOverlay();         // вспышка шума
    spawnDataColumns();          // обновление направления и колонок
  }, 5000);
}

window.addEventListener('DOMContentLoaded', () => {
  startAlternatingStreams();
});
