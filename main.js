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

  // stories
  const stories = [
    {
      img: 'images/hackerrank.gif',
      alt: 'hackerrank orchestrate hackathon',
      read: '2 min read',
      text: [
        "so i did the hackerrank orchestrate hackathon this week and i'm still thinking about it days later, which either means it mattered or i need a hobby. probably both.",
        "it was a 24 hour challenge. build a multimodal evidence review system for damage claims. cars, laptops, packages, basically every object humans break and then try to explain away.",
        "final score: 61.4 out of 100. final rank: 82nd out of 1,773 people. top 5 percent on paper. felt like a disaster in my head, which is a very normal and very dumb way to feel about something you built from nothing in a day.",
        "funniest part is i was actually 4th after the first batch of results came out. i had already started mentally drafting my victory speech. then the rest of the leaderboard rolled in and i watched myself slide down the rankings like a stock chart after bad earnings.",
        "but honestly the rank isn't even what i keep replaying. it's how much i learned in 24 hours that actually stuck.",
        "things i'm taking with me. one, i didn't take the ai judge interview seriously enough, treated it like a formality, it was not a formality, lesson learned the slightly painful way. two, i validated on only 20 samples and called it good. the hidden evaluation set had other plans and exposed edge cases i never even considered.",
        "three, and this is the one i'm actually proud of, my methodology score was 9.8 out of 10. it reminded me ai is at its best as a thought partner, not an autocomplete machine. i treated claude like a senior engineer i could bounce ideas off, argue with, and iterate with, not something i just typed commands at and hoped for the best.",
        "under the hood there was a four stage pipeline. vision models, deterministic reconciliation, caching, retries, schema validation, adversarial defenses. more moving parts than i expected to ship in a day and somehow most of them held together.",
        "top 5 percent sounds good when i say it like that. but realizing how much room i still have to grow felt even better than the number did.",
        "i'm self taught. taught myself everything i know up to this point, which means there's a whole lot more i can still teach myself. back to learning. back to building."
      ]
    },
    {
      img: 'images/hackathon.jpg',
      alt: 'road to start hack hackathon',
      read: '3 min read',
      text: [
        "something genuinely unhinged happened to me this weekend and i need to get it down before my brain smooths over the embarrassing parts.",
        "i showed up to a hackathon solo. and not the cool \"i work better alone\" kind of solo, the kind where my supposed teammates ditched me the second i walked in. incredible start to a 24 hour event.",
        "one of the organizers took pity on me and walked me around team by team like i was a stray dog looking for somewhere warm to sleep. three teams said no. three. i have never been rejected that efficiently in my life, it was almost impressive.",
        "fourth stop was the one. a team of three whose idea i'd actually already seen on devpost before the event and liked. so when i walked up looking like a lost intern, they welcomed me in like they'd been expecting me the whole time. i still don't know how they pulled that off, it should be studied somewhere.",
        "by the time we locked in it was already 1:30pm on friday. 24 hours on the clock and we hadn't written a single line of code. cool, no pressure at all.",
        "i grabbed a pen and started sketching the architecture while the idea was still being explained to me, which is apparently just how my brain works now. tasks got split fast, research, pricing, go to market, and me on the tech stack, which is the part where i basically disappeared into a laptop for a full day.",
        "built it from scratch. typescript, next.js, react, the claude api holding the whole thing together like duct tape made of intelligence. the second npm run dev came up clean, something clicked and we were just off.",
        "my eyes did not close once. not a blink that lasted too long, nothing.",
        "my laptop, on the other hand, had very strong opinions about running for 24 hours straight and made sure i knew about it. that was a side quest all its own.",
        "but here's the actual point of all this. three strangers who didn't know my name at 1:30pm on friday were calling me a teammate by sunday morning. that doesn't happen by accident. open arms, zero ego, just pure let's build this energy the entire time.",
        "genuinely can't wait to see where this goes. the sky's just the warm up."
      ]
    }
  ];

  const storyViewer  = document.getElementById('story-viewer');
  const storyImg     = document.getElementById('story-img');
  const storyRead     = document.getElementById('story-read');
  const storyText    = document.getElementById('story-text');
  const storyProgress = document.getElementById('story-progress');
  let currentStory = 0;

  function renderStory(i) {
    currentStory = (i + stories.length) % stories.length;
    const s = stories[currentStory];
    storyImg.src = s.img;
    storyImg.alt = s.alt;
    storyRead.textContent = s.read;
    storyText.innerHTML = s.text.map(p => `<p>${p}</p>`).join('');
    storyText.scrollTop = 0;
    storyProgress.innerHTML = stories.map((_, idx) =>
      `<span class="${idx === currentStory ? 'active' : ''}"></span>`).join('');
  }

  function openStory(i) {
    renderStory(i);
    storyViewer.classList.add('open');
  }

  function closeStory() {
    storyViewer.classList.remove('open');
  }

  document.querySelectorAll('.story-bubble').forEach(btn => {
    btn.addEventListener('click', () => openStory(parseInt(btn.dataset.story, 10)));
  });

  document.getElementById('story-close').addEventListener('click', closeStory);
  document.getElementById('story-prev').addEventListener('click', () => renderStory(currentStory - 1));
  document.getElementById('story-next').addEventListener('click', () => renderStory(currentStory + 1));
  document.querySelector('.story-viewer-backdrop').addEventListener('click', closeStory);

  document.addEventListener('keydown', (e) => {
    if (!storyViewer.classList.contains('open')) return;
    if (e.key === 'Escape')     closeStory();
    if (e.key === 'ArrowLeft')  renderStory(currentStory - 1);
    if (e.key === 'ArrowRight') renderStory(currentStory + 1);
  });

  // tag click ripple
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function () {
      this.style.transform = 'scale(0.9)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });

});
