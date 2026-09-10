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
