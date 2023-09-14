// script.js
const chatBubble = document.getElementById("chat-bubble");
const chatWindow = document.getElementById("chat-window");
const closeChatButton = document.getElementById("close-chat-button");
const enterNameButton = document.getElementById("enter-name-button");
const messageInput = document.getElementById("message-input");
const nameEntryWindow = document.getElementById("name-entry-window"); // Add this line

chatBubble.addEventListener("click", () => {
    nameEntryWindow.style.display = "block";
});

closeChatButton.addEventListener("click", () => {
    // Close the chat window
    chatWindow.style.display = "none";

    // Remove the name entry window from the DOM
    nameEntryWindow.remove();
});

enterNameButton.addEventListener("click", () => {
    const userName = document.getElementById("name-input").value;

    if (userName.trim() === "") {
        alert("Please enter your name.");
    } else {
        // Remove the name entry window from the DOM
        nameEntryWindow.remove();

        // Show the chat window
        chatWindow.style.display = "block";
    }
});

// Add your chat functionality here
