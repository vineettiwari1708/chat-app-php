
document.addEventListener('DOMContentLoaded', function () {
  const apiKey = 'your-unique-api-key'; // injected during script use
  const backendURL = 'https://www.websoftlogic.com/chat-api'; // PHP backend

  // Create chat UI container
  const container = document.createElement('div');
  container.id = 'simple-chat-box';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 320px;
    height: 420px;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    z-index: 9999;
    font-family: Arial, sans-serif;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;

  container.innerHTML = `
    <div style="
      background: #25D366;
      padding: 12px 15px;
      color: white;
      font-weight: bold;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      💬 Chat
      <button id="chat-close-btn" style="
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      ">×</button>
    </div>
    <div id="chat-messages" style="
      flex: 1;
      padding: 10px 15px;
      overflow-y: auto;
      font-size: 14px;
      color: #333;
      background: #f9f9f9;
    ">
      <div style="color:#666; font-style: italic;">Welcome! Start chatting below. 😊</div>
    </div>
    <div style="padding: 10px 15px; border-top: 1px solid #ddd;">
      <input type="text" id="chat-user" placeholder="Your name" style="
        width: 100%;
        margin-bottom: 6px;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 5px;
      " />
      <input type="text" id="chat-input" placeholder="Type a message..." style="
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 5px;
      " />
      <button id="chat-send" style="
        margin-top: 8px;
        width: 100%;
        padding: 10px;
        background: #25D366;
        border: none;
        color: white;
        font-weight: bold;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
      ">Send</button>
    </div>
  `;

  document.body.appendChild(container);

  // Elements
  const sendButton = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');
  const user = document.getElementById('chat-user');
  const messages = document.getElementById('chat-messages');
  const closeBtn = document.getElementById('chat-close-btn');

  // Close chat box handler
  closeBtn.onclick = () => {
    container.style.display = 'none';
  };

  // Send message
  sendButton.onclick = () => {
    const message = input.value.trim();
    const username = user.value.trim();
    if (!message || !username) return alert('Please enter your name and message.');

    fetch(`${backendURL}/send.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `key=${apiKey}&username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}`
    }).then(() => {
      input.value = '';
      fetchMessages();
    }).catch(() => alert('Error sending message.'));
  };

  // Fetch messages and update UI
  function fetchMessages() {
    fetch(`${backendURL}/get.php?key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        messages.innerHTML = '';
        if (!data.length) {
          messages.innerHTML = `<div style="color:#666; font-style: italic;">Welcome! Start chatting below. 😊</div>`;
        } else {
          data.forEach(msg => {
            const div = document.createElement('div');
            div.style.marginBottom = '8px';
            div.innerHTML = `<strong>${msg.username}</strong>: ${msg.message}`;
            messages.appendChild(div);
          });
          messages.scrollTop = messages.scrollHeight;
        }
      })
      .catch(() => {
        messages.innerHTML = `<div style="color:red;">Failed to load messages.</div>`;
      });
  }
)
  // Poll messages every 3 seconds
  setInterval(fetchMessages, 3000);
  fetchMessages(); // initial load
})();

