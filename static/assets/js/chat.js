// chat.js

const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

document.getElementById('send-button').addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim() !== '') {
        chatMessages.innerHTML += `<div class="user-message">${message}</div>`;
        chatInput.value = '';
        // You can also send the message to a server or use WebSocket for real-time chat here
        // For this example, we'll keep it simple and not implement server-side logic
    }
});