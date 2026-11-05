document.addEventListener('DOMContentLoaded', () => {

  // entry gate (home page only)
  const gate = document.getElementById('gate');
  // people already on the site (e.g. coming back from the projects page) don't get the card again
  let cameFromSite = false;
  try { cameFromSite = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  if (gate && cameFromSite) {
    gate.classList.add('hidden');
    gate.style.display = 'none';
  } else if (gate) {
    const card = gate.querySelector('.gate-card');
    const gateImg = gate.querySelector('.gate-img');
    const gateText = document.getElementById('gateText');
    const gateActions = document.getElementById('gateActions');
    document.body.style.overflow = 'hidden';

    const INTRO = "well, my name is chukwuemeka orji (yeah ik, you cant pronounce it), just call me \"chuk\" or \"samuel\" if you may. im 20 and i currently work as an ai, automation and digital operations specialist. sounds fun yeah ? it is cos i do a bunch of things. well, i love to play football, i love to play video games, id beat you in fifa, add me @emekamustshine1. i also like to draw and watch creepy-ass documentaries. im not a fan of movies except its really trending; i'm the 15 seasons series kind of guy. i believe im quiet on the outside and im soft spoken. im single (and searching 😂). well that's enough ab my personal life";

    const showChoice = (question, onYes) => {
      gateText.textContent = question;
      gateActions.style.display = '';
      gateActions.innerHTML = '<button class="gate-btn" data-a="yes" type="button">yes</button><button class="gate-btn" data-a="no" type="button">no</button>';
      gateActions.querySelector('[data-a="yes"]').addEventListener('click', onYes);
      gateActions.querySelector('[data-a="no"]').addEventListener('click', () => {
        gateText.textContent = "okay, i'll wait till you stop lying and click yes";
        gateActions.innerHTML = '<button class="gate-btn" type="button">yes</button>';
        gateActions.firstChild.addEventListener('click', onYes);
      });
    };

    const closeGate = () => {
      gate.classList.add('hidden');
      document.body.style.overflow = '';
      location.hash = '#projects';
    };

    const typeIntro = () => {
      gate.classList.add('typing');
      card.classList.add('wide');
      if (gateImg) gateImg.style.display = 'none';
      gateActions.style.display = 'none';
      gateActions.innerHTML = '';
      gateText.classList.add('typed');
      gateText.textContent = '';
      let i = 0;
      const tick = () => {
        gateText.textContent = [...INTRO].slice(0, ++i).join('');
        if (i < [...INTRO].length) {
          const ch = INTRO[i - 1];
          setTimeout(tick, /[.,;?]/.test(ch) ? 220 : 28);
        } else {
          gateActions.innerHTML = '<button class="gate-btn" type="button">next</button>';
          gateActions.style.display = '';
          gateActions.firstChild.addEventListener('click', () => {
            gate.classList.remove('typing');
            gateText.classList.remove('typed');
            card.classList.remove('wide');
            showChoice('do you want to hear ab all the projects ive created?! (or read ab them basically)', closeGate);
          });
        }
      };
      tick();
    };

    const onYes = () => {
      gateText.textContent = 'obviously, who wouldn\'t 😛';
      gateActions.style.display = 'none';
      setTimeout(typeIntro, 1100);
    };

    document.getElementById('gateYes').addEventListener('click', onYes);
    document.getElementById('gateNo').addEventListener('click', () => {
      gateText.textContent = "okay, i'll wait till you stop lying and click yes";
      gateActions.innerHTML = '<button class="gate-btn" type="button">yes</button>';
      gateActions.firstChild.addEventListener('click', onYes);
    });
  }

  // routes — #projects (default), #about, #stories, #experience and #contact each show only that section
  const sections = document.querySelectorAll('section[id]');
  const VIEWS = ['projects', 'about', 'stories', 'experience', 'contact'];
  const PAGE_TITLES = {
    projects: "Things I've built",
    about: 'More about me',
    stories: 'A few stories',
    experience: "Where I've worked",
    contact: 'Contact'
  };
  const route = () => {
    const id = location.hash.slice(1);
    const view = VIEWS.includes(id) ? id : 'projects';
    sections.forEach(sec => sec.classList.toggle('active-view', sec.id === view));
    // instant — html has smooth scrolling, which would animate from the old position and land on the footer
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.dispatchEvent(new Event('viewchange'));
    // browser tab shows which section you're on
    document.title = PAGE_TITLES[view] + ' — Chukwuemeka Orji';
    // each section counts as its own page in Google Analytics (/projects, /about, ...)
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: PAGE_TITLES[view] + ' — Chukwuemeka Orji',
        page_path: '/' + view,
        page_location: location.origin + '/' + view
      });
    }
  };
  window.addEventListener('hashchange', route);
  route();

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

  // contact — receipt printer: processing -> printing -> complete as soon as the contact page is entered
  const printer = document.getElementById('printer');
  if (printer) {
    const status = document.getElementById('printerStatus');
    const labels = { processing: 'Processing your message', printing: 'Printing my contact', complete: 'Receipt ready' };
    const setStage = stage => {
      printer.dataset.stage = stage;
      status.textContent = labels[stage];
      status.classList.remove('swap');
      void status.offsetWidth;
      status.classList.add('swap');
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gateOpen = () => { const g = document.getElementById('gate'); return g && !g.classList.contains('hidden'); };
    let started = false, timers = [];
    const play = () => {
      timers.forEach(clearTimeout);
      setStage('processing');
      if (reduce) { setStage('complete'); return; }
      timers = [
        setTimeout(() => setStage('printing'), 600),
        setTimeout(() => setStage('complete'), 600 + 1750)
      ];
    };
    const start = () => {
      if (started || gateOpen()) return;
      started = true;
      play();
    };
    document.addEventListener('viewchange', () => { if (location.hash === '#contact') start(); });
    new IntersectionObserver(entries => { if (entries[0].isIntersecting) start(); }, { threshold: 0.3 }).observe(printer);

    const replay = document.getElementById('printerReplay');
    if (replay) replay.addEventListener('click', () => { started = true; play(); });
  }

  // contact form — toggled open from under the receipt, sent in place so visitors stay on the site
  const formToggle = document.getElementById('formToggle');
  const formWrap = document.getElementById('contactFormWrap');
  if (formToggle && formWrap) {
    formToggle.addEventListener('click', () => {
      const open = formWrap.hidden;
      formWrap.hidden = !open;
      formToggle.setAttribute('aria-expanded', String(open));
      if (open) formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      if (!window.fetch) return;
      e.preventDefault();
      const label = contactForm.querySelector('.submit-btn span');
      label.textContent = 'Sending...';
      try {
        const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
        contactForm.reset();
        label.textContent = 'Message sent ✓';
      } catch (err) {
        label.textContent = 'Failed — try again';
      }
      setTimeout(() => { label.textContent = 'Send message'; }, 4000);
    });
  }

  // site menu — floating button, opens a list of every page
  const menuBtn = document.getElementById('menuBtn');
  const menuPanel = document.getElementById('menuPanel');
  if (menuBtn && menuPanel) {
    const setMenu = open => { menuPanel.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); };
    menuBtn.addEventListener('click', () => setMenu(menuPanel.hidden));
    menuPanel.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', e => { if (!e.target.closest('#site-menu')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  // footer year — always the current year
  document.querySelectorAll('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  // tag click ripple
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function () {
      this.style.transform = 'scale(0.9)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });

});
