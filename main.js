document.addEventListener('DOMContentLoaded', () => {

  // loader
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1500);

  // nav — scrolled class + active link highlight
  const nav      = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--blue-bright)' : '';
    });
  });

  // smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

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
