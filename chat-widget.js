(function () {
  const ENDPOINT = '/api/chat';
  const history = [];

  const btn     = document.getElementById('chat-btn');
  const panel   = document.getElementById('chat-panel');
  const input   = document.getElementById('chat-input');
  const send    = document.getElementById('chat-send');
  const msgs    = document.getElementById('chat-messages');
  const trigger = document.getElementById('ai-trigger');
  const closeBtn = document.getElementById('chat-close');

  function setOpen(open) {
    panel.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    if (trigger) trigger.classList.toggle('chat-open', open);
    // the panel is top-anchored on mobile now (see chat-widget.css), so it
    // stays fully visible above the keyboard — safe to focus on any device
    if (open) input.focus();
  }

  btn.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));

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

  function addMsg(role, text) {
    const el = document.createElement('div');
    el.className = `msg ${role}`;
    el.textContent = text;
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
