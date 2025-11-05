// Play Zone: floating hearts, compliments, and confetti
(function() {
  'use strict';

  const compliments = [
    "Complete 💫",
    "Forever ♾️",
    "Calm 🌿",
    "Butterflies 🦋",
    "Blush 😳",
    "Lucky 🍀",
    "Home 🏡",
    "Peaceful 🕊️"
  ];

  let clicksCount = 0;
  const targetClicks = 10;
  let emptyShownCount = 0; // track how many empty hearts have occurred
  let complimentsPool = [];

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function refillComplimentsPool() {
    complimentsPool = shuffleArray(compliments.slice());
  }

  function getNextCompliment() {
    if (complimentsPool.length === 0) return null;
    return complimentsPool.pop();
  }

  // Confetti setup
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confetti = [];
  let rafId = null;

  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function launchConfettiBurst() {
    const colors = ['#ff8fb3', '#ffd3e3', '#ff9fbd', '#a1eafb', '#62b6cb', '#bee9e8'];
    const count = 220;
    for (let i = 0; i < count; i++) {
      confetti.push({ x: Math.random() * canvas.width, y: -20, size: 4 + Math.random() * 6, color: colors[Math.floor(Math.random() * colors.length)], vy: 2 + Math.random() * 3.5, vx: -1 + Math.random() * 2, rot: Math.random() * Math.PI * 2, vr: -0.1 + Math.random() * 0.2 });
    }
    if (!rafId) drawConfetti();
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => { p.x += p.vx; p.y += p.vy; p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color; ctx.fillRect(-p.size * 0.5, -p.size * 0.15, p.size, p.size * 0.3); ctx.restore(); });
    confetti = confetti.filter(p => p.y < canvas.height + 30);
    if (confetti.length > 0) { rafId = requestAnimationFrame(drawConfetti); } else { cancelAnimationFrame(rafId); rafId = null; }
  }

  const heartsLayer = document.querySelector('.hearts-layer');
  const complimentsLayer = document.querySelector('.compliments-layer');
  const finalMessage = document.getElementById('final-message');

  function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-emoji';
    heart.textContent = '💖';

    const left = Math.random() * 100; // vw
    const delay = Math.random() * 2.5; // s
    const dur = 8 + Math.random() * 6; // s
    const scale = 0.9 + Math.random() * 0.5;

    heart.style.left = left + 'vw';
    heart.style.bottom = '-40px';
    heart.style.animationDuration = dur + 's';
    heart.style.animationDelay = delay + 's';
    heart.style.transform = `scale(${scale})`;
    heart.style.cursor = 'pointer';

    const handleClick = (e) => {
      e.stopPropagation();
      heart.classList.add('popping');
      setTimeout(() => heart.remove(), 200);

      const rect = complimentsLayer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Balance empties vs compliments to be roughly 50/50
      const remainingClicks = targetClicks - clicksCount;
      const complimentsUsed = compliments.length - complimentsPool.length;
      let isEmpty;
      if (complimentsPool.length === 0) {
        // No compliments left, must be empty
        isEmpty = true;
      } else if (emptyShownCount > complimentsUsed) {
        // Too many empties already; prefer compliment
        isEmpty = false;
      } else if (complimentsUsed > emptyShownCount) {
        // Too many compliments already; prefer empty
        isEmpty = true;
      } else {
        // Currently balanced; pick randomly
        isEmpty = Math.random() < 0.5;
      }

      if (isEmpty) {
        emitPinkBurst(x, y);
        emptyShownCount++;
      } else {
        const nextText = getNextCompliment();
        if (nextText) {
          showCompliment(x, y, nextText);
        } else {
          // No unique compliments left — show burst instead
          emitPinkBurst(x, y);
          emptyShownCount++;
        }
      }

      clicksCount++;
      if (clicksCount >= targetClicks) revealFinalMessage();
    };

    heart.addEventListener('click', handleClick, { once: true });
    heartsLayer.appendChild(heart);
    setTimeout(() => { if (heart.parentNode) heart.parentNode.removeChild(heart); }, (delay + dur) * 1000 + 200);
  }

  function showCompliment(x, y, text) {
    const msg = document.createElement('div');
    msg.className = 'compliment';
    msg.textContent = text;
    msg.style.left = x + 'px';
    msg.style.top = y + 'px';
    complimentsLayer.appendChild(msg);
    setTimeout(() => msg.remove(), 3200);
  }

  function revealFinalMessage() { if (!finalMessage.hasAttribute('hidden')) return; finalMessage.removeAttribute('hidden'); launchConfettiBurst(); }

  function spawnLoop() { spawnHeart(); const next = 450 + Math.random() * 500; setTimeout(spawnLoop, next); }

  function emitPinkBurst(x, y) {
    const container = document.createElement('div');
    container.className = 'click-burst';
    container.style.left = x + 'px';
    container.style.top = y + 'px';

    const particleCount = 12 + Math.floor(Math.random() * 8); // 12-19
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'click-particle';
      const angle = Math.random() * Math.PI * 2;
      const distance = 18 + Math.random() * 26; // px
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.background = Math.random() < 0.5 ? '#ff8fb3' : '#ff9fbd';
      container.appendChild(p);
    }

    complimentsLayer.appendChild(container);
    setTimeout(() => container.remove(), 600);
  }

  const backBtn = document.getElementById('nav-back');
  if (backBtn) backBtn.addEventListener('click', function() { window.location.href = 'index.html'; });

  const galleryBtn = document.getElementById('nav-gallery');
  if (galleryBtn) galleryBtn.addEventListener('click', function() {
    // Placeholder: add gallery route when available
  });

  const wishesBtn = document.getElementById('nav-wishes');
  if (wishesBtn) wishesBtn.addEventListener('click', function() {
    window.location.href = 'wishes.html';
  });

  const messageBtn = document.getElementById('nav-message');
  if (messageBtn) messageBtn.addEventListener('click', function() {
    window.location.href = 'letter.html';
  });

  // Instructions modal
  const instructionModal = document.getElementById('instruction-modal');
  const instructionClose = document.getElementById('instruction-close');
  if (instructionClose && instructionModal) {
    instructionClose.addEventListener('click', function() {
      instructionModal.setAttribute('hidden', '');
    });
  }

  // Reset button
  const resetBtn = document.getElementById('nav-reset');
  if (resetBtn) resetBtn.addEventListener('click', function() {
    // Reset counters
    clicksCount = 0;
    if (typeof emptyShownCount !== 'undefined') emptyShownCount = 0;

    // Hide final message
    if (finalMessage && !finalMessage.hasAttribute('hidden')) {
      finalMessage.setAttribute('hidden', '');
    }

    // Clear any compliments or burst particles currently on screen
    if (complimentsLayer) {
      complimentsLayer.innerHTML = '';
    }

    // Stop and clear confetti
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    confetti = [];
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Refill compliments pool for uniqueness again
    refillComplimentsPool();
  });

  // Initial pool fill
  refillComplimentsPool();

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', spawnLoop); } else { spawnLoop(); }
})();


