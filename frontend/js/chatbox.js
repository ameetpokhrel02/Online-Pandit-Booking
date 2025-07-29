// Modern Chatbox with Pandit Logo, Local Storage, and Simple Messaging
(function() {
  // Create chatbox HTML
  const chatBox = document.createElement('div');
  chatBox.id = 'pandit-chatbox';
  chatBox.style.display = 'none'; // Start hidden, show via icon
  chatBox.innerHTML = `
    <div class="chatbox-header">
      <img src="images/logo/pandit.png" alt="Pandit Logo" class="chatbox-logo">
      <span class="chatbox-title">Pandit Chat</span>
      <button class="chatbox-close" title="Close">&times;</button>
    </div>
    <div class="chatbox-messages" id="chatbox-messages"></div>
    <form class="chatbox-input-area">
      <input type="text" id="chatbox-input" placeholder="Type hi or hello..." maxlength="100" autocomplete="off" required />
      <button type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(chatBox);

  // Floating chat icon button
  const chatIcon = document.createElement('button');
  chatIcon.id = 'pandit-chatbox-icon';
  chatIcon.title = 'Open Pandit Chat';
  chatIcon.innerHTML = '<i class="fas fa-comments"></i>';
  document.body.appendChild(chatIcon);

  // Icon styles
  const style = document.createElement('style');
  style.textContent = `
    #pandit-chatbox-icon {
      position: fixed; bottom: 32px; right: 32px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%; background: #ff8000;
      color: #fff; border: none; box-shadow: 0 4px 16px rgba(25,118,210,0.13);
      font-size: 2rem; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s, box-shadow 0.2s;
      outline: none;
    }
    #pandit-chatbox-icon:hover { background: #1976d2; }
    #pandit-chatbox {
      position: fixed; bottom: 32px; right: 32px; z-index: 9999;
      width: 340px; max-width: 95vw; background: #fff; border-radius: 18px;
      box-shadow: 0 8px 32px rgba(25,118,210,0.13), 0 2px 12px rgba(255,128,0,0.10);
      font-family: inherit; display: flex; flex-direction: column;
      overflow: hidden; border: 1.5px solid #ff8000;
      animation: chatbox-pop 0.4s cubic-bezier(.4,2,.6,1) 1;
    }
    @keyframes chatbox-pop { 0%{transform:scale(0.7);opacity:0;} 100%{transform:scale(1);opacity:1;} }
    .chatbox-header {
      display: flex; align-items: center; background: #ff8000;
      color: #fff; padding: 10px 16px; font-weight: 700; font-size: 1.1rem;
      border-bottom: 1px solid #ffd6b3;
    }
    .chatbox-logo {
      width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; background: #fff;
      border: 2px solid #fff0e6; object-fit: cover;
    }
    .chatbox-title { flex: 1; }
    .chatbox-close {
      background: none; border: none; color: #fff; font-size: 1.5rem;
      cursor: pointer; margin-left: 8px; transition: color 0.2s;
    }
    .chatbox-close:hover { color: #222; }
    .chatbox-messages {
      flex: 1; padding: 16px; background: #fff8f0; overflow-y: auto;
      font-size: 1rem; min-height: 120px; max-height: 260px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .chatbox-msg { display: flex; align-items: flex-end; gap: 8px; }
    .chatbox-msg.user { justify-content: flex-end; }
    .chatbox-msg.pandit { justify-content: flex-start; }
    .chatbox-msg-bubble {
      padding: 8px 14px; border-radius: 16px; max-width: 70%;
      font-size: 1rem; line-height: 1.4;
    }
    .chatbox-msg.user .chatbox-msg-bubble {
      background: #1976d2; color: #fff; border-bottom-right-radius: 4px;
    }
    .chatbox-msg.pandit .chatbox-msg-bubble {
      background: #fff; color: #ff8000; border: 1px solid #ffd6b3; border-bottom-left-radius: 4px;
    }
    .chatbox-input-area {
      display: flex; border-top: 1px solid #ffd6b3; background: #fff;
      padding: 10px 12px;
    }
    #chatbox-input {
      flex: 1; border: 1px solid #ffd6b3; border-radius: 12px; padding: 8px 12px;
      font-size: 1rem; outline: none; margin-right: 8px;
    }
    .chatbox-input-area button {
      background: #ff8000; color: #fff; border: none; border-radius: 12px;
      padding: 8px 18px; font-size: 1rem; font-weight: 700; cursor: pointer;
      transition: background 0.2s;
    }
    .chatbox-input-area button:hover { background: #1976d2; }
    @media (max-width: 600px) { #pandit-chatbox { right: 2vw; bottom: 2vw; width: 98vw; } }
  `;
  document.head.appendChild(style);

  // Chat logic with authentication check
  let isAuthenticated = false;

  // Check authentication status
  function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    isAuthenticated = !!(token && user);
  }

  // Initialize auth check
  checkAuthStatus();
  const messagesDiv = chatBox.querySelector('#chatbox-messages');
  const input = chatBox.querySelector('#chatbox-input');
  const form = chatBox.querySelector('.chatbox-input-area');
  const closeBtn = chatBox.querySelector('.chatbox-close');

  // Load messages from localStorage
  function loadMessages() {
    const msgs = JSON.parse(localStorage.getItem('panditChatMsgs') || '[]');
    messagesDiv.innerHTML = '';
    msgs.forEach(msg => addMsg(msg.text, msg.sender, false));
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Save message
  function saveMessage(text, sender) {
    const msgs = JSON.parse(localStorage.getItem('panditChatMsgs') || '[]');
    msgs.push({ text, sender });
    localStorage.setItem('panditChatMsgs', JSON.stringify(msgs));
  }

  // Add message to chat
  function addMsg(text, sender, save = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chatbox-msg ' + sender;
    msgDiv.innerHTML = `<div class="chatbox-msg-bubble">${text}</div>`;
    messagesDiv.appendChild(msgDiv);
    if (save) saveMessage(text, sender);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Simple Pandit bot reply
  function panditReply(userText) {
    let reply = '';
    if (/^hi$/i.test(userText)) reply = 'Namaste! How can I help you?';
    else if (/^hello$/i.test(userText)) reply = 'Hello! How may I assist you?';
    else reply = 'Please say "hi" or "hello" to start.';
    setTimeout(() => addMsg(reply, 'pandit'), 500);
  }

  // Helper to check if homepage
  function isHomePage() {
    return window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/BookPandit/frontend/';
  }

  // Add persistent homepage message if on homepage
  function ensureHomePageWelcome() {
    if (!isHomePage()) return;
    const msgs = JSON.parse(localStorage.getItem('panditChatMsgs') || '[]');
    const welcomeText = "Let's chat with our pandits for any festival occasions...";
    const alreadyPresent = msgs.some(m => m.text === welcomeText && m.sender === 'pandit');
    if (!alreadyPresent) {
      msgs.unshift({ text: welcomeText, sender: 'pandit' });
      localStorage.setItem('panditChatMsgs', JSON.stringify(msgs));
    }
  }

  // Form submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    panditReply(text);
    input.value = '';
  });

  // Icon click: open chatbox, hide icons
  chatIcon.addEventListener('click', function() {
    chatBox.style.display = 'flex';
    chatIcon.style.display = 'none';
  });

  // Close button: hide chatbox, show icon
  closeBtn.addEventListener('click', function() {
    chatBox.style.display = 'none';
    chatIcon.style.display = 'flex';
  });

  // Initial
  loadMessages();
  if (messagesDiv.innerHTML === '') {
    addMsg('Namaste! Say "hi" or "hello" to chat with Pandit.', 'pandit');
  }
  // Show icon by default
  chatIcon.style.display = 'flex';
  chatBox.style.display = 'none';

  // On page load, ensure homepage welcome message
  ensureHomePageWelcome();
})();
