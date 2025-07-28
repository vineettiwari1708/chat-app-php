(function () {
  const apiKey = 'your-unique-api-key'; // injected during script use
  const backendURL = 'https://yourserver.com/chat-api'; // PHP backend

  // Create chat UI
  const container = document.createElement('div');
  container.id = 'simple-chat-box';
  container.style.cssText = 'position:fixed;bottom:20px;right:20px;width:300px;height:400px;background:#fff;border:1px solid #ccc;box-shadow:0 2px 10px rgba(0,0,0,0.3);z-index:9999;font-family:sans-serif;border-radius:10px;overflow:hidden;';
  container.innerHTML = `
    <div style="background:#25D366;padding:10px;color:white;font-weight:bold;">💬 Chat</div>
    <div id="chat-messages" style="padding:10px;height:300px;overflow-y:auto;font-size:14px;"></div>
    <div style="padding:10px;border-top:1px solid #ddd;">
      <input type="text" id="chat-user" placeholder="Your name" style="width:100%;margin-bottom:5px;" />
      <input type="text" id="chat-input" placeholder="Type a message..." style="width:100%;" />
      <button id="chat-send" style="margin-top:5px;width:100%;">Send</button>
    </div>
  `;
  document.body.appendChild(container);

  const sendButton = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');
  const user = document.getElementById('chat-user');
  const messages = document.getElementById('chat-messages');

  sendButton.onclick = function () {
    const message = input.value.trim();
    const username = user.value.trim();
    if (!message || !username) return;

    fetch(`${backendURL}/send.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `key=${apiKey}&username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}`
    }).then(() => {
      input.value = '';
      fetchMessages(); // optional: refresh
    });
  };

  function fetchMessages() {
    fetch(`${backendURL}/get.php?key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        messages.innerHTML = '';
        data.forEach(msg => {
          const div = document.createElement('div');
          div.innerHTML = `<strong>${msg.username}</strong>: ${msg.message}`;
          messages.appendChild(div);
        });
        messages.scrollTop = messages.scrollHeight;
      });
  }

  setInterval(fetchMessages, 3000);
  fetchMessages(); // initial
})();
