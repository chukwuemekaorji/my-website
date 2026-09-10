document.addEventListener('DOMContentLoaded', () => {

  // loader
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1500);

  // hero — split name into letters, then reveal name + rest of hero content
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const words = heroTitle.textContent.split(' ');
    heroTitle.textContent = '';
    let i = 0;
    words.forEach((word, wi) => {
      const wordGroup = document.createElement('span');
      wordGroup.className = 'word-group';
      word.split('').forEach(ch => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.style.transitionDelay = `${i * 30}ms`;
        span.textContent = ch;
        wordGroup.appendChild(span);
        i++;
      });
      heroTitle.appendChild(wordGroup);
      if (wi < words.length - 1) heroTitle.appendChild(document.createTextNode(' '));
    });
    setTimeout(() => {
      heroTitle.classList.add('in');
      heroTitle.closest('.hero-content').classList.add('in');
    }, 1600);
  }

  // nav — scrolled class + active link highlight
  const nav      = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  // AI trigger — starts near the top, docks to the bottom-right once you scroll past the hero
  const aiTrigger      = document.getElementById('ai-trigger');
  const aiTriggerLabel = document.getElementById('aiTriggerLabel');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--blue-bright)' : '';
    });

    if (aiTrigger) {
      const docked = window.scrollY > window.innerHeight * 0.6;
      aiTrigger.classList.toggle('docked', docked);
      if (aiTriggerLabel) aiTriggerLabel.textContent = docked ? 'talk w my ai' : 'talk to my ai';
    }
  });

  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // hero project stack — sits fanned out in the hero from the start; scrolling splits it apart and drops it away
  const heroScroll   = document.getElementById('heroScroll');
  const galleryStage = document.getElementById('galleryStage');
  const heroCue      = document.getElementById('heroScrollCue');
  if (heroScroll && galleryStage) {
    const items = Array.from(galleryStage.querySelectorAll('.gallery-item'));
    const mid = (items.length - 1) / 2;
    let ticking = false;

    const render = () => {
      ticking = false;
      const rect = heroScroll.getBoundingClientRect();
      const scrollable = heroScroll.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);

      if (heroCue) heroCue.style.opacity = Math.max(1 - progress / 0.08, 0);

      // scale the fall/spread distances down on narrow viewports so the stack
      // stays inside its container instead of overflowing on mobile
      const scaleFactor = Math.max(0.38, Math.min(1, window.innerWidth / 1440));

      items.forEach((item, i) => {
        const offset = i - mid;
        const restX = offset * 42 * scaleFactor;
        const restRot = offset * 7;
        const split = Math.min(Math.max((progress - i * 0.05) / 0.75, 0), 1);

        const x = restX + offset * 240 * scaleFactor * split;
        const y = 600 * scaleFactor * split;
        const rot = restRot * (1 - 0.5 * split);
        const scale = 1 - 0.12 * split;
        const opacity = 1 - split;

        item.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.zIndex = 100 - Math.abs(offset) - i;
      });
    };
    // rAF-throttled so the stack redraws every frame while scrolling, not just on scroll-event ticks
    const updateGallery = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(render); }
    };
    window.addEventListener('scroll', updateGallery, { passive: true });
    window.addEventListener('resize', updateGallery);
    render();
  }

  // footer CTA — cycle the verb
  const ctaWord = document.getElementById('ctaWordCycle');
  if (ctaWord) {
    const words = ['build', 'design', 'ship', 'create'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      ctaWord.style.opacity = 0;
      setTimeout(() => {
        ctaWord.textContent = words[i];
        ctaWord.style.opacity = 1;
      }, 250);
    }, 2200);
  }

  // 3D tilt on featured project cards
  document.querySelectorAll('.project-hero').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const r    = this.getBoundingClientRect();
      const rotX = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * 3;
      const rotY = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * -3;
      this.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', function () { this.style.transform = ''; });
  });

  // contact form — button feedback after submit
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function () {
      const btn = this.querySelector('.submit-btn span');
      if (!btn) return;
      setTimeout(() => { btn.textContent = 'Message sent ✓'; }, 100);
      setTimeout(() => { btn.textContent = 'Send message';   }, 4000);
    });
  }

  // tag click ripple
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function () {
      this.style.transform = 'scale(0.9)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });

});
