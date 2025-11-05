// Lightweight confetti + heart particles + interactions
(function () {
  const $ = (sel) => document.querySelector(sel);
  const toastTemplate = $('#toast-template');

  function showToast(message) {
    if (!toastTemplate) return;
    const node = toastTemplate.content.firstElementChild.cloneNode(true);
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2800);
  }

  // Removed cross-page return notice; toasts are shown before navigation on source pages

  // Confetti
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const colors = ['#ff8fb3', '#ffd3e3', '#ff9fbd', '#ffa9c6', '#ffc4d6'];
  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticles(count) {
    const twoPi = Math.PI * 2;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        r: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 3.5,
        vx: -1 + Math.random() * 2,
        rot: Math.random() * twoPi,
        vr: -0.1 + Math.random() * 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-p.r, 0);
      ctx.lineTo(0, -p.r * 0.6);
      ctx.lineTo(p.r, 0);
      ctx.lineTo(0, p.r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    particles = particles.filter((p) => p.y < canvas.height + 30);
    if (particles.length > 0) {
      animationId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function launchConfetti() {
    createParticles(150);
    if (!animationId) draw();
  }

  // Heart particles
  function createHeartParticles(buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const heartCount = 8;
    const heartColors = ['#ff69b4', '#ff1493', '#ff6b9d', '#ff8fb3', '#ffb3d1'];
    
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.innerHTML = '❤️';
      
      // Random direction and speed
      const angle = (i / heartCount) * Math.PI * 2;
      const speed = 80 + Math.random() * 40;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 30; // slight upward bias
      
      heart.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        font-size: 16px;
        pointer-events: none;
        z-index: 200;
        animation: heartFloat 1.5s ease-out forwards;
        --vx: ${vx}px;
        --vy: ${vy}px;
      `;
      
      document.body.appendChild(heart);
      
      // Remove after animation
      setTimeout(() => heart.remove(), 1500);
    }
  }

  // Add heart animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes heartFloat {
      0% {
        transform: translate(0, 0) scale(0) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: translate(var(--vx), var(--vy)) scale(1) rotate(180deg);
        opacity: 0.8;
      }
      100% {
        transform: translate(calc(var(--vx) * 1.5), calc(var(--vy) * 1.5)) scale(0.3) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Button bindings with heart particles
  const actions = [
    ['#btn-gallery', 'Opening Memories Gallery 🖼️'],
    ['#btn-message', 'Opening Message 💌'],
    ['#btn-music', 'Opening Playlist 🎵']
  ];
  
  actions.forEach(([sel, msg]) => {
    const el = $(sel);
    if (el) {
      el.addEventListener('click', (e) => {
        createHeartParticles(e.target);
        showToast(msg);
      });
    }
  });

  // Special handling for Birthday Wishes button - redirect to wishes page
  const wishesBtn = $('#btn-wishes');
  if (wishesBtn) {
    wishesBtn.addEventListener('click', (e) => {
      createHeartParticles(e.target);
      showToast('Opening Birthday Wishes ✨');
      
      // Add a small delay for the animation to show, then redirect
      setTimeout(() => {
        window.location.href = 'wishes.html';
      }, 800);
    });
  }

  // Message button - redirect to letter page
  const messageBtn = $('#btn-message');
  if (messageBtn) {
    messageBtn.addEventListener('click', (e) => {
      createHeartParticles(e.target);
      showToast('Opening Message 💌');
      setTimeout(() => {
        window.location.href = 'letter.html';
      }, 800);
    });
  }

  // Music button - redirect to Play Zone page
  const musicBtn = $('#btn-music');
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      createHeartParticles(e.target);
      showToast('Opening Play Zone 💘');
      setTimeout(() => {
        window.location.href = 'play-zone.html';
      }, 800);
    });
  }

  // Gift Box Burst Effect
  function createRoseParticles(centerX, centerY, count = 30) {
    for (let i = 0; i < count; i++) {
      const rose = document.createElement('div');
      rose.className = 'rose-particle';
      rose.textContent = '🌹';
      
      // Random direction in all directions
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 150 + Math.random() * 100;
      const distance = speed * (1 + Math.random() * 0.5);
      const vx = Math.cos(angle) * distance;
      const vy = Math.sin(angle) * distance;
      
      const rotation = Math.random() * 720;
      const scale = 0.5 + Math.random() * 0.5;
      
      rose.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        font-size: ${24 + Math.random() * 16}px;
        pointer-events: none;
        z-index: 200;
        animation: roseFlyOut 2s ease-out forwards;
        --vx: ${vx}px;
        --vy: ${vy}px;
        --rotation: ${rotation}deg;
        --scale: ${scale};
      `;
      
      document.body.appendChild(rose);
      
      // Remove after animation
      setTimeout(() => rose.remove(), 2000);
    }
  }

  // Add rose animation CSS
  if (!document.querySelector('#rose-animations')) {
    const roseStyle = document.createElement('style');
    roseStyle.id = 'rose-animations';
    roseStyle.textContent = `
      @keyframes roseFlyOut {
        0% {
          transform: translate(0, 0) rotate(0deg) scale(1);
          opacity: 1;
        }
        50% {
          transform: translate(calc(var(--vx) * 0.5), calc(var(--vy) * 0.5)) rotate(calc(var(--rotation) * 0.5)) scale(var(--scale));
          opacity: 0.9;
        }
        100% {
          transform: translate(var(--vx), var(--vy)) rotate(var(--rotation)) scale(0.3);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(roseStyle);
  }

  // Gift Box Click Handler
  const giftBoxOverlay = $('#gift-box-overlay');
  const roseReveal = $('#rose-reveal');
  const birthdayVideo = $('#birthday-video');
  
  if (giftBoxOverlay) {
    let hasOpened = false;
    
    giftBoxOverlay.addEventListener('click', function(e) {
      if (hasOpened) return;
      hasOpened = true;
      
      // Get center position of gift box
      const rect = giftBoxOverlay.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Add burst class to trigger lid animation
      giftBoxOverlay.classList.add('burst');
      
      // Create rose particles bursting in all directions
      createRoseParticles(centerX, centerY, 40);
      
      // Launch confetti
      launchConfetti();
      
      // Show toast
      showToast('Surprise! 🌹💕');
      
      // Hide gift box and show rose after a delay
      setTimeout(() => {
        giftBoxOverlay.style.display = 'none';
        roseReveal.removeAttribute('hidden');
        // Trigger reflow to ensure the element is visible before adding class
        void roseReveal.offsetWidth;
        roseReveal.classList.add('show');
        
        // After showing rose for 3 seconds, smoothly fade out and show video
        setTimeout(() => {
          // Start fade out animation
          roseReveal.classList.add('fade-out');
          roseReveal.classList.remove('show');
          
          // Show video and start fade in
          birthdayVideo.style.display = 'block';
          birthdayVideo.style.zIndex = '1';
          
          // Trigger reflow to ensure video is visible before fade in
          void birthdayVideo.offsetWidth;
          birthdayVideo.classList.add('show');
          
          // Hide rose reveal completely after fade out completes
          setTimeout(() => {
            roseReveal.setAttribute('hidden', '');
            roseReveal.classList.remove('fade-out');
          }, 800);
        }, 3000);
      }, 800);
    });
  }

})();
