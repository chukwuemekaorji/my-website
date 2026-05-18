(function () {

  function observeReveal(selector, options = {}) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      });
    }, { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px 0px -60px 0px' });
    document.querySelectorAll(selector).forEach(el => obs.observe(el));
  }

  function staggerObserve(parentSelector, childSelector, baseDelay = 80) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(childSelector).forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * baseDelay);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(parentSelector).forEach(p => obs.observe(p));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    let current = 0;
    const step  = Math.ceil(1500 / target);
    const timer = setInterval(() => {
      el.textContent = ++current;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  function observeCounters() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-num[data-target]').forEach(c => obs.observe(c));
  }

  document.addEventListener('DOMContentLoaded', () => {
    observeReveal('.reveal-up');
    observeReveal('.reveal-left');
    observeReveal('.reveal-right');
    staggerObserve('.skills-grid', '.skill-card', 100);
    observeCounters();

    // project cards fade in with stagger
    const projObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        projObs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.project-card').forEach(c => {
      c.style.opacity    = '0';
      c.style.transform  = 'translateY(40px)';
      c.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      projObs.observe(c);
    });

    // featured project heroes
    const heroObs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 150);
        heroObs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.project-hero').forEach(p => {
      p.style.opacity    = '0';
      p.style.transform  = 'translateY(50px)';
      p.style.transition = 'opacity 0.9s ease, transform 0.9s ease, border-color 0.4s, box-shadow 0.4s';
      heroObs.observe(p);
    });
  });

})();
