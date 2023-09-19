/**
 * Variables
 */



let chatName = ''
let chatSocket = null
let chatWindowUrl = window.location.href
let chatRoomUuid = Math.random().toString(36).slice(2, 12)



/**
 * Elements
 */

const chatElement = document.querySelector('#chat')
const chatOpenElement = document.querySelector('#chat_open')
const chatJoinElement = document.querySelector('#chat_join')
const chatIconElement = document.querySelector('#chat_icon')
const chatWelcomeElement = document.querySelector('#chat_welcome')
const chatRoomElement = document.querySelector('#chat_room')
const chatNameElement = document.querySelector('#chat_name')
const chatLogElement = document.querySelector('#chat_log')
const chatInputElement = document.querySelector('#chat_message_input')
const chatSubmitElement = document.querySelector('#chat_message_submit')



/**
 * Functions
 */

function getCookie(name) {
    var cookieValue = null

    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';')

        for (var i = 0; i < cookies.length; i ++) {
            var cookie = cookies[i].trim()

            if (cookie.substring(0, name.length + 1) === (name + '=')){
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                break
            }
        }
    }

    return cookieValue
}

function scrollToBottom() {
    // Scroll to the bottom of the chat log
    chatLogElement.scrollTop = chatLogElement.scrollHeight;
}

function formatTimeDifference(timeDifference) {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ' ago'}`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ' ago'}`;
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ' ago'}`;
    }
}
// Function to update the timestamp text

function sendMessage() {
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'message': chatInputElement.value,
        'name': chatName
    }))

    chatInputElement.value = ''
}
function onChatMessage(data) {
    console.log('onChatMessage', data);
    const message = document.getElementById("chat_message_input").value;

    if (data.type === 'chat_message') {
        // Create a container div for the chat message
        const container = document.createElement('div');
        container.classList.add('flex', 'w-full', 'mt-2', 'space-x-3', 'max-w-d'); // Apply CSS classes

        // Create the initials circle div
        const initialsDiv = document.createElement('div');
        initialsDiv.classList.add('flex-shrink-0', 'h-10', 'w-10', 'rounded-full', 'bg-gray-300', 'text-center', 'pt-2'); // Apply CSS classes
        initialsDiv.textContent = data.initials; // Set initials

        // Create the message container div
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container', ); // Apply CSS classes

        // Create the message text paragraph
        const messageText = document.createElement('p');
        messageText.classList.add('message-text', 'text-sm'); // Apply CSS classes
        messageText.textContent = data.message; // Set message text

        // Create the timestamp span
        const timestampSpan = document.createElement('span');
        const created_at = new Date(data.created_at)
        const now = new Date()
        const timeDifference = now - created_at;


        const formattedTimeDifference = formatTimeDifference(timeDifference)

        timestampSpan.classList.add('timestamp'); // Apply CSS classes
        timestampSpan.textContent = formattedTimeDifference + ''; // Set timestamp text
        timestampSpan.setAttribute('data-created-at', data.created_at);


        // Append elements to the hierarchy
        messageContainer.appendChild(messageText);
        container.appendChild(messageContainer);
        container.appendChild(initialsDiv);


        const timestampWrapper = document.createElement('div');
        timestampWrapper.classList.add('timestamp-wrapper');
        timestampWrapper.appendChild(timestampSpan);

        // Append the dynamically created container to your chat log
        chatLogElement.appendChild(container);
        chatLogElement.appendChild(timestampWrapper);

        scrollToBottom()
        document.getElementById("chat_message_input").value = "";
    }
}

// Function to update timestamps for all chat messages
function updateTimestamps() {
    const chatMessages = document.querySelectorAll('.timestamp');

    chatMessages.forEach((timestampElement) => {

        const created_at = new Date(timestampElement.getAttribute('data-created-at'));
        const now = new Date();
        const timeDifference = now - created_at;
        const formattedTimeDifference = formatTimeDifference(timeDifference);

        timestampElement.textContent = formattedTimeDifference + '';
    });
}

// Call the updateTimestamps function initially and at regular intervals



async function joinChatRoom() {
    console.log('joinChatRoom')

    chatName = chatNameElement.value

    console.log('Join as:', chatName)
    console.log('Room uuid:', chatRoomUuid)

    const data = new FormData()
    data.append('name', chatName)
    data.append('url', chatWindowUrl)

    await fetch(`/api/create-room/${chatRoomUuid}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: data
    })
    .then(function(res) {
        return res.json()

    })
    .then(function (data){
        console.log('data', data)
    })

    chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoomUuid}/`)

    chatSocket.onmessage = function (e) {
        console.log('onMessage')

        onChatMessage(JSON.parse(e.data))
    }

    chatSocket.onopen = function (e) {
        console.log('onOpen - chat socket was opened')
    }

    chatSocket.onclose = function (e) {
        console.log('onClose - chat socket was closed')
    }
}


/**
 * Event Listeners
 */

chatOpenElement.onclick = function (e) {
    e.preventDefault()

    chatIconElement.classList.add('hidden')
    chatWelcomeElement.classList.remove('hidden')

    return false
}



chatJoinElement.onclick = function (e) {
    e.preventDefault()

    chatWelcomeElement.classList.add('hidden')
    chatRoomElement.classList.remove('hidden')

    joinChatRoom()

    return false
}


chatSubmitElement.onclick = function (e) {
    e.preventDefault()

    sendMessage()

    return false
}

document.getElementById("chat_message_input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the Enter key from creating a new line
        // Call a function to send the message here
        sendMessage();
    }
});

setInterval(updateTimestamps, 60000); // Update every minute (adjust as needed)
