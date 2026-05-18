(function () {
  const ENDPOINT = '/api/chat';
  const history = [];

  const btn   = document.getElementById('chat-btn');
  const panel = document.getElementById('chat-panel');
  const input = document.getElementById('chat-input');
  const send  = document.getElementById('chat-send');
  const msgs  = document.getElementById('chat-messages');

  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    btn.classList.toggle('open', open);
    if (open) input.focus();
  });

  send.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });

  function submit() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    ask();
  }

  async function ask() {
    const typing = addTyping();
    try {
      const res  = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      typing.remove();
      if (res.status === 429) {
        addMsg('bot', data.error);
        return;
      }
      const reply = data.reply || 'Something went wrong — try again.';
      history.push({ role: 'assistant', content: reply });
      addMsg('bot', reply);
    } catch {
      typing.remove();
      addMsg('bot', 'Connection issue — try again in a moment.');
    }
  }

  // strip emojis so TTS doesn't say "crying face" etc.
  function cleanForSpeech(text) {
    return text.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\u{FE00}-\u{FEFF}]/gu, '').trim();
  }

  // priority list of warm male voices across Windows, Mac, iOS, Android
  const VOICE_PRIORITY = [
    'Microsoft Guy Online (Natural) - English (United States)',
    'Microsoft Christopher Online (Natural) - English (United States)',
    'Microsoft Eric Online (Natural) - English (United States)',
    'Microsoft Ryan Online (Natural) - English (United Kingdom)',
    'Google UK English Male',
    'Google US English',
    'Daniel',   // Mac / iOS — British male, sounds warm
    'Tom',      // Mac
    'Alex',     // Mac
    'Fred',     // Mac
  ];

  let lockedVoice = null;
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    for (const name of VOICE_PRIORITY) {
      const match = voices.find(v => v.name === name);
      if (match) { lockedVoice = match; return; }
    }
    // fallback: any English voice
    lockedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  }
  speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();

  function addMsg(role, text) {
    const el = document.createElement('div');
    el.className = `msg ${role}`;
    el.textContent = text;

    if (role === 'bot') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'play-btn';
      btn.setAttribute('aria-label', 'Play voice');
      btn.innerHTML = '▶';
      function playText() {
        window.speechSynthesis.cancel();
        btn.innerHTML = '⏸';
        const utter = new SpeechSynthesisUtterance(cleanForSpeech(text));
        utter.voice = lockedVoice;
        utter.rate  = 0.95;
        utter.pitch = 1;
        utter.onend = () => { btn.innerHTML = '▶'; };
        window.speechSynthesis.speak(utter);
      }

      btn.onclick = () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          btn.innerHTML = '▶';
        } else {
          playText();
        }
      };

      el.appendChild(btn);

      // auto-play as soon as the message appears
      playText();
    }

    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function addTyping() {
    const el = document.createElement('div');
    el.className = 'msg bot typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }
})();
