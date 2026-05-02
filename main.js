// ─────────────────────────────────────────
//  tomasfloores_ — main.js
// ─────────────────────────────────────────

// ── Starfield ──────────────────────────────
const canvas = document.getElementById('stars-canvas');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars(count = 220) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 215, 200, ${a})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

resizeCanvas();
initStars();
requestAnimationFrame(drawStars);
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });


// Shooting stars
const shootingStarsLayer = document.getElementById('shootingStarsLayer');

function spawnShootingStar() {
  if (!shootingStarsLayer) return;

  const star = document.createElement('span');
  star.className = 'shooting-star';

  const startX = Math.random() * window.innerWidth * 0.75;
  const startY = Math.random() * window.innerHeight * 0.45;
  const travelX = 160 + Math.random() * 180;
  const travelY = 90 + Math.random() * 140;
  const trailLength = 110 + Math.random() * 90;
  const duration = 1.2 + Math.random() * 1.1;
  const angle = -18 - Math.random() * 18;

  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;
  star.style.setProperty('--trail-length', `${trailLength}px`);
  star.style.setProperty('--shoot-duration', `${duration}s`);
  star.style.setProperty('--shoot-x', `${travelX}px`);
  star.style.setProperty('--shoot-y', `${travelY}px`);
  star.style.setProperty('--shoot-angle', `${angle}deg`);

  star.addEventListener('animationend', () => {
    star.remove();
  });

  shootingStarsLayer.appendChild(star);
}

function scheduleNextShootingStar() {
  if (!shootingStarsLayer) return;

  const delay = 5000 + Math.random() * 9000;
  setTimeout(() => {
    spawnShootingStar();

    if (Math.random() > 0.72) {
      setTimeout(spawnShootingStar, 600 + Math.random() * 1400);
    }

    scheduleNextShootingStar();
  }, delay);
}

scheduleNextShootingStar();

// Spotify now playing
const nowPlayingBanner = document.getElementById('nowPlayingBanner');
const nowPlayingLink = document.getElementById('nowPlayingLink');
const nowPlayingCover = document.getElementById('nowPlayingCover');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');

function hideNowPlaying() {
  if (!nowPlayingBanner) return;
  nowPlayingBanner.hidden = true;
}

async function refreshNowPlaying() {
  if (!nowPlayingBanner) return;

  try {
    const response = await fetch('/api/spotify/now-playing', { cache: 'no-store' });
    if (!response.ok) {
      hideNowPlaying();
      return;
    }

    const data = await response.json();
    if (!data || !data.isPlaying) {
      hideNowPlaying();
      return;
    }

    nowPlayingLink.href = data.songUrl || '#';
    nowPlayingCover.src = data.image || '';
    nowPlayingCover.alt = `Portada de ${data.title || 'la cancion actual'}`;
    nowPlayingTitle.textContent = data.title || '';
    nowPlayingArtist.textContent = data.artist || '';
    nowPlayingBanner.hidden = false;
  } catch {
    hideNowPlaying();
  }
}

refreshNowPlaying();
setInterval(refreshNowPlaying, 20000);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    refreshNowPlaying();
  }
});


// ── Constellation parallax ─────────────────
const constellations = document.querySelectorAll('.constellation');

document.addEventListener('mousemove', e => {
  const nx = (e.clientX / window.innerWidth  - 0.5) * 12;
  const ny = (e.clientY / window.innerHeight - 0.5) * 8;
  constellations.forEach(el => {
    el.style.transform = `translate(${nx * 0.4}px, ${ny * 0.4}px)`;
  });
});


// ── Detect touch device ───────────────────
const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// ── Cursor tooltip (desktop) ──────────────
const cursorTrailLayer = document.createElement('div');
cursorTrailLayer.className = 'cursor-trail-layer';
document.body.appendChild(cursorTrailLayer);

const tooltip = document.createElement('div');
tooltip.className = 'cursor-tooltip';
document.body.appendChild(tooltip);

let tooltipVisible = false;
let mouseX = 0, mouseY = 0;
let lastTrailX = null, lastTrailY = null, lastTrailAt = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!isTouchDevice()) {
    if (lastTrailX === null || lastTrailY === null) {
      lastTrailX = mouseX;
      lastTrailY = mouseY;
    }

    const dx = mouseX - lastTrailX;
    const dy = mouseY - lastTrailY;
    const distance = Math.hypot(dx, dy);
    const now = performance.now();

    if (distance > 3 && now - lastTrailAt > 10) {
      const segment = document.createElement('span');
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      segment.className = 'cursor-trail-segment';
      segment.style.left = `${lastTrailX}px`;
      segment.style.top = `${lastTrailY}px`;
      segment.style.setProperty('--segment-length', `${distance}px`);
      segment.style.setProperty('--segment-duration', `${Math.min(0.42, 0.18 + distance * 0.004)}s`);
      segment.style.setProperty('--segment-angle', `${angle}deg`);

      segment.addEventListener('animationend', () => {
        segment.remove();
      });

      cursorTrailLayer.appendChild(segment);
      lastTrailAt = now;
    }

    lastTrailX = mouseX;
    lastTrailY = mouseY;
  }

  if (tooltipVisible) {
    tooltip.style.left = (mouseX + 18) + 'px';
    tooltip.style.top  = (mouseY + 14) + 'px';
  }
});

