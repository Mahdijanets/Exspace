if (!document.querySelector('#akustik-widget')) mountAkustik();

function mountAkustik() {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('../css/akustik-widget.css', import.meta.url);
  document.head.append(stylesheet);
  const root = document.createElement('aside');
  root.id = 'akustik-widget';
  root.setAttribute('aria-label', 'Akustik AI companion');
  root.innerHTML = `<section class="akustik-chat" id="akustik-chat" aria-label="Chat with Akustik" hidden>
    <header><div><strong>Akustik</strong><small>Your AI space companion</small></div><button class="akustik-close" type="button" aria-label="Close chat">&times;</button></header>
    <div class="akustik-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
    <form class="akustik-form"><input name="message" aria-label="Message to Akustik" placeholder="Ask Akustik anything about space..." maxlength="2000" autocomplete="off" required><button type="submit">Send</button></form>
  </section><button class="akustik-pet" type="button" aria-label="Talk to Akustik" aria-controls="akustik-chat" aria-expanded="false"><div class="akustik-avatar" aria-hidden="true"></div></button>`;
  document.body.append(root);
  const pet = root.querySelector('.akustik-pet');
  const chat = root.querySelector('.akustik-chat');
  const input = root.querySelector('input');
  const form = root.querySelector('form');
  const send = form.querySelector('button');
  const log = root.querySelector('.akustik-messages');
  const history = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const avatar = root.querySelector('.akustik-avatar');
  let state = 'idle';
  let animationTimer;
  let offset = 0;
  let lastActivity = Date.now();
  function setState(next) {
    state = next;
    const file = next === 'idle' ? 'waiting' : next;
    avatar.style.backgroundImage = `url("${new URL(`../assets/mascot/2d/akustik-${file}.png`, import.meta.url).href}")`;
    avatar.classList.toggle('is-animated', next !== 'idle' && !reduced.matches);
  }
  function settle(next, duration = 4800) {
    clearTimeout(animationTimer);
    setState(next);
    animationTimer = setTimeout(() => setState(send.disabled ? 'laptop' : 'idle'), duration);
  }
  setState('idle');
  reduced.addEventListener('change', () => {
    pet.style.transform = 'translate(0, 0)';
    offset = 0;
    setState(state);
  });
  function message(text, role = 'assistant') {
    const node = document.createElement('p');
    node.className = `akustik-message ${role}`;
    node.textContent = text;
    log.append(node);
    log.scrollTop = log.scrollHeight;
    return node;
  }
  message("Hi! I'm Akustik, your AI space companion. What would you like to explore today?");
  function toggle(open) {
    lastActivity = Date.now();
    chat.hidden = !open;
    pet.setAttribute('aria-expanded', String(open));
    pet.style.transform = 'translate(0, 0)';
    offset = 0;
    clearTimeout(animationTimer);
    if (send.disabled) setState('laptop');
    else if (open) settle('wave');
    else setState('idle');
    if (open) input.focus(); else pet.focus();
  }
  pet.addEventListener('click', () => toggle(chat.hidden));
  root.querySelector('.akustik-close').addEventListener('click', () => toggle(false));
  root.addEventListener('keydown', event => { if (event.key === 'Escape' && !chat.hidden) toggle(false); });
  setInterval(() => {
    if (!chat.hidden || document.hidden || reduced.matches || send.disabled || Date.now() - lastActivity < 30000) return;
    lastActivity = Date.now();
    if (Math.random() < .65) {
      settle('wave');
      return;
    }
    const nextOffset = -Math.random() * Math.min(110, innerWidth / 4);
    settle(nextOffset < offset ? 'run-left' : 'run-right', 8000);
    pet.style.transform = `translate(${nextOffset}px, 0)`;
    offset = nextOffset;
  }, 30000);
  input.addEventListener('input', () => {
    lastActivity = Date.now();
    if (!send.disabled) {
      clearTimeout(animationTimer);
      setState('idle');
    }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || send.disabled) return;
    lastActivity = Date.now();
    input.value = '';
    message(text, 'user');
    const pending = message('Akustik is thinking...');
    send.disabled = true;
    clearTimeout(animationTimer);
    setState('laptop');
    const messages = [...history, { role: 'user', content: text }].slice(-11);
    try {
      const response = await fetch('/api/akustik', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Acustik-Request': '1' },
        body: JSON.stringify({ messages }), signal: AbortSignal.timeout(55000),
      });
      const data = await response.json();
      if (!response.ok) {
        const errors = {
          not_configured: "My AI connection isn't ready yet. Please try again after the site owner connects it.",
          too_many_attempts: 'Let me rest a little. Please try again in 15 minutes.',
          busy: "I'm helping other explorers. Please try again in a moment.",
        };
        throw new Error(errors[data.error] || "I couldn't connect to my AI service. Please try again shortly.");
      }
      pending.textContent = data.reply;
      settle('talk', Math.min(10000, Math.max(2400, data.reply.length * 30)));
      history.push({ role: 'user', content: text }, { role: 'assistant', content: data.reply.slice(0, 2000) });
      history.splice(0, Math.max(0, history.length - 10));
    } catch (error) {
      settle('error');
      pending.textContent = error.name === 'TimeoutError' ? 'That took too long. Please try again.' : error.message;
    } finally {
      send.disabled = false;
      log.scrollTop = log.scrollHeight;
      if (!chat.hidden) input.focus();
    }
  });
}
