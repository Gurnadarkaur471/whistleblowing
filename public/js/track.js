// public/js/track.js

document.addEventListener('DOMContentLoaded', () => {
  const trackingId = window.TRACKING_ID;
  const csrfToken = window.CSRF_TOKEN;
  if (!trackingId) return;

  // --- Dead Drop Messaging ---
  const messageList = document.getElementById('messageList');
  const messageInput = document.getElementById('messageInput');
  const sendMsgBtn = document.getElementById('sendMsgBtn');

  const loadMessages = async () => {
    try {
      const res = await fetch(`/report/message/${trackingId}`);
      if (res.ok) {
        const data = await res.json();
        renderMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const renderMessages = (messages) => {
    messageList.innerHTML = '';
    if (messages.length === 0) {
      messageList.innerHTML = '<p style="text-align:center;color:#94a3b8;font-size:13px;">No messages yet...</p>';
      return;
    }
    messages.forEach(msg => {
      const isUser = msg.sender === 'user';
      const div = document.createElement('div');
      div.style.padding = '10px 15px';
      div.style.borderRadius = '8px';
      div.style.maxWidth = '80%';
      div.style.fontSize = '14px';
      div.style.wordBreak = 'break-word';
      
      if (isUser) {
        div.style.alignSelf = 'flex-end';
        div.style.background = '#3b82f6';
        div.style.color = '#fff';
      } else {
        div.style.alignSelf = 'flex-start';
        div.style.background = '#e2e8f0';
        div.style.color = '#1e293b';
      }
      
      div.innerHTML = `<strong>${isUser ? 'You' : 'Admin'}</strong> <span style="font-size:11px; opacity:0.8; margin-left:8px;">${new Date(msg.timestamp).toLocaleString()}</span><div style="margin-top:5px;">${msg.text}</div>`;
      messageList.appendChild(div);
    });
    messageList.scrollTop = messageList.scrollHeight; // auto-scroll
  };

  if (sendMsgBtn && messageInput) {
    sendMsgBtn.addEventListener('click', async () => {
      const text = messageInput.value.trim();
      if (!text) return;
      sendMsgBtn.disabled = true;
      try {
        const res = await fetch('/report/message/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
          },
          body: JSON.stringify({ trackingId, text, _csrf: csrfToken })
        });
        if (res.ok) {
          messageInput.value = '';
          await loadMessages();
        } else {
          alert('Failed to send message.');
        }
      } catch (err) {
        console.error(err);
      }
      sendMsgBtn.disabled = false;
    });

    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMsgBtn.click();
    });
  }

  // Initial load
  loadMessages();
  // Poll for new messages every 15s
  setInterval(loadMessages, 15000);


});