// ── Touch overlay (mobile/tablet) ─────────
let activeCard = null;

function closeTouchOverlay() {
  if (!activeCard) return;
  const overlay = activeCard.querySelector('.touch-overlay');
  if (overlay) overlay.classList.remove('visible');
  activeCard = null;
}

// Cerrar al tocar fuera de cualquier card
document.addEventListener('touchstart', e => {
  if (!e.target.closest('.photo-card')) closeTouchOverlay();
}, { passive: true });

// ── Bind events a cada card ───────────────
document.querySelectorAll('.photo-card').forEach(card => {
  const desc = card.dataset.desc;
  if (!desc) return;

  // — Desktop: tooltip flotante —
  card.addEventListener('mouseenter', () => {
    if (isTouchDevice()) return;
    tooltip.textContent = desc;
    tooltip.style.left  = (mouseX + 18) + 'px';
    tooltip.style.top   = (mouseY + 14) + 'px';
    tooltip.classList.add('visible');
    tooltipVisible = true;
  });

  card.addEventListener('mouseleave', () => {
    if (isTouchDevice()) return;
    tooltip.classList.remove('visible');
    tooltipVisible = false;
  });

  // — Mobile/tablet: overlay dentro de la card —
  // Crear overlay una sola vez por card
  const overlay = document.createElement('div');
  overlay.className = 'touch-overlay';
  overlay.innerHTML = `<span class="touch-overlay-text">${desc}</span>`;
  card.appendChild(overlay);

  card.addEventListener('touchstart', e => {
    e.stopPropagation();

    if (activeCard && activeCard !== card) {
      // Cerrar el anterior
      activeCard.querySelector('.touch-overlay').classList.remove('visible');
    }

    const isOpen = overlay.classList.contains('visible');
    overlay.classList.toggle('visible', !isOpen);
    activeCard = isOpen ? null : card;
  }, { passive: true });
});


// ── Gallery expand/collapse ────────────────
const galleryWrapper = document.getElementById('galleryWrapper');
const galleryToggle  = document.getElementById('galleryToggle');

galleryToggle.addEventListener('click', () => {
  const isExpanded = galleryWrapper.classList.contains('expanded');

  galleryWrapper.classList.toggle('expanded', !isExpanded);
  galleryToggle.classList.toggle('expanded', !isExpanded);

  // Si se colapsa, scroll suave de vuelta al inicio de la galería
  if (isExpanded) {
    galleryWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});


// Footer WhatsApp hint
const footer = document.querySelector('footer');
const whatsappWrap = document.querySelector('.social-whatsapp-wrap');

let whatsappHintTimer = null;
let whatsappSubhintTimer = null;
let footerHintsStarted = false;

function clearWhatsappHints() {
  if (whatsappHintTimer) {
    clearTimeout(whatsappHintTimer);
    whatsappHintTimer = null;
  }

  if (whatsappSubhintTimer) {
    clearTimeout(whatsappSubhintTimer);
    whatsappSubhintTimer = null;
  }

  if (!whatsappWrap) return;
  whatsappWrap.classList.remove('reveal-hint', 'reveal-subhint');
}

function startWhatsappHints() {
  if (!footer || !whatsappWrap) return;

  footerHintsStarted = true;
  clearWhatsappHints();

  whatsappHintTimer = setTimeout(() => {
    whatsappWrap.classList.add('reveal-hint');

    whatsappSubhintTimer = setTimeout(() => {
      whatsappWrap.classList.add('reveal-subhint');
    }, 2000);
  }, 5000);
}

if (footer && whatsappWrap) {
  const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.65 && !footerHintsStarted) {
        startWhatsappHints();
      }

      if (!entry.isIntersecting || entry.intersectionRatio < 0.12) {
        clearWhatsappHints();
        footerHintsStarted = false;
      }
    });
  }, {
    threshold: [0.12, 0.65],
  });

  footerObserver.observe(footer);
}


// ── Categories: solo decorativas, sin interacción ──
// (sin lógica de filtro)
